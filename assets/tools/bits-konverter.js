/* ==========================================================================
   bits-konverter.js — wandelt eingegebenen Text live in seine Bitfolge um
   (UTF-8-Bytes), zeigt pro Zeichen Byte/Bit/Hex und die Gesamtgröße.

   Einbindung: <div class="tool" data-tool="bits-konverter"></div>
   ========================================================================== */

(function () {
  "use strict";

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function toBinary(byte) {
    return byte.toString(2).padStart(8, "0");
  }

  function toHex(byte) {
    return byte.toString(16).padStart(2, "0").toUpperCase();
  }

  function buildTool(container) {
    container.innerHTML = "";

    var labelIn = el("label", "tool__label", "Text eingeben (UTF-8-Kodierung)");
    var input = el("input", "tool__input");
    input.type = "text";
    input.maxLength = 24;
    input.value = "Hi!";

    var out = el("div", "tool__output");
    var summary = el("p", "tool__hint");

    container.appendChild(labelIn);
    container.appendChild(input);
    container.appendChild(out);
    container.appendChild(summary);

    function render() {
      var text = input.value;
      var bytes = new TextEncoder().encode(text);

      out.innerHTML = "";
      var table = el("table");
      var thead = el("thead");
      var headRow = el("tr");
      ["Zeichen/Byte", "Binär (8 Bit)", "Hex", "Dezimal"].forEach(function (h) {
        headRow.appendChild(el("th", null, h));
      });
      thead.appendChild(headRow);
      table.appendChild(thead);

      var tbody = el("tbody");
      var chars = Array.from(text);
      var byteIndex = 0;
      chars.forEach(function (ch) {
        var chBytes = new TextEncoder().encode(ch);
        chBytes.forEach(function (b, i) {
          var row = el("tr");
          var label = chBytes.length > 1
            ? "'" + ch + "' (Byte " + (i + 1) + "/" + chBytes.length + ")"
            : "'" + ch + "'";
          row.appendChild(el("td", null, label));
          row.appendChild(el("td", null, toBinary(b)));
          row.appendChild(el("td", null, "0x" + toHex(b)));
          row.appendChild(el("td", null, String(b)));
          tbody.appendChild(row);
          byteIndex++;
        });
      });
      table.appendChild(tbody);
      out.appendChild(table);

      var bits = bytes.length * 8;
      summary.textContent =
        chars.length + " Zeichen ergeben " + bytes.length + " Byte (= " +
        bits + " Bit). Ein einfaches ASCII-Zeichen (z. B. Buchstaben, Ziffern) " +
        "belegt in UTF-8 genau 1 Byte, Sonderzeichen/Umlaute können 2–4 Byte benötigen.";
    }

    input.addEventListener("input", render);
    render();
  }

  function init() {
    document.querySelectorAll('[data-tool="bits-konverter"]').forEach(buildTool);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
