/* ==========================================================================
   break-even-rechner.js — Deckungsbeitrag und Break-Even-Menge aus Fixkosten,
   Verkaufspreis und variablen Stueckkosten.

   Einbindung: <div class="tool" data-tool="break-even-rechner"></div>
   ========================================================================== */

(function () {
  "use strict";

  function fmt(n) {
    return n.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
  }

  function buildTool(container) {
    container.innerHTML =
      '<div class="tool__row">' +
      '<div style="flex:1;min-width:150px;">' +
      '<label class="tool__label" for="ber-fixkosten">Fixkosten (€)</label>' +
      '<input class="tool__input" type="number" id="ber-fixkosten" min="0" step="any" value="4000">' +
      "</div>" +
      '<div style="flex:1;min-width:150px;">' +
      '<label class="tool__label" for="ber-preis">Verkaufspreis pro Stück (€)</label>' +
      '<input class="tool__input" type="number" id="ber-preis" min="0" step="any" value="25">' +
      "</div>" +
      '<div style="flex:1;min-width:150px;">' +
      '<label class="tool__label" for="ber-varkosten">Variable Stückkosten (€)</label>' +
      '<input class="tool__input" type="number" id="ber-varkosten" min="0" step="any" value="10">' +
      "</div>" +
      "</div>" +
      '<button class="btn btn--primary" type="button" id="ber-btn">Berechnen</button>' +
      '<p class="tool__error" id="ber-error" hidden></p>' +
      '<ol class="tool__steps" id="ber-steps" hidden></ol>' +
      '<dl class="tool__result" id="ber-result" hidden>' +
      '<div class="tool__result-row"><dt>Deckungsbeitrag pro Stück</dt><dd id="ber-out-db"></dd></div>' +
      '<div class="tool__result-row"><dt>Break-Even-Menge</dt><dd id="ber-out-menge"></dd></div>' +
      '<div class="tool__result-row"><dt>Break-Even-Umsatz</dt><dd id="ber-out-umsatz"></dd></div>' +
      "</dl>";

    var fixkostenInput = container.querySelector("#ber-fixkosten");
    var preisInput = container.querySelector("#ber-preis");
    var varkostenInput = container.querySelector("#ber-varkosten");
    var btn = container.querySelector("#ber-btn");
    var errorEl = container.querySelector("#ber-error");
    var stepsEl = container.querySelector("#ber-steps");
    var resultEl = container.querySelector("#ber-result");

    function nonNegNumber(raw) {
      var n = Number(String(raw).trim().replace(",", "."));
      if (!Number.isFinite(n) || n < 0) return null;
      return n;
    }

    function calculate() {
      errorEl.hidden = true;
      stepsEl.hidden = true;
      resultEl.hidden = true;

      var fixkosten = nonNegNumber(fixkostenInput.value);
      var preis = nonNegNumber(preisInput.value);
      var varkosten = nonNegNumber(varkostenInput.value);

      if (fixkosten === null || preis === null || varkosten === null) {
        errorEl.textContent = "Alle drei Werte müssen Zahlen ≥ 0 sein.";
        errorEl.hidden = false;
        return;
      }

      var db = preis - varkosten;
      if (db <= 0) {
        errorEl.textContent = "Der Verkaufspreis muss größer sein als die variablen Stückkosten, sonst ist der Deckungsbeitrag nicht positiv und es gibt keinen Break-Even-Point.";
        errorEl.hidden = false;
        return;
      }

      var beMengeExakt = fixkosten / db;
      var beMenge = Math.ceil(beMengeExakt);
      var beUmsatz = beMenge * preis;

      stepsEl.innerHTML =
        "<li>Deckungsbeitrag pro Stück = " + fmt(preis) + " − " + fmt(varkosten) + " = " + fmt(db) + "</li>" +
        "<li>Break-Even-Menge = " + fmt(fixkosten) + " ÷ " + fmt(db) + " ≈ " +
        beMengeExakt.toLocaleString("de-DE", { maximumFractionDigits: 2 }) +
        " → aufgerundet " + beMenge + " Stück</li>" +
        "<li>Break-Even-Umsatz = " + beMenge + " × " + fmt(preis) + " = " + fmt(beUmsatz) + "</li>";
      stepsEl.hidden = false;

      container.querySelector("#ber-out-db").textContent = fmt(db) + " pro Stück";
      container.querySelector("#ber-out-menge").textContent = beMenge + " Stück";
      container.querySelector("#ber-out-umsatz").textContent = fmt(beUmsatz);
      resultEl.hidden = false;
    }

    btn.addEventListener("click", calculate);
    [fixkostenInput, preisInput, varkostenInput].forEach(function (el) {
      el.addEventListener("keydown", function (e) {
        if (e.key === "Enter") calculate();
      });
    });

    calculate();
  }

  function init() {
    document.querySelectorAll('[data-tool="break-even-rechner"]').forEach(buildTool);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
