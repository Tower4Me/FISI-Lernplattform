/* ==========================================================================
   passwort-komplexitaet-rechner.js — Kombinationsanzahl (Zeichenraum^Laenge)
   und daraus abgeleitete maximale Brute-Force-Dauer bei gegebener Rate.

   Einbindung: <div class="tool" data-tool="passwort-komplexitaet-rechner"></div>
   ========================================================================== */

(function () {
  "use strict";

  var ZEICHENSAETZE = [
    { key: "klein", label: "Kleinbuchstaben (a–z, 26 Zeichen)", groesse: 26, checked: true },
    { key: "gross", label: "Großbuchstaben (A–Z, 26 Zeichen)", groesse: 26, checked: true },
    { key: "ziffern", label: "Ziffern (0–9, 10 Zeichen)", groesse: 10, checked: true },
    { key: "sonder", label: "Sonderzeichen (~32 Zeichen)", groesse: 32, checked: true }
  ];

  function fmtBig(n) {
    if (!isFinite(n)) return "> 10³⁰⁸ (jenseits normaler Zahlendarstellung)";
    if (Math.abs(n) < 1e6) {
      return n.toLocaleString("de-DE", { maximumFractionDigits: 2 });
    }
    var exp = n.toExponential(3); // z.B. "4.750e+23"
    var parts = exp.split("e");
    var mantisse = Number(parts[0]).toLocaleString("de-DE", { maximumFractionDigits: 3 });
    var exponent = parseInt(parts[1], 10);
    return mantisse + " × 10" + toSuperscript(exponent);
  }

  function toSuperscript(n) {
    var map = { "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹", "-": "⁻" };
    return String(n).split("").map(function (c) { return map[c] || c; }).join("");
  }

  function formatDauer(sekunden) {
    if (sekunden < 60) return fmtBig(sekunden) + " Sekunden";
    var minuten = sekunden / 60;
    if (minuten < 60) return fmtBig(minuten) + " Minuten";
    var stunden = minuten / 60;
    if (stunden < 24) return fmtBig(stunden) + " Stunden";
    var tage = stunden / 24;
    if (tage < 365.25) return fmtBig(tage) + " Tage";
    var jahre = tage / 365.25;
    return fmtBig(jahre) + " Jahre";
  }

  function buildTool(container) {
    var checkboxesHtml = ZEICHENSAETZE.map(function (z) {
      return '<label style="display:flex;align-items:center;gap:0.4rem;font-size:0.9rem;margin-bottom:0.4rem;">' +
        '<input type="checkbox" id="pkr-check-' + z.key + '"' + (z.checked ? " checked" : "") + '> ' + z.label +
        "</label>";
    }).join("");

    container.innerHTML =
      '<div style="margin-bottom:0.75rem;">' + checkboxesHtml + "</div>" +
      '<div class="tool__row">' +
      '<div style="flex:1;min-width:120px;">' +
      '<label class="tool__label" for="pkr-laenge">Passwortlänge</label>' +
      '<input class="tool__input" type="number" id="pkr-laenge" min="1" max="128" step="1" value="12">' +
      "</div>" +
      '<div style="flex:1;min-width:160px;">' +
      '<label class="tool__label" for="pkr-rate">Rateversuche pro Sekunde</label>' +
      '<input class="tool__input" type="number" id="pkr-rate" min="1" step="any" value="1000000000">' +
      "</div>" +
      "</div>" +
      '<p class="tool__hint" style="margin-top:-0.4rem;">Richtwert: ca. 10⁹ (1 Milliarde) Versuche/s für einen schnellen Offline-Angriff auf einen gestohlenen Passwort-Hash, ca. 10 Versuche/s für einen Online-Login mit Sperrfunktion.</p>' +
      '<button class="btn btn--primary" type="button" id="pkr-btn">Berechnen</button>' +
      '<p class="tool__error" id="pkr-error" hidden></p>' +
      '<ol class="tool__steps" id="pkr-steps" hidden></ol>' +
      '<dl class="tool__result" id="pkr-result" hidden>' +
      '<div class="tool__result-row"><dt>Zeichenraum</dt><dd id="pkr-out-zeichenraum"></dd></div>' +
      '<div class="tool__result-row"><dt>Mögliche Kombinationen</dt><dd id="pkr-out-kombinationen"></dd></div>' +
      '<div class="tool__result-row"><dt>Maximale Brute-Force-Dauer</dt><dd id="pkr-out-dauer"></dd></div>' +
      "</dl>";

    var checkboxes = ZEICHENSAETZE.map(function (z) {
      return container.querySelector("#pkr-check-" + z.key);
    });
    var laengeInput = container.querySelector("#pkr-laenge");
    var rateInput = container.querySelector("#pkr-rate");
    var btn = container.querySelector("#pkr-btn");
    var errorEl = container.querySelector("#pkr-error");
    var stepsEl = container.querySelector("#pkr-steps");
    var resultEl = container.querySelector("#pkr-result");

    function calculate() {
      errorEl.hidden = true;
      stepsEl.hidden = true;
      resultEl.hidden = true;

      var zeichenraum = 0;
      var gewaehlt = [];
      ZEICHENSAETZE.forEach(function (z, i) {
        if (checkboxes[i].checked) {
          zeichenraum += z.groesse;
          gewaehlt.push(z.groesse + " (" + z.label.split(" (")[0] + ")");
        }
      });

      if (zeichenraum === 0) {
        errorEl.textContent = "Bitte mindestens eine Zeichenart auswählen.";
        errorEl.hidden = false;
        return;
      }

      var laenge = Number(laengeInput.value);
      if (!Number.isInteger(laenge) || laenge < 1 || laenge > 128) {
        errorEl.textContent = "Passwortlänge muss eine ganze Zahl zwischen 1 und 128 sein.";
        errorEl.hidden = false;
        return;
      }

      var rate = Number(String(rateInput.value).trim().replace(",", "."));
      if (!Number.isFinite(rate) || rate <= 0) {
        errorEl.textContent = "Rateversuche pro Sekunde müssen eine positive Zahl sein.";
        errorEl.hidden = false;
        return;
      }

      var kombinationen = Math.pow(zeichenraum, laenge);
      var dauerSekunden = kombinationen / rate;

      stepsEl.innerHTML =
        "<li>Zeichenraum = " + gewaehlt.join(" + ") + " = " + zeichenraum + " Zeichen</li>" +
        "<li>Kombinationen = " + zeichenraum + "<sup>" + laenge + "</sup> ≈ " + fmtBig(kombinationen) + "</li>" +
        "<li>Maximale Dauer = " + fmtBig(kombinationen) + " ÷ " + fmtBig(rate) + " Versuche/s ≈ " + fmtBig(dauerSekunden) + " Sekunden</li>";
      stepsEl.hidden = false;

      container.querySelector("#pkr-out-zeichenraum").textContent = zeichenraum + " Zeichen";
      container.querySelector("#pkr-out-kombinationen").textContent = zeichenraum + "^" + laenge + " ≈ " + fmtBig(kombinationen);
      container.querySelector("#pkr-out-dauer").textContent = formatDauer(dauerSekunden);
      resultEl.hidden = false;
    }

    btn.addEventListener("click", calculate);
    [laengeInput, rateInput].forEach(function (el) {
      el.addEventListener("keydown", function (e) {
        if (e.key === "Enter") calculate();
      });
    });

    calculate();
  }

  function init() {
    document.querySelectorAll('[data-tool="passwort-komplexitaet-rechner"]').forEach(buildTool);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
