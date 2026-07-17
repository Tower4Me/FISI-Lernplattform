/* ==========================================================================
   crlf-visualizer.js — zeigt, wie ein eingegebener Text als Linux (LF),
   Windows (CRLF) und altes macOS (CR) kodiert wuerde, inkl. Bytezahl der
   Zeilenenden.

   Einbindung: <div class="tool" data-tool="crlf-visualizer"></div>
   ========================================================================== */

(function () {
  "use strict";

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  var VARIANTS = [
    { key: "lf", label: "Linux / macOS (LF)", marker: "␊", bytesPerEnding: 1, hex: "0A" },
    { key: "crlf", label: "Windows (CRLF)", marker: "␍␊", bytesPerEnding: 2, hex: "0D 0A" },
    { key: "cr", label: "altes macOS (CR)", marker: "␍", bytesPerEnding: 1, hex: "0D" }
  ];

  function buildTool(container) {
    container.innerHTML = "";

    var inputWrap = el("div");
    inputWrap.appendChild(el("label", "tool__label", "Text mit Zeilenumbrüchen"));
    var textarea = el("textarea", "tool__input");
    textarea.rows = 4;
    textarea.value = "Zeile 1\nZeile 2\nZeile 3";
    inputWrap.appendChild(textarea);

    var outputGrid = el("div", "tool__row");
    outputGrid.style.flexWrap = "wrap";
    outputGrid.style.alignItems = "stretch";

    var panels = {};
    VARIANTS.forEach(function (v) {
      var panel = el("div");
      panel.style.flex = "1";
      panel.style.minWidth = "220px";
      panel.appendChild(el("label", "tool__label", v.label));
      var pre = el("pre");
      pre.style.whiteSpace = "pre-wrap";
      pre.style.wordBreak = "break-all";
      pre.style.margin = "0 0 0.35rem";
      pre.style.fontFamily = "monospace";
      pre.style.fontSize = "0.85rem";
      panel.appendChild(pre);
      var info = el("p", "muted");
      info.style.margin = "0";
      info.style.fontSize = "0.8rem";
      panel.appendChild(info);
      outputGrid.appendChild(panel);
      panels[v.key] = { pre: pre, info: info };
    });

    container.appendChild(inputWrap);
    container.appendChild(outputGrid);

    function update() {
      var lines = textarea.value.split("\n");
      var numEndings = Math.max(lines.length - 1, 0);

      VARIANTS.forEach(function (v) {
        var display = lines
          .map(function (line) { return line; })
          .join(v.marker + "\n");
        panels[v.key].pre.textContent = display || "(leer)";

        var totalBytes = numEndings * v.bytesPerEnding;
        panels[v.key].info.textContent =
          numEndings + " Zeilenende(n) × " + v.bytesPerEnding +
          " Byte (" + v.hex + ") = " + totalBytes + " Byte für Zeilenenden";
      });
    }

    textarea.addEventListener("input", update);
    update();
  }

  function init() {
    document.querySelectorAll('[data-tool="crlf-visualizer"]').forEach(buildTool);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
