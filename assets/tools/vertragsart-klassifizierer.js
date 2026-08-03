/* ==========================================================================
   vertragsart-klassifizierer.js — ordnet ein gewaehltes Geschaeftsszenario
   einer BGB-Vertragsart zu (Kauf/Werk/Dienst/Miete/Leasing) inkl. Begruendung.

   Einbindung: <div class="tool" data-tool="vertragsart-klassifizierer"></div>
   ========================================================================== */

(function () {
  "use strict";

  var SZENARIEN = [
    {
      text: "Ein Kunde kauft 10 Notebooks im Elektrofachhandel.",
      art: "Kaufvertrag",
      norm: "§ 433 BGB",
      begruendung: "Geschuldet ist die Übereignung einer Sache (die Notebooks) gegen Zahlung des Kaufpreises — das Eigentum geht endgültig über."
    },
    {
      text: "Ein Unternehmen kauft eine fertige Standardsoftware als Lizenz im Onlineshop.",
      art: "Kaufvertrag",
      norm: "§ 433 BGB (Rechtskauf analog § 453 BGB)",
      begruendung: "Auch wenn nur eine Lizenz statt einer körperlichen Sache übertragen wird, liegt bei fertiger Standardsoftware ein Kaufvertrag vor — es wird eine fertige Ware erworben, kein individuelles Ergebnis erst erstellt."
    },
    {
      text: "Ein Softwareentwickler wird beauftragt, eine Individualsoftware nach genauem Lastenheft zu programmieren.",
      art: "Werkvertrag",
      norm: "§ 631 BGB",
      begruendung: "Geschuldet ist ein konkretes Ergebnis — die funktionierende Software gemäß Lastenheft. Erfüllt sie die Anforderungen nicht, liegt ein Mangel vor und Gewährleistungsrechte greifen."
    },
    {
      text: "Ein Systemhaus repariert einen defekten Server — nach der Reparatur muss der Server wieder einwandfrei funktionieren.",
      art: "Werkvertrag",
      norm: "§ 631 BGB",
      begruendung: "Geschuldet ist der Erfolg „Server funktioniert wieder“, nicht nur der Reparaturversuch. Läuft der Server danach immer noch nicht, ist das ein Mangel am Werk."
    },
    {
      text: "Ein IT-Berater unterstützt auf Stundenbasis bei der Systemadministration, ohne ein bestimmtes Ergebnis zu garantieren.",
      art: "Dienstvertrag",
      norm: "§ 611 BGB",
      begruendung: "Geschuldet ist nur die Tätigkeit selbst (die Beratungszeit), kein garantiertes Ergebnis. Berät der Berater redlich, hat er seine Pflicht erfüllt, auch wenn das gewünschte Ergebnis ausbleibt."
    },
    {
      text: "Ein Kunde mietet einen Beamer für einen einmaligen Vortragsabend.",
      art: "Mietvertrag",
      norm: "§ 535 BGB",
      begruendung: "Zeitweise Gebrauchsüberlassung gegen Miete mit klarer Rückgabe nach Vertragsende — der Beamer geht nie in das Eigentum des Kunden über."
    },
    {
      text: "Ein Kunde least einen Server für 3 Jahre mit Kaufoption am Laufzeitende.",
      art: "Leasingvertrag",
      norm: "mietrechtlich geprägt, keine eigene BGB-Norm",
      begruendung: "Langfristige Nutzungsüberlassung mit Kaufoption am Ende — anders als bei der reinen Miete besteht hier die Möglichkeit, den Server nach Laufzeitende zu übernehmen."
    },
    {
      text: "Ein Kunde least Arbeitsplatzrechner für die gesamte Belegschaft über 4 Jahre.",
      art: "Leasingvertrag",
      norm: "mietrechtlich geprägt, keine eigene BGB-Norm",
      begruendung: "Langfristige Nutzungsüberlassung von Hardware über mehrere Jahre statt einer hohen Einmalinvestition — typisches Leasing-Szenario in Unternehmen."
    }
  ];

  function buildTool(container) {
    var optionsHtml = SZENARIEN.map(function (s, i) {
      return '<option value="' + i + '">' + s.text + "</option>";
    }).join("");

    container.innerHTML =
      '<label class="tool__label" for="vak-szenario">Szenario wählen</label>' +
      '<select class="tool__select" id="vak-szenario">' + optionsHtml + "</select>" +
      '<button class="btn btn--primary" type="button" id="vak-btn">Berechnen</button>' +
      '<p class="tool__error" id="vak-error" hidden></p>' +
      '<dl class="tool__result" id="vak-result" hidden>' +
      '<div class="tool__result-row"><dt>Vertragsart</dt><dd id="vak-out-art"></dd></div>' +
      '<div class="tool__result-row"><dt>Rechtsgrundlage</dt><dd id="vak-out-norm"></dd></div>' +
      "</dl>" +
      '<p class="tool__hint" id="vak-out-begruendung" hidden></p>';

    var select = container.querySelector("#vak-szenario");
    var btn = container.querySelector("#vak-btn");
    var errorEl = container.querySelector("#vak-error");
    var resultEl = container.querySelector("#vak-result");
    var begruendungEl = container.querySelector("#vak-out-begruendung");

    function calculate() {
      errorEl.hidden = true;
      resultEl.hidden = true;
      begruendungEl.hidden = true;

      var index = parseInt(select.value, 10);
      var szenario = SZENARIEN[index];
      if (!szenario) {
        errorEl.textContent = "Bitte ein Szenario auswählen.";
        errorEl.hidden = false;
        return;
      }

      container.querySelector("#vak-out-art").textContent = szenario.art;
      container.querySelector("#vak-out-norm").textContent = szenario.norm;
      begruendungEl.textContent = "Begründung: " + szenario.begruendung;
      resultEl.hidden = false;
      begruendungEl.hidden = false;
    }

    btn.addEventListener("click", calculate);
    calculate();
  }

  function init() {
    document.querySelectorAll('[data-tool="vertragsart-klassifizierer"]').forEach(buildTool);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
