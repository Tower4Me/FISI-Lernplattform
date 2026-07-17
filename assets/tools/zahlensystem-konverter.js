/* ==========================================================================
   zahlensystem-konverter.js — bidirektionaler Konverter zwischen Dezimal,
   Binär und Hexadezimal für Werte 0–255 (ein Byte).

   Einbindung: <div class="tool" data-tool="zahlensystem-konverter"></div>
   ========================================================================== */

(function () {
  "use strict";

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function buildTool(container) {
    container.innerHTML = "";

    var grid = el("div", "tool__cards");

    var decWrap = el("div", "tool__card");
    decWrap.appendChild(el("strong", null, "Dezimal (Basis 10)"));
    var decInput = el("input", "tool__input");
    decInput.type = "text";
    decInput.inputMode = "numeric";
    decWrap.appendChild(decInput);

    var binWrap = el("div", "tool__card");
    binWrap.appendChild(el("strong", null, "Binär (Basis 2)"));
    var binInput = el("input", "tool__input");
    binInput.type = "text";
    binWrap.appendChild(binInput);

    var hexWrap = el("div", "tool__card");
    hexWrap.appendChild(el("strong", null, "Hexadezimal (Basis 16)"));
    var hexInput = el("input", "tool__input");
    hexInput.type = "text";
    hexWrap.appendChild(hexInput);

    grid.appendChild(decWrap);
    grid.appendChild(binWrap);
    grid.appendChild(hexWrap);

    var hint = el("p", "tool__hint",
      "Gib einen Wert in einem der drei Felder ein (0–255) — die anderen beiden aktualisieren sich automatisch.");

    container.appendChild(grid);
    container.appendChild(hint);

    function setAll(value) {
      decInput.value = String(value);
      binInput.value = value.toString(2).padStart(8, "0");
      hexInput.value = "0x" + value.toString(16).padStart(2, "0").toUpperCase();
    }

    function fromDecimal() {
      var v = parseInt(decInput.value, 10);
      if (isNaN(v) || v < 0 || v > 255) return;
      binInput.value = v.toString(2).padStart(8, "0");
      hexInput.value = "0x" + v.toString(16).padStart(2, "0").toUpperCase();
    }

    function fromBinary() {
      var clean = binInput.value.replace(/[^01]/g, "");
      if (clean.length === 0) return;
      var v = parseInt(clean, 2);
      if (isNaN(v) || v > 255) return;
      decInput.value = String(v);
      hexInput.value = "0x" + v.toString(16).padStart(2, "0").toUpperCase();
    }

    function fromHex() {
      var clean = hexInput.value.replace(/^0x/i, "").replace(/[^0-9a-fA-F]/g, "");
      if (clean.length === 0) return;
      var v = parseInt(clean, 16);
      if (isNaN(v) || v > 255) return;
      decInput.value = String(v);
      binInput.value = v.toString(2).padStart(8, "0");
    }

    decInput.addEventListener("input", fromDecimal);
    binInput.addEventListener("input", fromBinary);
    hexInput.addEventListener("input", fromHex);

    setAll(65);
  }

  function init() {
    document.querySelectorAll('[data-tool="zahlensystem-konverter"]').forEach(buildTool);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
