/* ==========================================================================
   dsl-umrechner.js — rechnet Mbit/s <-> MByte/s um und berechnet daraus die
   Downloadzeit einer Datei gegebener Groesse.

   Einbindung: <div class="tool" data-tool="dsl-umrechner"></div>
   ========================================================================== */

(function () {
  "use strict";

  var GROESSE_BYTE_FAKTOR = {
    mb: 1000 * 1000,
    gb: 1000 * 1000 * 1000,
    mib: 1024 * 1024,
    gib: 1024 * 1024 * 1024
  };
  var GROESSE_LABEL = { mb: "MB", gb: "GB", mib: "MiB", gib: "GiB" };

  function fmt(n) {
    return n.toLocaleString("de-DE", { maximumFractionDigits: 3 });
  }

  function formatDauer(sekunden) {
    if (sekunden < 60) return fmt(sekunden) + " s";
    var s = sekunden;
    var h = Math.floor(s / 3600);
    s -= h * 3600;
    var min = Math.floor(s / 60);
    s -= min * 60;
    var parts = [];
    if (h > 0) parts.push(h + " h");
    if (min > 0 || h > 0) parts.push(min + " min");
    parts.push(fmt(s) + " s");
    return parts.join(" ");
  }

  function buildTool(container) {
    container.innerHTML =
      '<div class="tool__row">' +
      '<div style="flex:1;min-width:150px;">' +
      '<label class="tool__label" for="dslu-bandbreite">Bandbreite (Mbit/s)</label>' +
      '<input class="tool__input" type="number" id="dslu-bandbreite" min="0" step="any" value="16">' +
      "</div>" +
      "</div>" +
      '<div class="tool__row">' +
      '<div style="flex:2;min-width:140px;">' +
      '<label class="tool__label" for="dslu-groesse">Dateigröße</label>' +
      '<input class="tool__input" type="number" id="dslu-groesse" min="0" step="any" value="16">' +
      "</div>" +
      '<div style="flex:1;min-width:100px;">' +
      '<label class="tool__label" for="dslu-groesse-einheit">Einheit</label>' +
      '<select class="tool__select" id="dslu-groesse-einheit">' +
      '<option value="mb" selected>MB</option>' +
      '<option value="gb">GB</option>' +
      '<option value="mib">MiB</option>' +
      '<option value="gib">GiB</option>' +
      "</select>" +
      "</div>" +
      "</div>" +
      '<button class="btn btn--primary" type="button" id="dslu-btn">Berechnen</button>' +
      '<p class="tool__error" id="dslu-error" hidden></p>' +
      '<ol class="tool__steps" id="dslu-steps" hidden></ol>' +
      '<dl class="tool__result" id="dslu-result" hidden>' +
      '<div class="tool__result-row"><dt>Bandbreite in MByte/s</dt><dd id="dslu-out-mbps"></dd></div>' +
      '<div class="tool__result-row"><dt>Dateigröße in Bit</dt><dd id="dslu-out-bit"></dd></div>' +
      '<div class="tool__result-row"><dt>Downloadzeit</dt><dd id="dslu-out-dauer"></dd></div>' +
      "</dl>";

    var bandbreiteInput = container.querySelector("#dslu-bandbreite");
    var groesseInput = container.querySelector("#dslu-groesse");
    var groesseEinheit = container.querySelector("#dslu-groesse-einheit");
    var btn = container.querySelector("#dslu-btn");
    var errorEl = container.querySelector("#dslu-error");
    var stepsEl = container.querySelector("#dslu-steps");
    var resultEl = container.querySelector("#dslu-result");

    function positiveNumber(raw) {
      var n = Number(String(raw).trim().replace(",", "."));
      if (!Number.isFinite(n) || n <= 0) return null;
      return n;
    }

    function calculate() {
      errorEl.hidden = true;
      stepsEl.hidden = true;
      resultEl.hidden = true;

      var bandbreite = positiveNumber(bandbreiteInput.value);
      var groesse = positiveNumber(groesseInput.value);

      if (bandbreite === null) {
        errorEl.textContent = "Bandbreite muss eine positive Zahl (Mbit/s) sein.";
        errorEl.hidden = false;
        return;
      }
      if (groesse === null) {
        errorEl.textContent = "Dateigröße muss eine positive Zahl sein.";
        errorEl.hidden = false;
        return;
      }

      var einheit = groesseEinheit.value;
      var mbps = bandbreite / 8;
      var groesseByte = groesse * GROESSE_BYTE_FAKTOR[einheit];
      var groesseBit = groesseByte * 8;
      var bandbreiteBps = bandbreite * 1000 * 1000;
      var dauer = groesseBit / bandbreiteBps;

      stepsEl.innerHTML =
        "<li>Bandbreite in MByte/s = " + fmt(bandbreite) + " Mbit/s ÷ 8 = " + fmt(mbps) + " MByte/s</li>" +
        "<li>Dateigröße in Bit = " + fmt(groesse) + " " + GROESSE_LABEL[einheit] + " × " +
        fmt(GROESSE_BYTE_FAKTOR[einheit]) + " Byte × 8 = " + fmt(groesseBit) + " Bit</li>" +
        "<li>Downloadzeit = " + fmt(groesseBit) + " Bit ÷ " + fmt(bandbreiteBps) + " Bit/s ≈ " + fmt(dauer) + " s</li>";
      stepsEl.hidden = false;

      container.querySelector("#dslu-out-mbps").textContent = fmt(mbps) + " MByte/s";
      container.querySelector("#dslu-out-bit").textContent = fmt(groesseBit) + " Bit";
      container.querySelector("#dslu-out-dauer").textContent = formatDauer(dauer);
      resultEl.hidden = false;
    }

    btn.addEventListener("click", calculate);
    [bandbreiteInput, groesseInput].forEach(function (el) {
      el.addEventListener("keydown", function (e) {
        if (e.key === "Enter") calculate();
      });
    });

    calculate();
  }

  function init() {
    document.querySelectorAll('[data-tool="dsl-umrechner"]').forEach(buildTool);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
