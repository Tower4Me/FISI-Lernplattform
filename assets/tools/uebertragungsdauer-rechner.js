/* ==========================================================================
   uebertragungsdauer-rechner.js — Uebertragungsdauer = Datenmenge / Datenrate,
   inkl. Umrechnung Byte/Bit (binaere Praefixe) und Bit/s (dezimale Praefixe).

   Einbindung: <div class="tool" data-tool="uebertragungsdauer-rechner"></div>
   ========================================================================== */

(function () {
  "use strict";

  var MENGE_FAKTOR = {
    bit: 1,
    byte: 8,
    kib: 8 * 1024,
    mib: 8 * 1024 * 1024,
    gib: 8 * 1024 * 1024 * 1024
  };
  var MENGE_LABEL = { bit: "Bit", byte: "Byte", kib: "KiB", mib: "MiB", gib: "GiB" };

  var RATE_FAKTOR = {
    bps: 1,
    kbps: 1000,
    mbps: 1000 * 1000,
    gbps: 1000 * 1000 * 1000
  };
  var RATE_LABEL = { bps: "Bit/s", kbps: "kbit/s", mbps: "Mbit/s", gbps: "Gbit/s" };

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
      '<div style="flex:2;min-width:140px;">' +
      '<label class="tool__label" for="uedr-menge">Datenmenge</label>' +
      '<input class="tool__input" type="number" id="uedr-menge" min="0" step="any" value="4">' +
      "</div>" +
      '<div style="flex:1;min-width:100px;">' +
      '<label class="tool__label" for="uedr-menge-einheit">Einheit</label>' +
      '<select class="tool__select" id="uedr-menge-einheit">' +
      '<option value="bit">Bit</option>' +
      '<option value="byte">Byte</option>' +
      '<option value="kib">KiB</option>' +
      '<option value="mib">MiB</option>' +
      '<option value="gib" selected>GiB</option>' +
      "</select>" +
      "</div>" +
      "</div>" +
      '<div class="tool__row">' +
      '<div style="flex:2;min-width:140px;">' +
      '<label class="tool__label" for="uedr-rate">Datenrate</label>' +
      '<input class="tool__input" type="number" id="uedr-rate" min="0" step="any" value="100">' +
      "</div>" +
      '<div style="flex:1;min-width:100px;">' +
      '<label class="tool__label" for="uedr-rate-einheit">Einheit</label>' +
      '<select class="tool__select" id="uedr-rate-einheit">' +
      '<option value="bps">Bit/s</option>' +
      '<option value="kbps">kbit/s</option>' +
      '<option value="mbps" selected>Mbit/s</option>' +
      '<option value="gbps">Gbit/s</option>' +
      "</select>" +
      "</div>" +
      "</div>" +
      '<button class="btn btn--primary" type="button" id="uedr-btn">Berechnen</button>' +
      '<p class="tool__error" id="uedr-error" hidden></p>' +
      '<ol class="tool__steps" id="uedr-steps" hidden></ol>' +
      '<dl class="tool__result" id="uedr-result" hidden>' +
      '<div class="tool__result-row"><dt>Datenmenge in Bit</dt><dd id="uedr-out-bit"></dd></div>' +
      '<div class="tool__result-row"><dt>Datenrate in Bit/s</dt><dd id="uedr-out-rate"></dd></div>' +
      '<div class="tool__result-row"><dt>Übertragungsdauer</dt><dd id="uedr-out-dauer"></dd></div>' +
      "</dl>";

    var mengeInput = container.querySelector("#uedr-menge");
    var mengeEinheit = container.querySelector("#uedr-menge-einheit");
    var rateInput = container.querySelector("#uedr-rate");
    var rateEinheit = container.querySelector("#uedr-rate-einheit");
    var btn = container.querySelector("#uedr-btn");
    var errorEl = container.querySelector("#uedr-error");
    var stepsEl = container.querySelector("#uedr-steps");
    var resultEl = container.querySelector("#uedr-result");

    function positiveNumber(raw) {
      var n = Number(String(raw).trim().replace(",", "."));
      if (!Number.isFinite(n) || n <= 0) return null;
      return n;
    }

    function calculate() {
      errorEl.hidden = true;
      stepsEl.hidden = true;
      resultEl.hidden = true;

      var menge = positiveNumber(mengeInput.value);
      var rate = positiveNumber(rateInput.value);

      if (menge === null) {
        errorEl.textContent = "Datenmenge muss eine positive Zahl sein.";
        errorEl.hidden = false;
        return;
      }
      if (rate === null) {
        errorEl.textContent = "Datenrate muss eine positive Zahl sein.";
        errorEl.hidden = false;
        return;
      }

      var mengeKey = mengeEinheit.value;
      var rateKey = rateEinheit.value;
      var mengeBit = menge * MENGE_FAKTOR[mengeKey];
      var rateBps = rate * RATE_FAKTOR[rateKey];
      var dauer = mengeBit / rateBps;

      stepsEl.innerHTML =
        "<li>Datenmenge in Bit = " + fmt(menge) + " " + MENGE_LABEL[mengeKey] +
        " × " + fmt(MENGE_FAKTOR[mengeKey]) + " = " + fmt(mengeBit) + " Bit</li>" +
        "<li>Datenrate in Bit/s = " + fmt(rate) + " " + RATE_LABEL[rateKey] +
        " × " + fmt(RATE_FAKTOR[rateKey]) + " = " + fmt(rateBps) + " Bit/s</li>" +
        "<li>Übertragungsdauer = " + fmt(mengeBit) + " Bit ÷ " + fmt(rateBps) +
        " Bit/s ≈ " + fmt(dauer) + " s</li>";
      stepsEl.hidden = false;

      container.querySelector("#uedr-out-bit").textContent = fmt(mengeBit) + " Bit";
      container.querySelector("#uedr-out-rate").textContent = fmt(rateBps) + " Bit/s";
      container.querySelector("#uedr-out-dauer").textContent = formatDauer(dauer);
      resultEl.hidden = false;
    }

    btn.addEventListener("click", calculate);
    [mengeInput, rateInput].forEach(function (el) {
      el.addEventListener("keydown", function (e) {
        if (e.key === "Enter") calculate();
      });
    });

    calculate();
  }

  function init() {
    document.querySelectorAll('[data-tool="uebertragungsdauer-rechner"]').forEach(buildTool);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
