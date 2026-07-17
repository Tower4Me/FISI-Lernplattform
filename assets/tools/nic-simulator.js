/* ==========================================================================
   nic-simulator.js — prueft eine IP/Subnetzmaske/Gateway-Konfiguration einer
   Netzwerkkarte (NIC) auf Gueltigkeit und zeigt Netz-, Broadcast-Adresse
   und nutzbaren Hostbereich.

   Einbindung: <div class="tool" data-tool="nic-simulator"></div>
   ========================================================================== */

(function () {
  "use strict";

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function parseIp(str) {
    var parts = String(str).trim().split(".");
    if (parts.length !== 4) return null;
    var octets = [];
    for (var i = 0; i < 4; i++) {
      if (!/^\d{1,3}$/.test(parts[i])) return null;
      var n = parseInt(parts[i], 10);
      if (n < 0 || n > 255) return null;
      octets.push(n);
    }
    return octets;
  }

  function octetsToInt(o) {
    return ((o[0] << 24) | (o[1] << 16) | (o[2] << 8) | o[3]) >>> 0;
  }

  function intToOctets(n) {
    return [
      (n >>> 24) & 255,
      (n >>> 16) & 255,
      (n >>> 8) & 255,
      n & 255
    ];
  }

  function formatIp(o) {
    return o.join(".");
  }

  function maskToPrefix(maskInt) {
    var prefix = 0;
    var seenZero = false;
    for (var i = 31; i >= 0; i--) {
      var bit = (maskInt >>> i) & 1;
      if (bit === 1) {
        if (seenZero) return null;
        prefix++;
      } else {
        seenZero = true;
      }
    }
    return prefix;
  }

  function buildTool(container) {
    container.innerHTML = "";

    var row1 = el("div", "tool__row");

    var ipWrap = el("div");
    ipWrap.style.flex = "1";
    ipWrap.style.minWidth = "160px";
    ipWrap.appendChild(el("label", "tool__label", "IP-Adresse"));
    var ipInput = el("input", "tool__input");
    ipInput.type = "text";
    ipInput.value = "192.168.10.55";
    ipWrap.appendChild(ipInput);

    var maskWrap = el("div");
    maskWrap.style.flex = "1";
    maskWrap.style.minWidth = "160px";
    maskWrap.appendChild(el("label", "tool__label", "Subnetzmaske"));
    var maskInput = el("input", "tool__input");
    maskInput.type = "text";
    maskInput.value = "255.255.255.0";
    maskWrap.appendChild(maskInput);

    row1.appendChild(ipWrap);
    row1.appendChild(maskWrap);

    var gwWrap = el("div");
    gwWrap.appendChild(el("label", "tool__label", "Gateway (optional)"));
    var gwInput = el("input", "tool__input");
    gwInput.type = "text";
    gwInput.value = "192.168.10.1";
    gwWrap.appendChild(gwInput);

    var output = el("div", "tool__output");

    container.appendChild(row1);
    container.appendChild(gwWrap);
    container.appendChild(output);

    function update() {
      var ipOctets = parseIp(ipInput.value);
      var maskOctets = parseIp(maskInput.value);

      if (!ipOctets) {
        output.textContent = "Ungültige IP-Adresse.";
        return;
      }
      if (!maskOctets) {
        output.textContent = "Ungültige Subnetzmaske.";
        return;
      }

      var maskInt = octetsToInt(maskOctets);
      var prefix = maskToPrefix(maskInt);
      if (prefix === null) {
        output.textContent = "Ungültige Subnetzmaske (Einsen und Nullen müssen zusammenhängend sein).";
        return;
      }

      var ipInt = octetsToInt(ipOctets);
      var networkInt = (ipInt & maskInt) >>> 0;
      var broadcastInt = (networkInt | (~maskInt >>> 0)) >>> 0;
      var hostBits = 32 - prefix;
      var usableHosts = hostBits <= 1 ? 0 : Math.pow(2, hostBits) - 2;

      var lines = [];
      lines.push("Präfix: /" + prefix + " (" + usableHosts.toLocaleString("de-DE") + " nutzbare Hosts)");
      lines.push("Netzadresse: " + formatIp(intToOctets(networkInt)));
      lines.push("Broadcast-Adresse: " + formatIp(intToOctets(broadcastInt)));

      if (ipInt === networkInt) {
        lines.push("Achtung: Die eingegebene IP ist die Netzadresse selbst — nicht als Hostadresse nutzbar.");
      } else if (ipInt === broadcastInt) {
        lines.push("Achtung: Die eingegebene IP ist die Broadcast-Adresse — nicht als Hostadresse nutzbar.");
      } else {
        lines.push("Die IP-Adresse ist eine gültige Hostadresse in diesem Subnetz.");
      }

      var gwOctets = parseIp(gwInput.value);
      if (gwInput.value.trim() !== "" ) {
        if (!gwOctets) {
          lines.push("Gateway: ungültige Adresse.");
        } else {
          var gwInt = octetsToInt(gwOctets);
          var gwNetworkInt = (gwInt & maskInt) >>> 0;
          if (gwNetworkInt === networkInt) {
            lines.push("Gateway liegt im selben Subnetz — erreichbar.");
          } else {
            lines.push("Gateway liegt in einem anderen Subnetz — NICHT erreichbar, Konfiguration prüfen.");
          }
        }
      }

      output.innerHTML = "";
      lines.forEach(function (line) {
        var p = el("p", null, line);
        p.style.margin = "0.25rem 0";
        output.appendChild(p);
      });
    }

    ipInput.addEventListener("input", update);
    maskInput.addEventListener("input", update);
    gwInput.addEventListener("input", update);
    update();
  }

  function init() {
    document.querySelectorAll('[data-tool="nic-simulator"]').forEach(buildTool);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
