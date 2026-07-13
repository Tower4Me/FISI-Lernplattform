/* ==========================================================================
   verschluesselung-demo.js — stark vereinfachter symmetrischer Verschlüssler
   (Caesar-Prinzip) zur Veranschaulichung des Konzepts "gleicher Schlüssel
   für Ver- und Entschlüsselung". KEIN echtes Kryptoverfahren.

   Einbindung: <div class="tool" data-tool="verschluesselung-demo"></div>
   ========================================================================== */

(function () {
  "use strict";

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function shiftChar(ch, key) {
    var code = ch.charCodeAt(0);
    if (code >= 65 && code <= 90) {
      return String.fromCharCode(((code - 65 + key) % 26 + 26) % 26 + 65);
    }
    if (code >= 97 && code <= 122) {
      return String.fromCharCode(((code - 97 + key) % 26 + 26) % 26 + 97);
    }
    return ch;
  }

  function caesar(text, key) {
    return text.split("").map(function (ch) { return shiftChar(ch, key); }).join("");
  }

  function buildTool(container) {
    container.innerHTML = "";

    var labelIn = el("label", "tool__label", "Klartext bzw. Geheimtext");
    var input = el("input", "tool__input");
    input.type = "text";
    input.value = "Geheime Nachricht";

    var labelKey = el("label", "tool__label", "Schlüssel (Zahl, geteilt zwischen Sender & Empfänger)");
    var keyInput = el("input", "tool__input");
    keyInput.type = "number";
    keyInput.min = "1";
    keyInput.max = "25";
    keyInput.value = "7";

    var row = el("div", "tool__row");
    var encBtn = el("button", "btn btn--primary", "Verschlüsseln →");
    var decBtn = el("button", "btn", "← Entschlüsseln");
    row.appendChild(encBtn);
    row.appendChild(decBtn);

    var out = el("div", "tool__output", "Ergebnis erscheint hier …");
    var hint = el("p", "tool__hint",
      "Beobachte: Mit demselben Schlüssel wird ver- und entschlüsselt. " +
      "Das ist symmetrisch. Wer den Schlüssel abfängt, kann alles mitlesen " +
      "— deshalb ist der sichere Schlüsselaustausch das Kernproblem.");

    container.appendChild(labelIn);
    container.appendChild(input);
    container.appendChild(labelKey);
    container.appendChild(keyInput);
    container.appendChild(row);
    container.appendChild(out);
    container.appendChild(hint);

    function getKey() {
      var k = parseInt(keyInput.value, 10);
      if (isNaN(k)) k = 0;
      return k;
    }

    encBtn.addEventListener("click", function () {
      out.textContent = caesar(input.value, getKey());
    });
    decBtn.addEventListener("click", function () {
      out.textContent = caesar(input.value, -getKey());
    });
  }

  function init() {
    document.querySelectorAll('[data-tool="verschluesselung-demo"]').forEach(buildTool);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
