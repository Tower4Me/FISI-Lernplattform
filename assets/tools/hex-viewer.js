/* ==========================================================================
   hex-viewer.js — Dateityp-Rater: zeigt die ersten Bytes (Magic Bytes)
   einer Datei als Hex-Dump, Nutzer:in rät den Dateityp per Multiple Choice.

   Einbindung: <div class="tool" data-tool="hex-viewer"></div>
   ========================================================================== */

(function () {
  "use strict";

  var SIGNATURES = [
    { type: "JPEG-Bild", hex: "FF D8 FF E0 00 10 4A 46", ascii: "....JF" },
    { type: "PNG-Bild", hex: "89 50 4E 47 0D 0A 1A 0A", ascii: ".PNG...." },
    { type: "PDF-Dokument", hex: "25 50 44 46 2D 31 2E 35", ascii: "%PDF-1.5" },
    { type: "ZIP-Archiv", hex: "50 4B 03 04 14 00 00 00", ascii: "PK......" },
    { type: "Windows-Programm (.exe)", hex: "4D 5A 90 00 03 00 00 00", ascii: "MZ......" },
    { type: "Linux-Programm (ELF)", hex: "7F 45 4C 46 02 01 01 00", ascii: ".ELF...." }
  ];

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }

  function buildTool(container) {
    container.innerHTML = "";

    var label = el("p", "tool__label", "Welcher Dateityp verbirgt sich hinter diesen Magic Bytes?");
    var dump = el("div", "tool__output");
    var options = el("div", "tool__row");
    var feedback = el("p", "tool__hint", "Wähle eine Antwort.");
    var nextBtn = el("button", "btn", "Nächste Datei →");

    container.appendChild(label);
    container.appendChild(dump);
    container.appendChild(options);
    container.appendChild(feedback);
    container.appendChild(nextBtn);

    var current;

    function render() {
      current = SIGNATURES[Math.floor(Math.random() * SIGNATURES.length)];
      dump.textContent = "Offset 00000000:  " + current.hex + "   " + current.ascii;
      feedback.textContent = "Wähle eine Antwort.";
      feedback.className = "tool__hint";

      options.innerHTML = "";
      var choices = shuffle([current.type].concat(
        shuffle(SIGNATURES.map(function (s) { return s.type; }).filter(function (t) { return t !== current.type; })).slice(0, 3)
      ));

      choices.forEach(function (choice) {
        var btn = el("button", "btn", choice);
        btn.addEventListener("click", function () {
          if (choice === current.type) {
            feedback.textContent = "Richtig! Magic Bytes " + current.hex.split(" ").slice(0, 4).join(" ") + " kennzeichnen: " + current.type + ".";
            feedback.className = "tool__hint";
          } else {
            feedback.textContent = "Nicht ganz — richtig wäre: " + current.type + ". Magic Bytes " + current.hex.split(" ").slice(0, 4).join(" ") + " identifizieren diesen Typ unabhängig von der Dateiendung.";
            feedback.className = "tool__hint";
          }
        });
        options.appendChild(btn);
      });
    }

    nextBtn.addEventListener("click", render);
    render();
  }

  function init() {
    document.querySelectorAll('[data-tool="hex-viewer"]').forEach(buildTool);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
