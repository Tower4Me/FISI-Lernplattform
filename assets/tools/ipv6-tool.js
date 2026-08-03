/* ==========================================================================
   ipv6-tool.js — zwei Teilwerkzeuge: (1) IPv6-Adresse expandieren/kuerzen,
   (2) EUI-64-Interface-Identifier + Link-Local-Adresse aus einer MAC-Adresse.

   Einbindung: <div class="tool" data-tool="ipv6-tool"></div>
   ========================================================================== */

(function () {
  "use strict";

  // -------------------------------------------------- IPv6-Adresse: Parsing

  // Expandiert eine IPv6-Adresse (mit optionaler "::"-Kuerzung) zu einem
  // Array aus 8 Gruppen, jede vierstellig hex, kleingeschrieben.
  // Gibt bei Fehler { error: "..." } zurueck.
  function expandAddress(raw) {
    var addr = String(raw || "").trim().toLowerCase();
    if (!addr) return { error: "Bitte eine IPv6-Adresse eingeben." };
    if (addr.indexOf(".") !== -1) {
      return { error: "IPv4-eingebettete Notation (z. B. ::ffff:192.168.1.1) wird von diesem Tool nicht unterstützt." };
    }

    var doubleColonParts = addr.split("::");
    var groups;

    if (doubleColonParts.length > 2) {
      return { error: "Ungültige Adresse — „::“ darf höchstens einmal vorkommen." };
    }

    if (doubleColonParts.length === 2) {
      var left = doubleColonParts[0];
      var right = doubleColonParts[1];
      var leftGroups = left === "" ? [] : left.split(":");
      var rightGroups = right === "" ? [] : right.split(":");
      var zerosNeeded = 8 - (leftGroups.length + rightGroups.length);
      if (zerosNeeded < 0) {
        return { error: "Ungültige Adresse — zu viele Blöcke für eine 128-Bit-IPv6-Adresse." };
      }
      var middle = [];
      for (var i = 0; i < zerosNeeded; i++) middle.push("0000");
      groups = leftGroups.concat(middle, rightGroups);
    } else {
      groups = addr.split(":");
      if (groups.length !== 8) {
        return { error: "Ungültige Adresse — eine vollständige IPv6-Adresse braucht 8 Blöcke (oder eine „::“-Kürzung)." };
      }
    }

    var result = [];
    for (var j = 0; j < groups.length; j++) {
      var g = groups[j];
      if (!/^[0-9a-f]{1,4}$/.test(g)) {
        return { error: "Ungültiger Block „" + (g || "(leer)") + "“ — jeder Block darf nur 1–4 Hex-Ziffern enthalten." };
      }
      result.push(("0000" + g).slice(-4));
    }
    return { groups: result };
  }

  // Erzeugt aus 8 vollen Gruppen die kuerzeste erlaubte Schreibweise:
  // fuehrende Nullen je Block entfernt + laengste Nullblock-Folge (>=2) per "::".
  function compressGroups(groups) {
    var bestStart = -1;
    var bestLen = 0;
    var curStart = -1;
    var curLen = 0;
    for (var i = 0; i < groups.length; i++) {
      if (groups[i] === "0000") {
        if (curStart === -1) curStart = i;
        curLen++;
        if (curLen > bestLen) {
          bestLen = curLen;
          bestStart = curStart;
        }
      } else {
        curStart = -1;
        curLen = 0;
      }
    }

    var shortGroups = groups.map(function (g) {
      return parseInt(g, 16).toString(16);
    });

    if (bestLen < 2) {
      return shortGroups.join(":");
    }

    var before = shortGroups.slice(0, bestStart);
    var after = shortGroups.slice(bestStart + bestLen);
    return before.join(":") + "::" + after.join(":");
  }

  // ------------------------------------------------------- EUI-64 aus MAC

  function parseMac(raw) {
    var s = String(raw || "").trim().toLowerCase().replace(/[:\-.]/g, "");
    if (!/^[0-9a-f]{12}$/.test(s)) {
      return { error: "Ungültige MAC-Adresse — bitte 12 Hex-Ziffern eingeben (z. B. 00:1A:2B:3C:4D:5E)." };
    }
    var bytes = [];
    for (var i = 0; i < 12; i += 2) bytes.push(s.slice(i, i + 2));
    return { bytes: bytes };
  }

  function buildTool(container) {
    container.innerHTML =
      '<div>' +
      '<p class="tool__hint" style="margin-top:0;"><strong>IPv6-Adresse kürzen/expandieren</strong></p>' +
      '<label class="tool__label" for="ipv6t-addr">IPv6-Adresse</label>' +
      '<input class="tool__input" type="text" id="ipv6t-addr" placeholder="z. B. 2001:0db8:0000:0000:0000:ff00:0042:8329 oder 2001:db8::ff00:42:8329" autocomplete="off" value="2001:0db8:0000:0000:0000:ff00:0042:8329">' +
      '<button class="btn btn--primary" type="button" id="ipv6t-addr-btn">Berechnen</button>' +
      '<p class="tool__error" id="ipv6t-addr-error" hidden></p>' +
      '<dl class="tool__result" id="ipv6t-addr-result" hidden>' +
      '<div class="tool__result-row"><dt>Expandiert (voll ausgeschrieben)</dt><dd id="ipv6t-addr-full"></dd></div>' +
      '<div class="tool__result-row"><dt>Gekürzt (kürzeste Schreibweise)</dt><dd id="ipv6t-addr-short"></dd></div>' +
      "</dl>" +
      "</div>" +
      '<div style="margin-top:1.25rem;padding-top:1rem;border-top:1px solid var(--border);">' +
      '<p class="tool__hint" style="margin-top:0;"><strong>EUI-64: Interface-Identifier aus MAC-Adresse</strong></p>' +
      '<label class="tool__label" for="ipv6t-mac">MAC-Adresse</label>' +
      '<input class="tool__input" type="text" id="ipv6t-mac" placeholder="z. B. 00:1A:2B:3C:4D:5E" autocomplete="off" value="00:1A:2B:3C:4D:5E">' +
      '<button class="btn btn--primary" type="button" id="ipv6t-eui-btn">Berechnen</button>' +
      '<p class="tool__error" id="ipv6t-eui-error" hidden></p>' +
      '<ol class="tool__steps" id="ipv6t-eui-steps" hidden></ol>' +
      '<dl class="tool__result" id="ipv6t-eui-result" hidden>' +
      '<div class="tool__result-row"><dt>Interface-Identifier (64 Bit)</dt><dd id="ipv6t-eui-id"></dd></div>' +
      '<div class="tool__result-row"><dt>Link-Local-Adresse</dt><dd id="ipv6t-eui-linklocal"></dd></div>' +
      "</dl>" +
      "</div>";

    var addrInput = container.querySelector("#ipv6t-addr");
    var addrBtn = container.querySelector("#ipv6t-addr-btn");
    var addrError = container.querySelector("#ipv6t-addr-error");
    var addrResult = container.querySelector("#ipv6t-addr-result");

    function calculateAddress() {
      addrError.hidden = true;
      addrResult.hidden = true;

      var parsed = expandAddress(addrInput.value);
      if (parsed.error) {
        addrError.textContent = parsed.error;
        addrError.hidden = false;
        return;
      }

      container.querySelector("#ipv6t-addr-full").textContent = parsed.groups.join(":");
      container.querySelector("#ipv6t-addr-short").textContent = compressGroups(parsed.groups);
      addrResult.hidden = false;
    }

    addrBtn.addEventListener("click", calculateAddress);
    addrInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") calculateAddress();
    });

    var macInput = container.querySelector("#ipv6t-mac");
    var euiBtn = container.querySelector("#ipv6t-eui-btn");
    var euiError = container.querySelector("#ipv6t-eui-error");
    var euiSteps = container.querySelector("#ipv6t-eui-steps");
    var euiResult = container.querySelector("#ipv6t-eui-result");

    function calculateEui() {
      euiError.hidden = true;
      euiSteps.hidden = true;
      euiResult.hidden = true;

      var parsed = parseMac(macInput.value);
      if (parsed.error) {
        euiError.textContent = parsed.error;
        euiError.hidden = false;
        return;
      }

      var b = parsed.bytes;
      var macFormatted = b.join(":");
      var withFffe = [b[0], b[1], b[2], "ff", "fe", b[3], b[4], b[5]];

      var firstByteNum = parseInt(b[0], 16);
      var flippedNum = firstByteNum ^ 0x02;
      var flippedByte = ("0" + flippedNum.toString(16)).slice(-2);
      var flipped = withFffe.slice();
      flipped[0] = flippedByte;

      var ifaceGroups = [
        flipped[0] + flipped[1],
        flipped[2] + flipped[3],
        flipped[4] + flipped[5],
        flipped[6] + flipped[7]
      ];
      var interfaceId = ifaceGroups.join(":");

      var fullLinkLocalGroups = ["fe80", "0000", "0000", "0000"].concat(ifaceGroups);
      var linkLocal = compressGroups(fullLinkLocalGroups);

      euiSteps.innerHTML =
        "<li>MAC-Adresse in 6 Byte: " + macFormatted + "</li>" +
        "<li>FFFE zwischen Hersteller- (" + b.slice(0, 3).join(":") + ") und Gerätekennung (" + b.slice(3).join(":") + ") einfügen: " + withFffe.join(":") + "</li>" +
        "<li>Universal/Local-Bit im ersten Byte invertieren (XOR mit 0x02): " + b[0] + " → " + flippedByte + "</li>" +
        "<li>Ergebnis in 16-Bit-Blöcke gruppiert = Interface-Identifier: " + interfaceId + "</li>";
      euiSteps.hidden = false;

      container.querySelector("#ipv6t-eui-id").textContent = interfaceId;
      container.querySelector("#ipv6t-eui-linklocal").textContent = linkLocal;
      euiResult.hidden = false;
    }

    euiBtn.addEventListener("click", calculateEui);
    macInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") calculateEui();
    });

    calculateAddress();
    calculateEui();
  }

  function init() {
    document.querySelectorAll('[data-tool="ipv6-tool"]').forEach(buildTool);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
