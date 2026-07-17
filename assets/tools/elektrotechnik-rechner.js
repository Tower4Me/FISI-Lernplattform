/* ==========================================================================
   elektrotechnik-rechner.js — Rechentrainer für die Grundformeln P=U×I,
   Ohmsches Gesetz, Wirkungsgrad und Energie (kWh). Formel wählen, zwei
   Werte eingeben, Ergebnis wird live berechnet.

   Einbindung: <div class="tool" data-tool="elektrotechnik-rechner"></div>
   ========================================================================== */

(function () {
  "use strict";

  var FORMULAS = {
    p_from_ui: {
      label: "P = U × I (Leistung)",
      inputs: [
        { key: "u", label: "Spannung U", unit: "V" },
        { key: "i", label: "Stromstärke I", unit: "A" }
      ],
      compute: function (v) {
        return { label: "Leistung P", value: v.u * v.i, unit: "W" };
      }
    },
    u_from_pi: {
      label: "U = P / I (Spannung)",
      inputs: [
        { key: "p", label: "Leistung P", unit: "W" },
        { key: "i", label: "Stromstärke I", unit: "A" }
      ],
      compute: function (v) {
        return { label: "Spannung U", value: v.p / v.i, unit: "V" };
      }
    },
    i_from_pu: {
      label: "I = P / U (Stromstärke)",
      inputs: [
        { key: "p", label: "Leistung P", unit: "W" },
        { key: "u", label: "Spannung U", unit: "V" }
      ],
      compute: function (v) {
        return { label: "Stromstärke I", value: v.p / v.u, unit: "A" };
      }
    },
    r_from_ui: {
      label: "R = U / I (Widerstand, Ohmsches Gesetz)",
      inputs: [
        { key: "u", label: "Spannung U", unit: "V" },
        { key: "i", label: "Stromstärke I", unit: "A" }
      ],
      compute: function (v) {
        return { label: "Widerstand R", value: v.u / v.i, unit: "Ω" };
      }
    },
    u_from_ri: {
      label: "U = R × I (Spannung über Ohmsches Gesetz)",
      inputs: [
        { key: "r", label: "Widerstand R", unit: "Ω" },
        { key: "i", label: "Stromstärke I", unit: "A" }
      ],
      compute: function (v) {
        return { label: "Spannung U", value: v.r * v.i, unit: "V" };
      }
    },
    i_from_ur: {
      label: "I = U / R (Stromstärke über Ohmsches Gesetz)",
      inputs: [
        { key: "u", label: "Spannung U", unit: "V" },
        { key: "r", label: "Widerstand R", unit: "Ω" }
      ],
      compute: function (v) {
        return { label: "Stromstärke I", value: v.u / v.r, unit: "A" };
      }
    },
    pzu_from_pab: {
      label: "P_zu = P_ab / η (Aufnahmeleistung aus Steckdose)",
      inputs: [
        { key: "pab", label: "Nutzleistung P_ab", unit: "W" },
        { key: "eta", label: "Wirkungsgrad η", unit: "0–1, z. B. 0,92" }
      ],
      compute: function (v) {
        return { label: "Aufnahmeleistung P_zu", value: v.pab / v.eta, unit: "W" };
      }
    },
    eta_from_p: {
      label: "η = P_ab / P_zu (Wirkungsgrad)",
      inputs: [
        { key: "pab", label: "Nutzleistung P_ab", unit: "W" },
        { key: "pzu", label: "Aufnahmeleistung P_zu", unit: "W" }
      ],
      compute: function (v) {
        return { label: "Wirkungsgrad η", value: (v.pab / v.pzu) * 100, unit: "%" };
      }
    },
    kwh: {
      label: "E = P × t / 1000 (Energie in kWh)",
      inputs: [
        { key: "p", label: "Leistung P", unit: "W" },
        { key: "t", label: "Laufzeit t", unit: "h" }
      ],
      compute: function (v) {
        return { label: "Energie E", value: (v.p * v.t) / 1000, unit: "kWh" };
      }
    }
  };

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function formatNumber(n) {
    if (!isFinite(n)) return "—";
    return n.toLocaleString("de-DE", { maximumFractionDigits: 2 });
  }

  function buildTool(container) {
    container.innerHTML = "";

    var select = el("select", "tool__select");
    Object.keys(FORMULAS).forEach(function (key) {
      var opt = el("option", null, FORMULAS[key].label);
      opt.value = key;
      select.appendChild(opt);
    });

    var inputRow = el("div", "tool__row");
    var output = el("div", "tool__output");
    var hint = el("p", "tool__hint");

    container.appendChild(select);
    container.appendChild(inputRow);
    container.appendChild(output);
    container.appendChild(hint);

    function render() {
      var formula = FORMULAS[select.value];
      inputRow.innerHTML = "";
      var fields = {};

      formula.inputs.forEach(function (spec) {
        var wrap = el("div");
        wrap.style.flex = "1";
        wrap.style.minWidth = "140px";
        var label = el("label", "tool__label", spec.label + " (" + spec.unit + ")");
        var input = el("input", "tool__input");
        input.type = "text";
        input.inputMode = "decimal";
        wrap.appendChild(label);
        wrap.appendChild(input);
        inputRow.appendChild(wrap);
        fields[spec.key] = input;
        input.addEventListener("input", update);
      });

      function update() {
        var values = {};
        var complete = true;
        Object.keys(fields).forEach(function (key) {
          var raw = fields[key].value.replace(",", ".").trim();
          var num = parseFloat(raw);
          if (raw === "" || isNaN(num)) complete = false;
          values[key] = num;
        });

        if (!complete) {
          output.textContent = "Werte eingeben …";
          return;
        }

        var result = formula.compute(values);
        output.textContent =
          result.label + " = " + formatNumber(result.value) + " " + result.unit;
      }

      update();
      hint.textContent =
        "Formel wählen, beide Werte eintragen — das Ergebnis erscheint sofort. " +
        "Dezimaltrennzeichen: Komma oder Punkt.";
    }

    select.addEventListener("change", render);
    render();
  }

  function init() {
    document.querySelectorAll('[data-tool="elektrotechnik-rechner"]').forEach(buildTool);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
