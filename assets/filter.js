/* filter.js — AP1/AP2-Filter fuer die Modulliste auf index.html.
   Optik/Aufbau analog theme.js (Button + injiziertes Dropdown-Menue,
   selbst in .site-header__actions eingehaengt). Anders als theme.js sind
   die Menuepunkte Checkboxen: AP1 und AP2 sind unabhaengig voneinander
   an-/abwaehlbar, Treffer = Einheit hat mindestens eine der aktiven
   Pruefungsteil-Markierungen (Vereinigung, keine Schnittmenge). Keine
   Auswahl = alles sichtbar.

   Existiert nur auf Seiten mit #module-list (aktuell nur index.html) —
   auf Einheiten-Seiten gibt es keine Modulliste zum Filtern, daher baut
   sich das Skript dort gar nicht erst auf. Kein CDN, kein Framework,
   Key-Praefix "fisi:" wie Theme/Fortschritt (siehe quiz-engine.js). */
(function () {
  "use strict";

  var LS_KEY = "fisi:filter";
  var EXAMS = ["ap1", "ap2"];

  function getStored() {
    try {
      var raw = localStorage.getItem(LS_KEY);
      if (!raw) return [];
      var arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr.filter(function (v) { return EXAMS.indexOf(v) !== -1; }) : [];
    } catch (e) { return []; }
  }
  function setStored(arr) {
    try { localStorage.setItem(LS_KEY, JSON.stringify(arr)); } catch (e) { /* Storage gesperrt/voll: ignorieren */ }
  }

  var active = getStored();
  var btn, menu, resetItem, items = [];

  function labelFor(sel) {
    if (sel.length === 0) return "Alle";
    return sel.map(function (v) { return v.toUpperCase(); }).join("+");
  }

  function applyFilter() {
    var list = document.getElementById("module-list");
    if (!list) return;
    var anyFilter = active.length > 0;
    var cards = list.querySelectorAll(".module-card");
    for (var i = 0; i < cards.length; i++) {
      var card = cards[i];
      var visibleCount = 0;
      var unitEls = card.querySelectorAll(".module-card__unit");
      for (var j = 0; j < unitEls.length; j++) {
        var li = unitEls[j];
        var exams = (li.dataset.exams || "").split(",").filter(Boolean);
        var match = !anyFilter || exams.some(function (e) { return active.indexOf(e) !== -1; });
        li.hidden = !match;
        if (match) visibleCount++;
      }
      card.hidden = anyFilter && visibleCount === 0;
    }
  }

  function updateUI() {
    if (!btn) return;
    btn.textContent = "Filter: " + labelFor(active);
    var allActive = active.length === 0;
    resetItem.setAttribute("aria-checked", allActive ? "true" : "false");
    resetItem.classList.toggle("is-active", allActive);
    items.forEach(function (item) {
      if (item === resetItem) return; // hat eigene Checked-Logik oben (kein dataset.exam)
      var on = active.indexOf(item.dataset.exam) !== -1;
      item.setAttribute("aria-checked", on ? "true" : "false");
      item.classList.toggle("is-active", on);
    });
  }

  function openMenu() {
    menu.hidden = false;
    btn.setAttribute("aria-expanded", "true");
  }
  function closeMenu() {
    menu.hidden = true;
    btn.setAttribute("aria-expanded", "false");
  }

  function toggleExam(value) {
    var idx = active.indexOf(value);
    if (idx === -1) active.push(value); else active.splice(idx, 1);
    setStored(active);
    updateUI();
    applyFilter();
  }

  function resetExams() {
    active = [];
    setStored(active);
    updateUI();
    applyFilter();
  }

  function buildUI() {
    var list = document.getElementById("module-list");
    if (!list) return; // Filter ergibt nur auf der Modulübersicht Sinn.
    if (document.getElementById("filter-switcher-btn")) return; // Schutz gegen doppelte Injektion

    var wrap = document.createElement("div");
    wrap.className = "filter-switcher";

    btn = document.createElement("button");
    btn.type = "button";
    btn.id = "filter-switcher-btn";
    btn.className = "filter-switcher__btn";
    btn.setAttribute("aria-haspopup", "menu");
    btn.setAttribute("aria-expanded", "false");

    menu = document.createElement("ul");
    menu.className = "filter-switcher__menu";
    menu.setAttribute("role", "menu");
    menu.setAttribute("aria-labelledby", "filter-switcher-btn");
    menu.hidden = true;

    // "Alle" schaltet den Filter explizit aus (active = []), statt dass man
    // AP1/AP2 einzeln manuell abwaehlen muss — steht oben, durch einen
    // Trenner von den beiden Checkboxen abgesetzt (analog SPECIAL_START_INDEX
    // in theme.js).
    var resetLi = document.createElement("li");
    resetLi.setAttribute("role", "none");
    resetItem = document.createElement("button");
    resetItem.type = "button";
    resetItem.setAttribute("role", "menuitemradio");
    resetItem.setAttribute("aria-checked", "false");
    resetItem.className = "filter-switcher__item";
    resetItem.textContent = "Alle";
    resetItem.addEventListener("click", function () {
      resetExams();
      closeMenu();
      btn.focus();
    });
    resetLi.appendChild(resetItem);
    menu.appendChild(resetLi);
    items.push(resetItem);

    var sep = document.createElement("li");
    sep.setAttribute("role", "separator");
    sep.className = "filter-switcher__sep";
    menu.appendChild(sep);

    EXAMS.forEach(function (value) {
      var li = document.createElement("li");
      li.setAttribute("role", "none");

      var item = document.createElement("button");
      item.type = "button";
      item.setAttribute("role", "menuitemcheckbox");
      item.setAttribute("aria-checked", "false");
      item.className = "filter-switcher__item";
      item.textContent = value.toUpperCase();
      item.dataset.exam = value;
      item.addEventListener("click", function () { toggleExam(value); });

      li.appendChild(item);
      menu.appendChild(li);
      items.push(item);
    });

    wrap.appendChild(btn);
    wrap.appendChild(menu);
    // Sitzt normalerweise neben Suche + Theme-Button in derselben Kopfzeile
    // (.site-header__actions, von search.js angelegt). Fallback auf fixierte
    // Ecke oben rechts, falls dieser Container fehlt — analog theme.js.
    var actions = document.querySelector(".site-header__actions");
    (actions || document.body).appendChild(wrap);

    function toggleMenu() {
      if (menu.hidden) { openMenu(); } else { closeMenu(); }
    }

    btn.addEventListener("click", toggleMenu);
    btn.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleMenu();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        openMenu();
        items[0].focus();
      } else if (e.key === "Escape") {
        closeMenu();
      }
    });
    menu.addEventListener("keydown", function (e) {
      var idx = items.indexOf(document.activeElement);
      if (e.key === "Escape") {
        e.preventDefault();
        closeMenu();
        btn.focus();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        items[(idx + 1) % items.length].focus();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        items[(idx - 1 + items.length) % items.length].focus();
      } else if (e.key === "Tab") {
        closeMenu();
      }
    });
    document.addEventListener("click", function (e) {
      if (!wrap.contains(e.target)) closeMenu();
    });

    updateUI();

    // Die Modulliste wird asynchron nach dem manifest.json-Fetch neu
    // gerendert (list.innerHTML = "" + appendChild pro Modul) — ein
    // MutationObserver wendet den Filter nach jedem Rendering erneut an,
    // unabhaengig von der Ladereihenfolge von filter.js vs. dem
    // Inline-Rendering-Skript in index.html.
    var observer = new MutationObserver(function () { applyFilter(); });
    observer.observe(list, { childList: true });
    applyFilter();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", buildUI);
  } else {
    buildUI();
  }
})();
