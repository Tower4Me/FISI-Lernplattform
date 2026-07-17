/* ==========================================================================
   raid-rechner.js — berechnet Nutzkapazität und Ausfalltoleranz für
   RAID 0/1/5/6/10 aus Plattenanzahl und Kapazität je Platte.

   Einbindung: <div class="tool" data-tool="raid-rechner"></div>
   ========================================================================== */

(function () {
  "use strict";

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

  function calc(level, n, c) {
    if (level === "0") {
      if (n < 2) return { error: "RAID 0 braucht mindestens 2 Platten." };
      return { usable: n * c, tolerance: "keine (riskanter als eine einzelne Platte)" };
    }
    if (level === "1") {
      if (n < 2) return { error: "RAID 1 braucht mindestens 2 Platten." };
      return { usable: c, tolerance: "1 Platte (Spiegelung)" };
    }
    if (level === "5") {
      if (n < 3) return { error: "RAID 5 braucht mindestens 3 Platten." };
      return { usable: (n - 1) * c, tolerance: "1 Platte" };
    }
    if (level === "6") {
      if (n < 4) return { error: "RAID 6 braucht mindestens 4 Platten." };
      return { usable: (n - 2) * c, tolerance: "2 Platten" };
    }
    if (level === "10") {
      if (n < 4 || n % 2 !== 0) {
        return { error: "RAID 10 braucht eine gerade Anzahl Platten (mindestens 4)." };
      }
      return { usable: (n / 2) * c, tolerance: "1 Platte je Spiegelpaar" };
    }
    return { error: "Unbekanntes RAID-Level." };
  }

  function buildTool(container) {
    container.innerHTML = "";

    var row1 = el("div", "tool__row");

    var nWrap = el("div");
    nWrap.style.flex = "1";
    nWrap.style.minWidth = "140px";
    nWrap.appendChild(el("label", "tool__label", "Anzahl Platten"));
    var nInput = el("input", "tool__input");
    nInput.type = "number";
    nInput.min = "2";
    nInput.max = "24";
    nInput.value = "4";
    nWrap.appendChild(nInput);

    var cWrap = el("div");
    cWrap.style.flex = "1";
    cWrap.style.minWidth = "140px";
    cWrap.appendChild(el("label", "tool__label", "Kapazität je Platte (TB)"));
    var cInput = el("input", "tool__input");
    cInput.type = "number";
    cInput.min = "1";
    cInput.step = "0.5";
    cInput.value = "4";
    cWrap.appendChild(cInput);

    row1.appendChild(nWrap);
    row1.appendChild(cWrap);

    var levelWrap = el("div");
    levelWrap.appendChild(el("label", "tool__label", "RAID-Level"));
    var levelSelect = el("select", "tool__select");
    [
      ["0", "RAID 0 (Striping)"],
      ["1", "RAID 1 (Mirroring)"],
      ["5", "RAID 5 (Striping + Parität)"],
      ["6", "RAID 6 (Striping + doppelte Parität)"],
      ["10", "RAID 10 (Spiegel + Striping)"]
    ].forEach(function (pair) {
      var opt = el("option", null, pair[1]);
      opt.value = pair[0];
      levelSelect.appendChild(opt);
    });
    levelSelect.value = "5";
    levelWrap.appendChild(levelSelect);

    var output = el("div", "tool__output");

    container.appendChild(row1);
    container.appendChild(levelWrap);
    container.appendChild(output);

    function update() {
      var n = parseInt(nInput.value, 10);
      var c = parseFloat(cInput.value.replace(",", "."));
      if (isNaN(n) || isNaN(c) || n < 1 || c <= 0) {
        output.textContent = "Werte eingeben …";
        return;
      }
      var result = calc(levelSelect.value, n, c);
      if (result.error) {
        output.textContent = result.error;
        return;
      }
      output.textContent =
        "Nutzkapazität: " + formatNumber(result.usable) + " TB · " +
        "Ausfalltoleranz: " + result.tolerance;
    }

    nInput.addEventListener("input", update);
    cInput.addEventListener("input", update);
    levelSelect.addEventListener("change", update);
    update();
  }

  function init() {
    document.querySelectorAll('[data-tool="raid-rechner"]').forEach(buildTool);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
