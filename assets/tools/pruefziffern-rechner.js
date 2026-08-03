/* ==========================================================================
   pruefziffern-rechner.js — Pruefziffer-Berechnung mit Zwischenschritten:
   EAN-13 (Modulo-10, Faktoren 1/3) und IBAN (Modulo-97, ISO 7064).

   Einbindung: <div class="tool" data-tool="pruefziffern-rechner"></div>
   ========================================================================== */

(function () {
  "use strict";

  function ean13CheckDigit(digits12) {
    var sum = 0;
    var terms = [];
    for (var i = 0; i < 12; i++) {
      var weight = i % 2 === 0 ? 1 : 3;
      var d = digits12[i];
      sum += d * weight;
      terms.push(d + "×" + weight);
    }
    var nextTen = Math.ceil(sum / 10) * 10;
    if (nextTen === sum) nextTen += 10;
    var check = (10 - (sum % 10)) % 10;
    return { sum: sum, terms: terms, nextTen: nextTen, check: check };
  }

  // Wandelt einen Buchstaben in seine IBAN-Zahl (A=10 ... Z=35) um.
  function letterToNum(ch) {
    return (ch.charCodeAt(0) - 55).toString();
  }

  // Baut aus einem beliebigen alphanumerischen String die rein numerische
  // Zeichenkette fuer die Modulo-97-Rechnung (Buchstaben -> Zahlen).
  function toNumericString(s) {
    var out = "";
    for (var i = 0; i < s.length; i++) {
      var ch = s[i];
      if (/[0-9]/.test(ch)) {
        out += ch;
      } else if (/[A-Z]/.test(ch)) {
        out += letterToNum(ch);
      } else {
        return null;
      }
    }
    return out;
  }

  // Iteratives Modulo 97 ueber einen beliebig langen Ziffernstring
  // (verarbeitet Ziffer fuer Ziffer, damit keine Zahl zu gross fuer JS wird).
  function mod97(numericStr) {
    var remainder = 0;
    for (var i = 0; i < numericStr.length; i++) {
      remainder = (remainder * 10 + Number(numericStr[i])) % 97;
    }
    return remainder;
  }

  function buildTool(container) {
    container.innerHTML =
      '<div class="tool__row">' +
      '<div style="flex:1;min-width:160px;">' +
      '<label class="tool__label" for="pzr-modus">Modus</label>' +
      '<select class="tool__select" id="pzr-modus">' +
      '<option value="ean">EAN-13 (Modulo-10)</option>' +
      '<option value="iban">IBAN (Modulo-97)</option>' +
      "</select>" +
      "</div>" +
      "</div>" +

      '<div id="pzr-ean-fields">' +
      '<label class="tool__label" for="pzr-ean-input">Erste 12 Ziffern der EAN (13. Ziffer optional zur Prüfung)</label>' +
      '<input class="tool__input" type="text" id="pzr-ean-input" value="400638133393" autocomplete="off" inputmode="numeric">' +
      "</div>" +

      '<div id="pzr-iban-fields" hidden>' +
      '<div class="tool__row">' +
      '<div style="flex:1;min-width:100px;">' +
      '<label class="tool__label" for="pzr-iban-land">Länder-Code</label>' +
      '<input class="tool__input" type="text" id="pzr-iban-land" value="DE" maxlength="2" autocomplete="off">' +
      "</div>" +
      '<div style="flex:2;min-width:200px;">' +
      '<label class="tool__label" for="pzr-iban-bban">Bankleitzahl + Kontonummer (BBAN, ohne Prüfziffern)</label>' +
      '<input class="tool__input" type="text" id="pzr-iban-bban" value="370400440532013000" autocomplete="off" inputmode="numeric">' +
      "</div>" +
      "</div>" +
      "</div>" +

      '<button class="btn btn--primary" type="button" id="pzr-btn">Berechnen</button>' +
      '<p class="tool__error" id="pzr-error" hidden></p>' +
      '<ol class="tool__steps" id="pzr-steps" hidden></ol>' +
      '<dl class="tool__result" id="pzr-result" hidden></dl>';

    var modusSelect = container.querySelector("#pzr-modus");
    var eanFields = container.querySelector("#pzr-ean-fields");
    var ibanFields = container.querySelector("#pzr-iban-fields");
    var eanInput = container.querySelector("#pzr-ean-input");
    var ibanLandInput = container.querySelector("#pzr-iban-land");
    var ibanBbanInput = container.querySelector("#pzr-iban-bban");
    var btn = container.querySelector("#pzr-btn");
    var errorEl = container.querySelector("#pzr-error");
    var stepsEl = container.querySelector("#pzr-steps");
    var resultEl = container.querySelector("#pzr-result");

    modusSelect.addEventListener("change", function () {
      var isEan = modusSelect.value === "ean";
      eanFields.hidden = !isEan;
      ibanFields.hidden = isEan;
      calculate();
    });

    function calculateEan() {
      var raw = eanInput.value.trim().replace(/\s+/g, "");
      if (!/^\d{12,13}$/.test(raw)) {
        return { error: "Bitte 12 Ziffern (oder 13 zur Prüfung) eingeben — nur Ziffern, keine Buchstaben oder Sonderzeichen." };
      }
      var digits12 = raw.slice(0, 12).split("").map(Number);
      var given13 = raw.length === 13 ? Number(raw[12]) : null;
      var r = ean13CheckDigit(digits12);

      var stepsHtml =
        "<li>Ziffern 1–12 abwechselnd mit 1 und 3 multiplizieren: " + r.terms.join(" + ") + "</li>" +
        "<li>Summe = " + r.sum + "</li>" +
        "<li>Nächste volle Zehnerstufe = " + r.nextTen + "</li>" +
        "<li>Prüfziffer = " + r.nextTen + " − " + r.sum + " = " + r.check + "</li>";

      var resultHtml =
        '<div class="tool__result-row"><dt>Berechnete Prüfziffer</dt><dd>' + r.check + "</dd></div>" +
        '<div class="tool__result-row"><dt>Vollständige EAN-13</dt><dd>' + digits12.join("") + r.check + "</dd></div>";

      if (given13 !== null) {
        var gueltig = given13 === r.check;
        stepsHtml += "<li>Vergleich mit eingegebener 13. Ziffer (" + given13 + "): " +
          (gueltig ? "stimmt überein" : "stimmt NICHT überein") + "</li>";
        resultHtml += '<div class="tool__result-row"><dt>Eingegebene EAN gültig?</dt><dd>' +
          (gueltig ? "Ja" : "Nein") + "</dd></div>";
      }

      return { stepsHtml: stepsHtml, resultHtml: resultHtml };
    }

    function calculateIban() {
      var land = ibanLandInput.value.trim().toUpperCase();
      var bban = ibanBbanInput.value.trim().replace(/\s+/g, "").toUpperCase();

      if (!/^[A-Z]{2}$/.test(land)) {
        return { error: "Länder-Code muss aus genau zwei Buchstaben bestehen (z. B. DE)." };
      }
      if (!/^[A-Z0-9]{4,30}$/.test(bban)) {
        return { error: "BBAN (Bankleitzahl + Kontonummer) muss 4–30 Zeichen (Ziffern, ggf. Buchstaben) enthalten." };
      }

      var rearranged = bban + land + "00";
      var numeric = toNumericString(rearranged);
      if (numeric === null) {
        return { error: "Ungültiges Zeichen in Länder-Code oder BBAN." };
      }
      var remainder = mod97(numeric);
      var checkDigits = 98 - remainder;
      var checkDigitsStr = ("0" + checkDigits).slice(-2);
      var fullIban = land + checkDigitsStr + bban;

      var validationString = bban + land + checkDigitsStr;
      var validationNumeric = toNumericString(validationString);
      var validationRemainder = mod97(validationNumeric);

      var stepsHtml =
        "<li>Länder-Code + BBAN umstellen, Prüfziffern-Platzhalter „00“ ans Ende: " + rearranged + "</li>" +
        "<li>Buchstaben in Zahlen umwandeln (A=10 … Z=35): " + numeric + "</li>" +
        "<li>Modulo 97 dieser Zahl = " + remainder + "</li>" +
        "<li>Prüfziffern = 98 − " + remainder + " = " + checkDigitsStr + "</li>" +
        "<li>Kontrolle: " + validationString + " → Zahl " + validationNumeric + " mod 97 = " + validationRemainder + " (muss 1 ergeben)</li>";

      var resultHtml =
        '<div class="tool__result-row"><dt>Berechnete Prüfziffern</dt><dd>' + checkDigitsStr + "</dd></div>" +
        '<div class="tool__result-row"><dt>Vollständige IBAN</dt><dd>' + fullIban + "</dd></div>" +
        '<div class="tool__result-row"><dt>Kontrollrechnung (muss 1 sein)</dt><dd>' + validationRemainder + "</dd></div>";

      return { stepsHtml: stepsHtml, resultHtml: resultHtml };
    }

    function calculate() {
      errorEl.hidden = true;
      stepsEl.hidden = true;
      resultEl.hidden = true;

      var out = modusSelect.value === "ean" ? calculateEan() : calculateIban();
      if (out.error) {
        errorEl.textContent = out.error;
        errorEl.hidden = false;
        return;
      }

      stepsEl.innerHTML = out.stepsHtml;
      stepsEl.hidden = false;
      resultEl.innerHTML = out.resultHtml;
      resultEl.hidden = false;
    }

    btn.addEventListener("click", calculate);
    [eanInput, ibanLandInput, ibanBbanInput].forEach(function (el) {
      el.addEventListener("keydown", function (e) {
        if (e.key === "Enter") calculate();
      });
    });

    calculate();
  }

  function init() {
    document.querySelectorAll('[data-tool="pruefziffern-rechner"]').forEach(buildTool);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
