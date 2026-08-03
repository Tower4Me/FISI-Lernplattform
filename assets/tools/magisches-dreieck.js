/* ==========================================================================
   magisches-dreieck.js — Interaktives magisches Dreieck: drei Regler
   (Zeit, Kosten, Qualität) verschieben sich gegenseitig, ihre Summe bleibt
   immer bei 100 %. Die Scope-Fläche in der Mitte ist am größten, wenn alle
   drei ausgeglichen sind, und schrumpft, sobald ein Wert die anderen
   dominiert.

   Einbindung: <div class="tool" data-tool="magisches-dreieck"></div>
   ========================================================================== */

(function () {
  "use strict";

  var KEYS = ["zeit", "kosten", "qualitaet"];
  var LABELS = { zeit: "Zeit", kosten: "Kosten", qualitaet: "Qualität" };
  var COLORS = {
    zeit: "var(--acc-einstieg)",
    kosten: "var(--acc-merksatz)",
    qualitaet: "var(--acc-quiz)"
  };
  var TOTAL = 100;
  var BALANCED = TOTAL / 3;
  var MAX_INNER_RATIO = 0.42;
  var MIN_SCALE = 0.03;

  // Eckpunkte des äußeren, gleichseitigen Dreiecks (fest, ändern sich nicht)
  var APEX = { x: 145, y: 30 };
  var BASE_L = { x: 40, y: 212 };
  var BASE_R = { x: 250, y: 212 };
  var CENTROID = {
    x: (APEX.x + BASE_L.x + BASE_R.x) / 3,
    y: (APEX.y + BASE_L.y + BASE_R.y) / 3
  };

  function poly(points) {
    return points
      .map(function (p) {
        return p.x + "," + p.y;
      })
      .join(" ");
  }

  function scaleAbout(p, center, k) {
    return {
      x: center.x + (p.x - center.x) * k,
      y: center.y + (p.y - center.y) * k
    };
  }

  function svgMarkup() {
    return (
      '<svg viewBox="0 0 290 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="md-title md-desc">' +
      '<title id="md-title">Interaktives magisches Dreieck</title>' +
      '<desc id="md-desc">Ein gleichseitiges Dreieck mit den Eckpunkten Zeit, Kosten und Qualität. Drei Regler verschieben die drei Werte gegeneinander, ihre Summe bleibt immer bei 100 Prozent. Die Scope-Fläche in der Mitte ist am größten, wenn alle drei Werte gleich groß sind, und schrumpft, sobald ein Wert die anderen dominiert.</desc>' +
      '<polygon points="' +
      poly([APEX, BASE_L, BASE_R]) +
      '" fill="none" stroke="var(--text-muted)" stroke-width="2"/>' +
      '<polygon data-role="scope" points="" fill="var(--acc-praxis)" fill-opacity="0.18" stroke="var(--acc-praxis)" stroke-width="1.5" stroke-dasharray="4 3"/>' +
      '<text data-role="scope-label" x="' +
      CENTROID.x +
      '" y="' +
      (CENTROID.y - 5) +
      '" text-anchor="middle" fill="var(--acc-praxis)" font-size="10" font-weight="700">Scope</text>' +
      '<text data-role="scope-value" x="' +
      CENTROID.x +
      '" y="' +
      (CENTROID.y + 10) +
      '" text-anchor="middle" fill="var(--acc-praxis)" font-size="9">100%</text>' +
      '<circle cx="' +
      APEX.x +
      '" cy="' +
      APEX.y +
      '" r="5" fill="' +
      COLORS.zeit +
      '"/>' +
      '<circle cx="' +
      BASE_L.x +
      '" cy="' +
      BASE_L.y +
      '" r="5" fill="' +
      COLORS.kosten +
      '"/>' +
      '<circle cx="' +
      BASE_R.x +
      '" cy="' +
      BASE_R.y +
      '" r="5" fill="' +
      COLORS.qualitaet +
      '"/>' +
      '<text data-role="label-zeit" x="' +
      APEX.x +
      '" y="16" text-anchor="middle" fill="' +
      COLORS.zeit +
      '" font-size="11" font-weight="700">Zeit: 33%</text>' +
      '<text data-role="label-kosten" x="' +
      BASE_L.x +
      '" y="230" text-anchor="middle" fill="' +
      COLORS.kosten +
      '" font-size="11" font-weight="700">Kosten: 33%</text>' +
      '<text data-role="label-qualitaet" x="' +
      BASE_R.x +
      '" y="230" text-anchor="middle" fill="' +
      COLORS.qualitaet +
      '" font-size="11" font-weight="700">Qualität: 33%</text>' +
      "</svg>"
    );
  }

  function buildTool(container) {
    var values = { zeit: TOTAL / 3, kosten: TOTAL / 3, qualitaet: TOTAL / 3 };

    container.innerHTML =
      '<div class="figure--diagram" data-role="figure">' +
      svgMarkup() +
      "</div>" +
      '<div class="tool__row" data-role="sliders"></div>' +
      '<button type="button" class="btn" data-role="reset">Zurücksetzen (ausgeglichen)</button>' +
      '<p class="tool__hint">Ein Regler nach oben zieht die beiden anderen automatisch nach unten — die drei Werte ergeben immer zusammen 100&nbsp;%. Die grüne Scope-Fläche in der Mitte ist am größten, wenn alle drei ausgeglichen sind, und schrumpft, sobald ein Wert die anderen dominiert.</p>';

    var sliderRow = container.querySelector('[data-role="sliders"]');
    var sliders = {};
    var valueOuts = {};

    KEYS.forEach(function (key) {
      var wrap = document.createElement("div");
      wrap.style.flex = "1";
      wrap.style.minWidth = "140px";

      var label = document.createElement("label");
      label.className = "tool__label";
      label.textContent = LABELS[key];
      label.style.color = COLORS[key];

      var range = document.createElement("input");
      range.type = "range";
      range.min = "0";
      range.max = "100";
      range.step = "1";
      range.className = "tool__range";
      range.style.accentColor = COLORS[key];
      range.setAttribute("aria-label", LABELS[key] + " (Prozent)");

      var out = document.createElement("span");
      out.className = "tool__hint";
      out.style.display = "block";
      out.style.marginTop = "0";

      wrap.appendChild(label);
      wrap.appendChild(range);
      wrap.appendChild(out);
      sliderRow.appendChild(wrap);

      sliders[key] = range;
      valueOuts[key] = out;

      range.addEventListener("input", function () {
        redistribute(key, parseFloat(range.value));
        render();
      });
    });

    container
      .querySelector('[data-role="reset"]')
      .addEventListener("click", function () {
        values = { zeit: TOTAL / 3, kosten: TOTAL / 3, qualitaet: TOTAL / 3 };
        render();
      });

    function redistribute(changedKey, newVal) {
      newVal = Math.max(0, Math.min(100, newVal));
      var others = KEYS.filter(function (k) {
        return k !== changedKey;
      });
      var remaining = TOTAL - newVal;
      var sumOthers = values[others[0]] + values[others[1]];
      values[changedKey] = newVal;
      if (sumOthers <= 0.0001) {
        values[others[0]] = remaining / 2;
        values[others[1]] = remaining / 2;
      } else {
        values[others[0]] = remaining * (values[others[0]] / sumOthers);
        values[others[1]] = remaining * (values[others[1]] / sumOthers);
      }
    }

    var scopePoly = container.querySelector('[data-role="scope"]');
    var scopeValueText = container.querySelector('[data-role="scope-value"]');
    var labelZeit = container.querySelector('[data-role="label-zeit"]');
    var labelKosten = container.querySelector('[data-role="label-kosten"]');
    var labelQualitaet = container.querySelector(
      '[data-role="label-qualitaet"]'
    );

    function render() {
      KEYS.forEach(function (key) {
        sliders[key].value = String(Math.round(values[key]));
        valueOuts[key].textContent = Math.round(values[key]) + " %";
      });

      labelZeit.textContent = "Zeit: " + Math.round(values.zeit) + "%";
      labelKosten.textContent = "Kosten: " + Math.round(values.kosten) + "%";
      labelQualitaet.textContent =
        "Qualität: " + Math.round(values.qualitaet) + "%";

      var minVal = Math.min(values.zeit, values.kosten, values.qualitaet);
      var balanceRatio = minVal / BALANCED;
      var scale = Math.max(MIN_SCALE, balanceRatio) * MAX_INNER_RATIO;

      var innerApex = scaleAbout(APEX, CENTROID, scale);
      var innerBaseL = scaleAbout(BASE_L, CENTROID, scale);
      var innerBaseR = scaleAbout(BASE_R, CENTROID, scale);
      scopePoly.setAttribute(
        "points",
        poly([innerApex, innerBaseL, innerBaseR])
      );

      scopeValueText.textContent = Math.round(balanceRatio * 100) + "%";
    }

    render();
  }

  function init() {
    document
      .querySelectorAll('[data-tool="magisches-dreieck"]')
      .forEach(buildTool);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
