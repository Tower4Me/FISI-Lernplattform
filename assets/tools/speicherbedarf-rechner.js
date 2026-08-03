/* ==========================================================================
   speicherbedarf-rechner.js — berechnet den unkomprimierten Speicherbedarf
   eines Bildes aus Breite x Hoehe x Farbtiefe, Rechenweg bis Bit/Byte/KiB/MiB.

   Einbindung: <div class="tool" data-tool="speicherbedarf-rechner"></div>
   ========================================================================== */

(function () {
  "use strict";

  function fmt(n) {
    return n.toLocaleString("de-DE", { maximumFractionDigits: 3 });
  }

  function buildTool(container) {
    container.innerHTML =
      '<div class="tool__row">' +
      '<div style="flex:1;min-width:120px;">' +
      '<label class="tool__label" for="sbr-breite">Breite (Pixel)</label>' +
      '<input class="tool__input" type="number" id="sbr-breite" min="1" step="1" value="1920">' +
      "</div>" +
      '<div style="flex:1;min-width:120px;">' +
      '<label class="tool__label" for="sbr-hoehe">Höhe (Pixel)</label>' +
      '<input class="tool__input" type="number" id="sbr-hoehe" min="1" step="1" value="1080">' +
      "</div>" +
      '<div style="flex:1;min-width:120px;">' +
      '<label class="tool__label" for="sbr-farbtiefe">Farbtiefe (Bit/Pixel)</label>' +
      '<input class="tool__input" type="number" id="sbr-farbtiefe" min="1" max="64" step="1" value="24">' +
      "</div>" +
      "</div>" +
      '<button class="btn btn--primary" type="button" id="sbr-btn">Berechnen</button>' +
      '<p class="tool__error" id="sbr-error" hidden></p>' +
      '<ol class="tool__steps" id="sbr-steps" hidden></ol>' +
      '<dl class="tool__result" id="sbr-result" hidden>' +
      '<div class="tool__result-row"><dt>Bit gesamt</dt><dd id="sbr-out-bit"></dd></div>' +
      '<div class="tool__result-row"><dt>Byte</dt><dd id="sbr-out-byte"></dd></div>' +
      '<div class="tool__result-row"><dt>KiB</dt><dd id="sbr-out-kib"></dd></div>' +
      '<div class="tool__result-row"><dt>MiB</dt><dd id="sbr-out-mib"></dd></div>' +
      '<div class="tool__result-row"><dt>GiB</dt><dd id="sbr-out-gib"></dd></div>' +
      "</dl>";

    var breiteInput = container.querySelector("#sbr-breite");
    var hoeheInput = container.querySelector("#sbr-hoehe");
    var farbtiefeInput = container.querySelector("#sbr-farbtiefe");
    var btn = container.querySelector("#sbr-btn");
    var errorEl = container.querySelector("#sbr-error");
    var stepsEl = container.querySelector("#sbr-steps");
    var resultEl = container.querySelector("#sbr-result");

    function positiveInt(raw) {
      var n = Number(String(raw).trim().replace(",", "."));
      if (!Number.isFinite(n) || !Number.isInteger(n) || n <= 0) return null;
      return n;
    }

    function calculate() {
      errorEl.hidden = true;
      stepsEl.hidden = true;
      resultEl.hidden = true;

      var breite = positiveInt(breiteInput.value);
      var hoehe = positiveInt(hoeheInput.value);
      var farbtiefe = positiveInt(farbtiefeInput.value);

      if (breite === null || hoehe === null) {
        errorEl.textContent = "Breite und Höhe müssen positive ganze Zahlen (Pixel) sein.";
        errorEl.hidden = false;
        return;
      }
      if (farbtiefe === null || farbtiefe > 64) {
        errorEl.textContent = "Farbtiefe muss eine positive ganze Zahl zwischen 1 und 64 Bit sein.";
        errorEl.hidden = false;
        return;
      }

      var pixel = breite * hoehe;
      var bit = pixel * farbtiefe;
      var byte = bit / 8;
      var kib = byte / 1024;
      var mib = kib / 1024;
      var gib = mib / 1024;

      stepsEl.innerHTML =
        "<li>Pixelanzahl = " + fmt(breite) + " × " + fmt(hoehe) + " = " + fmt(pixel) + " Pixel</li>" +
        "<li>Datenmenge (Bit) = " + fmt(pixel) + " × " + fmt(farbtiefe) + " Bit/Pixel = " + fmt(bit) + " Bit</li>" +
        "<li>In Byte = " + fmt(bit) + " ÷ 8 = " + fmt(byte) + " Byte</li>" +
        "<li>In KiB = " + fmt(byte) + " ÷ 1.024 = " + fmt(kib) + " KiB</li>" +
        "<li>In MiB = " + fmt(kib) + " ÷ 1.024 ≈ " + fmt(mib) + " MiB</li>";
      stepsEl.hidden = false;

      container.querySelector("#sbr-out-bit").textContent = fmt(bit) + " Bit";
      container.querySelector("#sbr-out-byte").textContent = fmt(byte) + " Byte";
      container.querySelector("#sbr-out-kib").textContent = fmt(kib) + " KiB";
      container.querySelector("#sbr-out-mib").textContent = fmt(mib) + " MiB";
      container.querySelector("#sbr-out-gib").textContent = fmt(gib) + " GiB";
      resultEl.hidden = false;
    }

    btn.addEventListener("click", calculate);
    [breiteInput, hoeheInput, farbtiefeInput].forEach(function (el) {
      el.addEventListener("keydown", function (e) {
        if (e.key === "Enter") calculate();
      });
    });

    calculate();
  }

  function init() {
    document.querySelectorAll('[data-tool="speicherbedarf-rechner"]').forEach(buildTool);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
