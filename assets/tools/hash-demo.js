/* ==========================================================================
   hash-demo.js — echte Hashwerte per Web-Crypto-API (SubtleCrypto), keine
   externe Abhängigkeit. Zeigt Einwegfunktion + Lawineneffekt live.

   Einbindung: <div class="tool" data-tool="hash-demo"></div>
   ========================================================================== */

(function () {
  "use strict";

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function toHex(buffer) {
    return Array.from(new Uint8Array(buffer))
      .map(function (b) { return b.toString(16).padStart(2, "0"); })
      .join("");
  }

  function buildTool(container) {
    container.innerHTML = "";

    var labelIn = el("label", "tool__label", "Eingabe (ändere ein einziges Zeichen und beobachte)");
    var input = el("input", "tool__input");
    input.type = "text";
    input.value = "Passwort123";

    var labelAlg = el("label", "tool__label", "Verfahren");
    var select = el("select", "tool__select");
    [["SHA-256", "SHA-256 (Standard heute)"], ["SHA-1", "SHA-1 (veraltet, unsicher)"], ["SHA-512", "SHA-512"]]
      .forEach(function (pair) {
        var opt = el("option", null, pair[1]);
        opt.value = pair[0];
        select.appendChild(opt);
      });

    var out = el("div", "tool__output", "…");

    var cards = el("div", "tool__cards");
    [
      ["Einwegfunktion", "Aus dem Hash kann man die Eingabe nicht zurückrechnen."],
      ["Lawineneffekt", "Kleinste Änderung → völlig anderer Hash."],
      ["Kollisionssicher", "Zwei verschiedene Eingaben sollen nie denselben Hash ergeben."]
    ].forEach(function (pair) {
      var card = el("div", "tool__card");
      card.appendChild(el("strong", null, pair[0]));
      card.appendChild(el("span", null, pair[1]));
      cards.appendChild(card);
    });

    container.appendChild(labelIn);
    container.appendChild(input);
    container.appendChild(labelAlg);
    container.appendChild(select);
    container.appendChild(out);
    container.appendChild(cards);

    function doHash() {
      var text = input.value;
      var alg = select.value;
      if (!window.crypto || !window.crypto.subtle) {
        out.textContent = "SubtleCrypto nicht verfügbar (erfordert HTTPS oder localhost).";
        return;
      }
      var data = new TextEncoder().encode(text);
      window.crypto.subtle.digest(alg, data).then(function (buf) {
        out.textContent = toHex(buf);
      });
    }

    input.addEventListener("input", doHash);
    select.addEventListener("change", doHash);
    doHash();
  }

  function init() {
    document.querySelectorAll('[data-tool="hash-demo"]').forEach(buildTool);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
