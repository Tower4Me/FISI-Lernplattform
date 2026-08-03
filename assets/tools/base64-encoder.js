/* ==========================================================================
   base64-encoder.js — Text <-> Base64, mit sichtbarer Bit-Aufteilung
   (3 Byte -> 4 Zeichen) fuer den ersten Block der Eingabe.

   Einbindung: <div class="tool" data-tool="base64-encoder"></div>
   ========================================================================== */

(function () {
  "use strict";

  var ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

  function toBinary8(n) {
    return n.toString(2).padStart(8, "0");
  }

  function encodeBytes(bytes) {
    var out = "";
    for (var i = 0; i < bytes.length; i += 3) {
      var b0 = bytes[i];
      var b1 = i + 1 < bytes.length ? bytes[i + 1] : undefined;
      var b2 = i + 2 < bytes.length ? bytes[i + 2] : undefined;

      var c0 = b0 >> 2;
      var c1 = ((b0 & 0x03) << 4) | (b1 !== undefined ? (b1 >> 4) : 0);
      var c2 = b1 !== undefined ? (((b1 & 0x0f) << 2) | (b2 !== undefined ? (b2 >> 6) : 0)) : 64;
      var c3 = b2 !== undefined ? (b2 & 0x3f) : 64;

      out += ALPHABET[c0] + ALPHABET[c1] + (c2 === 64 ? "=" : ALPHABET[c2]) + (c3 === 64 ? "=" : ALPHABET[c3]);
    }
    return out;
  }

  function decodeToBytes(str) {
    var s = String(str || "").replace(/\s+/g, "");
    if (s.length === 0) return { error: "Bitte einen Base64-Text eingeben." };
    if (!/^[A-Za-z0-9+/]*={0,2}$/.test(s) || s.length % 4 !== 0) {
      return { error: "Ungültiges Base64-Format — erlaubt sind nur A–Z, a–z, 0–9, „+“, „/“ und abschließend bis zu zwei „=“ als Padding, die Gesamtlänge muss durch 4 teilbar sein." };
    }

    var bytes = [];
    for (var i = 0; i < s.length; i += 4) {
      var chunk = s.slice(i, i + 4);
      var vals = chunk.split("").map(function (ch) {
        return ch === "=" ? null : ALPHABET.indexOf(ch);
      });
      if (vals.some(function (v) { return v === -1; })) {
        return { error: "Ungültiges Zeichen im Base64-Text gefunden." };
      }

      var v0 = vals[0] || 0;
      var v1 = vals[1] || 0;
      var v2 = vals[2];
      var v3 = vals[3];

      bytes.push(((v0 << 2) | (v1 >> 4)) & 0xff);
      if (v2 !== null) bytes.push(((v1 << 4) | (v2 >> 2)) & 0xff);
      if (v3 !== null && v2 !== null) bytes.push(((v2 << 6) | v3) & 0xff);
    }
    return { bytes: bytes };
  }

  function buildTool(container) {
    container.innerHTML =
      '<div class="tool__row">' +
      '<div style="flex:1;min-width:160px;">' +
      '<label class="tool__label" for="b64-modus">Modus</label>' +
      '<select class="tool__select" id="b64-modus">' +
      '<option value="encode">Kodieren (Text → Base64)</option>' +
      '<option value="decode">Dekodieren (Base64 → Text)</option>' +
      "</select>" +
      "</div>" +
      "</div>" +
      '<label class="tool__label" for="b64-eingabe" id="b64-eingabe-label">Text eingeben</label>' +
      '<input class="tool__input" type="text" id="b64-eingabe" value="Man" autocomplete="off">' +
      '<button class="btn btn--primary" type="button" id="b64-btn">Berechnen</button>' +
      '<p class="tool__error" id="b64-error" hidden></p>' +
      '<ol class="tool__steps" id="b64-steps" hidden></ol>' +
      '<dl class="tool__result" id="b64-result" hidden>' +
      '<div class="tool__result-row"><dt>Ergebnis</dt><dd id="b64-out-ergebnis"></dd></div>' +
      '<div class="tool__result-row"><dt>Länge Original</dt><dd id="b64-out-laenge-original"></dd></div>' +
      '<div class="tool__result-row"><dt>Länge Base64</dt><dd id="b64-out-laenge-b64"></dd></div>' +
      "</dl>";

    var modusSelect = container.querySelector("#b64-modus");
    var eingabeLabel = container.querySelector("#b64-eingabe-label");
    var eingabeInput = container.querySelector("#b64-eingabe");
    var btn = container.querySelector("#b64-btn");
    var errorEl = container.querySelector("#b64-error");
    var stepsEl = container.querySelector("#b64-steps");
    var resultEl = container.querySelector("#b64-result");

    modusSelect.addEventListener("change", function () {
      if (modusSelect.value === "encode") {
        eingabeLabel.textContent = "Text eingeben";
        eingabeInput.value = "Man";
      } else {
        eingabeLabel.textContent = "Base64-Text eingeben";
        eingabeInput.value = "TWFu";
      }
      calculate();
    });

    function calculate() {
      errorEl.hidden = true;
      stepsEl.hidden = true;
      resultEl.hidden = true;

      if (modusSelect.value === "encode") {
        var text = eingabeInput.value;
        if (text.length === 0) {
          errorEl.textContent = "Bitte einen Text eingeben.";
          errorEl.hidden = false;
          return;
        }
        var bytes = Array.from(new TextEncoder().encode(text));
        var encoded = encodeBytes(bytes);

        var block = bytes.slice(0, 3);
        var stepsHtml = "<li>Erste " + block.length + " Byte als Bits: " +
          block.map(toBinary8).join(" ") + "</li>";
        var bitStream = block.map(toBinary8).join("");
        stepsHtml += "<li>Zu einem Bitstrom zusammengehängt (" + bitStream.length + " Bit): <code>" + bitStream + "</code></li>";
        var groups = [];
        for (var i = 0; i < bitStream.length; i += 6) {
          groups.push(bitStream.slice(i, i + 6).padEnd(6, "0"));
        }
        stepsHtml += "<li>In 6-Bit-Gruppen aufgeteilt: " + groups.map(function (g) { return "<code>" + g + "</code>"; }).join(" ") + "</li>";
        var chars = groups.map(function (g) { return ALPHABET[parseInt(g, 2)]; });
        stepsHtml += "<li>Jede 6-Bit-Gruppe → Base64-Zeichen: " + chars.join(" ") +
          (bytes.length > 3 ? " … (weitere Blöcke folgen im Ergebnis)" : "") + "</li>";
        stepsEl.innerHTML = stepsHtml;
        stepsEl.hidden = false;

        container.querySelector("#b64-out-ergebnis").textContent = encoded;
        container.querySelector("#b64-out-laenge-original").textContent = bytes.length + " Byte";
        container.querySelector("#b64-out-laenge-b64").textContent = encoded.length + " Zeichen";
        resultEl.hidden = false;
      } else {
        var decoded = decodeToBytes(eingabeInput.value);
        if (decoded.error) {
          errorEl.textContent = decoded.error;
          errorEl.hidden = false;
          return;
        }
        var decodedBytes = decoded.bytes;
        var decodedText = new TextDecoder("utf-8").decode(new Uint8Array(decodedBytes));

        container.querySelector("#b64-out-ergebnis").textContent = decodedText;
        container.querySelector("#b64-out-laenge-original").textContent = eingabeInput.value.replace(/\s+/g, "").length + " Zeichen (Base64)";
        container.querySelector("#b64-out-laenge-b64").textContent = decodedBytes.length + " Byte (dekodiert)";
        resultEl.hidden = false;
      }
    }

    btn.addEventListener("click", calculate);
    eingabeInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") calculate();
    });

    calculate();
  }

  function init() {
    document.querySelectorAll('[data-tool="base64-encoder"]').forEach(buildTool);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
