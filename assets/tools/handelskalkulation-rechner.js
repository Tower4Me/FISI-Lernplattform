/* ==========================================================================
   handelskalkulation-rechner.js — komplettes Kalkulationsschema Einkauf +
   Verkauf, vom Listeneinkaufspreis (LEP) bis zum Listenverkaufspreis (LVP),
   inkl. Rueckrechnung von Kundenskonto/-rabatt per Division statt Aufaddieren.

   Einbindung: <div class="tool" data-tool="handelskalkulation-rechner"></div>
   ========================================================================== */

(function () {
  "use strict";

  function fmt(n) {
    return n.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
  }

  function pct(n) {
    return n.toLocaleString("de-DE", { maximumFractionDigits: 2 }) + " %";
  }

  function buildTool(container) {
    container.innerHTML =
      '<div class="tool__row">' +
      '<div style="flex:1;min-width:150px;">' +
      '<label class="tool__label" for="hkr-lep">Listeneinkaufspreis (LEP, €)</label>' +
      '<input class="tool__input" type="number" id="hkr-lep" min="0" step="any" value="500">' +
      "</div>" +
      '<div style="flex:1;min-width:120px;">' +
      '<label class="tool__label" for="hkr-rabatt-liefer">Liefererrabatt (%)</label>' +
      '<input class="tool__input" type="number" id="hkr-rabatt-liefer" min="0" max="99" step="any" value="15">' +
      "</div>" +
      '<div style="flex:1;min-width:120px;">' +
      '<label class="tool__label" for="hkr-skonto-liefer">Liefererskonto (%)</label>' +
      '<input class="tool__input" type="number" id="hkr-skonto-liefer" min="0" max="99" step="any" value="2">' +
      "</div>" +
      "</div>" +
      '<div class="tool__row">' +
      '<div style="flex:1;min-width:150px;">' +
      '<label class="tool__label" for="hkr-bezugskosten">Bezugskosten (€)</label>' +
      '<input class="tool__input" type="number" id="hkr-bezugskosten" min="0" step="any" value="23.5">' +
      "</div>" +
      '<div style="flex:1;min-width:120px;">' +
      '<label class="tool__label" for="hkr-gemeinkosten">Gemeinkostenzuschlag (%)</label>' +
      '<input class="tool__input" type="number" id="hkr-gemeinkosten" min="0" step="any" value="25">' +
      "</div>" +
      '<div style="flex:1;min-width:120px;">' +
      '<label class="tool__label" for="hkr-gewinn">Gewinnzuschlag (%)</label>' +
      '<input class="tool__input" type="number" id="hkr-gewinn" min="0" step="any" value="20">' +
      "</div>" +
      "</div>" +
      '<div class="tool__row">' +
      '<div style="flex:1;min-width:120px;">' +
      '<label class="tool__label" for="hkr-skonto-kunde">Kundenskonto (%)</label>' +
      '<input class="tool__input" type="number" id="hkr-skonto-kunde" min="0" max="99" step="any" value="3">' +
      "</div>" +
      '<div style="flex:1;min-width:120px;">' +
      '<label class="tool__label" for="hkr-rabatt-kunde">Kundenrabatt (%)</label>' +
      '<input class="tool__input" type="number" id="hkr-rabatt-kunde" min="0" max="99" step="any" value="10">' +
      "</div>" +
      "</div>" +
      '<button class="btn btn--primary" type="button" id="hkr-btn">Berechnen</button>' +
      '<p class="tool__error" id="hkr-error" hidden></p>' +
      '<ol class="tool__steps" id="hkr-steps" hidden></ol>' +
      '<dl class="tool__result" id="hkr-result" hidden>' +
      '<div class="tool__result-row"><dt>Bezugspreis / Einstandspreis (EP)</dt><dd id="hkr-out-ep"></dd></div>' +
      '<div class="tool__result-row"><dt>Selbstkostenpreis (SKP)</dt><dd id="hkr-out-skp"></dd></div>' +
      '<div class="tool__result-row"><dt>Barverkaufspreis (BVP)</dt><dd id="hkr-out-bvp"></dd></div>' +
      '<div class="tool__result-row"><dt>Zielverkaufspreis (ZVP)</dt><dd id="hkr-out-zvp"></dd></div>' +
      '<div class="tool__result-row"><dt>Listenverkaufspreis (LVP)</dt><dd id="hkr-out-lvp"></dd></div>' +
      "</dl>";

    var lepInput = container.querySelector("#hkr-lep");
    var rabattLieferInput = container.querySelector("#hkr-rabatt-liefer");
    var skontoLieferInput = container.querySelector("#hkr-skonto-liefer");
    var bezugskostenInput = container.querySelector("#hkr-bezugskosten");
    var gemeinkostenInput = container.querySelector("#hkr-gemeinkosten");
    var gewinnInput = container.querySelector("#hkr-gewinn");
    var skontoKundeInput = container.querySelector("#hkr-skonto-kunde");
    var rabattKundeInput = container.querySelector("#hkr-rabatt-kunde");
    var btn = container.querySelector("#hkr-btn");
    var errorEl = container.querySelector("#hkr-error");
    var stepsEl = container.querySelector("#hkr-steps");
    var resultEl = container.querySelector("#hkr-result");

    function nonNegNumber(raw) {
      var n = Number(String(raw).trim().replace(",", "."));
      if (!Number.isFinite(n) || n < 0) return null;
      return n;
    }

    function percent(raw) {
      var n = nonNegNumber(raw);
      if (n === null || n >= 100) return null;
      return n;
    }

    function calculate() {
      errorEl.hidden = true;
      stepsEl.hidden = true;
      resultEl.hidden = true;

      var lep = nonNegNumber(lepInput.value);
      var rabattLiefer = percent(rabattLieferInput.value);
      var skontoLiefer = percent(skontoLieferInput.value);
      var bezugskosten = nonNegNumber(bezugskostenInput.value);
      var gemeinkosten = nonNegNumber(gemeinkostenInput.value);
      var gewinn = nonNegNumber(gewinnInput.value);
      var skontoKunde = percent(skontoKundeInput.value);
      var rabattKunde = percent(rabattKundeInput.value);

      if (lep === null || lep <= 0) {
        errorEl.textContent = "Listeneinkaufspreis muss eine positive Zahl sein.";
        errorEl.hidden = false;
        return;
      }
      if (rabattLiefer === null || skontoLiefer === null || skontoKunde === null || rabattKunde === null) {
        errorEl.textContent = "Prozentsätze müssen zwischen 0 und unter 100 % liegen.";
        errorEl.hidden = false;
        return;
      }
      if (bezugskosten === null || gemeinkosten === null || gewinn === null) {
        errorEl.textContent = "Bezugskosten, Gemeinkosten- und Gewinnzuschlag müssen Zahlen ≥ 0 sein.";
        errorEl.hidden = false;
        return;
      }

      var rabattLieferBetrag = lep * (rabattLiefer / 100);
      var zep = lep - rabattLieferBetrag;
      var skontoLieferBetrag = zep * (skontoLiefer / 100);
      var bep = zep - skontoLieferBetrag;
      var ep = bep + bezugskosten;

      var gemeinkostenBetrag = ep * (gemeinkosten / 100);
      var skp = ep + gemeinkostenBetrag;
      var gewinnBetrag = skp * (gewinn / 100);
      var bvp = skp + gewinnBetrag;
      var zvp = bvp / (1 - skontoKunde / 100);
      var lvp = zvp / (1 - rabattKunde / 100);

      stepsEl.innerHTML =
        "<li>Listeneinkaufspreis (LEP) = " + fmt(lep) + "</li>" +
        "<li>− " + pct(rabattLiefer) + " Liefererrabatt (" + fmt(lep) + " × " + pct(rabattLiefer) + ") = − " + fmt(rabattLieferBetrag) + " → Zieleinkaufspreis (ZEP) = " + fmt(zep) + "</li>" +
        "<li>− " + pct(skontoLiefer) + " Liefererskonto (von " + fmt(zep) + ") = − " + fmt(skontoLieferBetrag) + " → Bareinkaufspreis (BEP) = " + fmt(bep) + "</li>" +
        "<li>+ Bezugskosten " + fmt(bezugskosten) + " → Bezugspreis/Einstandspreis (EP) = " + fmt(ep) + "</li>" +
        "<li>+ " + pct(gemeinkosten) + " Gemeinkostenzuschlag (" + fmt(ep) + " × " + pct(gemeinkosten) + ") = + " + fmt(gemeinkostenBetrag) + " → Selbstkostenpreis (SKP) = " + fmt(skp) + "</li>" +
        "<li>+ " + pct(gewinn) + " Gewinnzuschlag (" + fmt(skp) + " × " + pct(gewinn) + ") = + " + fmt(gewinnBetrag) + " → Barverkaufspreis (BVP) = " + fmt(bvp) + "</li>" +
        "<li>Zielverkaufspreis (ZVP) = " + fmt(bvp) + " ÷ (1 − " + pct(skontoKunde) + ") = " + fmt(bvp) + " ÷ " + (1 - skontoKunde / 100).toLocaleString("de-DE", { maximumFractionDigits: 4 }) + " ≈ " + fmt(zvp) + "</li>" +
        "<li>Listenverkaufspreis (LVP) = " + fmt(zvp) + " ÷ (1 − " + pct(rabattKunde) + ") = " + fmt(zvp) + " ÷ " + (1 - rabattKunde / 100).toLocaleString("de-DE", { maximumFractionDigits: 4 }) + " ≈ " + fmt(lvp) + "</li>";
      stepsEl.hidden = false;

      container.querySelector("#hkr-out-ep").textContent = fmt(ep);
      container.querySelector("#hkr-out-skp").textContent = fmt(skp);
      container.querySelector("#hkr-out-bvp").textContent = fmt(bvp);
      container.querySelector("#hkr-out-zvp").textContent = fmt(zvp);
      container.querySelector("#hkr-out-lvp").textContent = fmt(lvp);
      resultEl.hidden = false;
    }

    btn.addEventListener("click", calculate);
    [lepInput, rabattLieferInput, skontoLieferInput, bezugskostenInput, gemeinkostenInput, gewinnInput, skontoKundeInput, rabattKundeInput].forEach(function (el) {
      el.addEventListener("keydown", function (e) {
        if (e.key === "Enter") calculate();
      });
    });

    calculate();
  }

  function init() {
    document.querySelectorAll('[data-tool="handelskalkulation-rechner"]').forEach(buildTool);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
