/* filter.js — AP1/AP2-Filter fuer die Modulliste auf index.html.
   Optik/Aufbau analog theme.js (Button + injiziertes Dropdown-Menue,
   selbst in .site-header__actions eingehaengt). Single-Select mit genau
   drei sich gegenseitig ausschliessenden Zustaenden: "alle", "ap1", "ap2"
   (role="menuitemradio", wie beim Theme-Menue — anders als die fruehere
   Checkbox-Variante mit Vereinigungslogik). Standard beim Laden: "alle".

   Existiert nur auf Seiten mit #module-list (aktuell nur index.html) —
   auf Einheiten-Seiten gibt es keine Modulliste zum Filtern, daher baut
   sich das Skript dort gar nicht erst auf. Kein CDN, kein Framework,
   Key-Praefix "fisi:" wie Theme/Fortschritt (siehe quiz-engine.js). */
(function () {
  "use strict";

  var LS_KEY = "fisi:filter";
  var VALUES = ["alle", "ap1", "ap2"];

  function getStored() {
    try {
      var raw = localStorage.getItem(LS_KEY);
      if (!raw) return "alle";
      // Altformat (JSON-Array ["ap1","ap2"] o.ae. aus der frueheren
      // Checkbox-Variante) migrieren: genau ein gueltiger Wert -> uebernehmen,
      // sonst (leer oder beide) -> "alle".
      if (raw.charAt(0) === "[") {
        try {
          var arr = JSON.parse(raw);
          if (Array.isArray(arr) && arr.length === 1 && VALUES.indexOf(arr[0]) !== -1) {
            return arr[0];
          }
        } catch (e) { /* fall through zu "alle" */ }
        return "alle";
      }
      return VALUES.indexOf(raw) !== -1 ? raw : "alle";
    } catch (e) { return "alle"; }
  }
  function setStored(value) {
    try { localStorage.setItem(LS_KEY, value); } catch (e) { /* Storage gesperrt/voll: ignorieren */ }
  }

  var active = getStored();
  var btn, menu, items = [];

  // Icon statt Textlabel auf dem Button (Design-Fix: runder Icon-Button
  // statt Textpille "Filter: Alle"), analog theme.js. Trichter-Symbol,
  // currentColor, kein Hex-Wert. Selbst verfasstes Markup, kein
  // Fremd-Fetch (vgl. Kommentar in theme.js).
  var ICON_SVG = '<svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">' +
    '<path d="M3 4h14l-5.5 6.5v4.5l-3 1.5v-6z" fill="none" stroke="currentColor" ' +
    'stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round"/></svg>';
  function icon(svg) {
    var span = document.createElement("span");
    span.className = "icon-btn__icon";
    span.innerHTML = svg;
    return span;
  }

  function labelFor(value) {
    return value === "alle" ? "Alle" : value.toUpperCase();
  }

  function applyFilter() {
    var list = document.getElementById("module-list");
    if (!list) return;
    var cards = list.querySelectorAll(".module-card");
    for (var i = 0; i < cards.length; i++) {
      var card = cards[i];
      var visibleCount = 0;
      var unitEls = card.querySelectorAll(".module-card__unit");
      for (var j = 0; j < unitEls.length; j++) {
        var li = unitEls[j];
        var exams = (li.dataset.exams || "").split(",").filter(Boolean);
        var match = active === "alle" || exams.indexOf(active) !== -1;
        li.hidden = !match;
        if (match) visibleCount++;
      }
      card.hidden = active !== "alle" && visibleCount === 0;
    }
  }

  function updateUI() {
    if (!btn) return;
    // Icon bleibt statisch (in buildUI() eingehaengt) -- hier nur noch
    // Barrierefreiheits-/Hover-Text (Button ist reiner Icon-Button, siehe
    // CONVENTIONS §15d).
    var label = "Filter: " + labelFor(active);
    btn.setAttribute("aria-label", label + " (Menü öffnen)");
    btn.title = label;
    items.forEach(function (item) {
      var on = item.dataset.value === active;
      item.setAttribute("aria-checked", on ? "true" : "false");
      item.classList.toggle("is-active", on);
    });
  }

  // Nur auf schmalen Screens ist .filter-switcher__menu per CSS auf
  // position:fixed umgestellt (siehe CONVENTIONS §15d, analog
  // positionResults() in search.js und positionMenu() in theme.js).
  function positionMenu() {
    if (menu.hidden) return;
    if (getComputedStyle(menu).position !== "fixed") {
      menu.style.top = "";
      menu.style.right = "";
      menu.style.left = "";
      menu.style.maxHeight = "";
      return;
    }
    var r = btn.getBoundingClientRect();
    var top = Math.round(r.bottom + 8);
    var right = Math.max(8, Math.round(window.innerWidth - r.right));
    menu.style.top = top + "px";
    menu.style.right = right + "px";
    menu.style.left = "auto";
    menu.style.maxHeight = "calc(100vh - " + top + "px - 0.5rem)";
    if (menu.getBoundingClientRect().left < 8) {
      menu.style.right = "auto";
      menu.style.left = "8px";
    }
  }

  function openMenu() {
    menu.hidden = false;
    btn.setAttribute("aria-expanded", "true");
    positionMenu();
  }
  function closeMenu() {
    menu.hidden = true;
    btn.setAttribute("aria-expanded", "false");
  }

  function selectValue(value) {
    active = value;
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
    btn.className = "filter-switcher__btn icon-btn";
    btn.setAttribute("aria-haspopup", "menu");
    btn.setAttribute("aria-expanded", "false");
    btn.appendChild(icon(ICON_SVG));

    menu = document.createElement("ul");
    menu.className = "filter-switcher__menu";
    menu.setAttribute("role", "menu");
    menu.setAttribute("aria-labelledby", "filter-switcher-btn");
    menu.hidden = true;

    function addItem(value, text) {
      var li = document.createElement("li");
      li.setAttribute("role", "none");

      var item = document.createElement("button");
      item.type = "button";
      item.setAttribute("role", "menuitemradio");
      item.setAttribute("aria-checked", "false");
      item.className = "filter-switcher__item";
      item.textContent = text;
      item.dataset.value = value;
      item.addEventListener("click", function () {
        selectValue(value);
        closeMenu();
        btn.focus();
      });

      li.appendChild(item);
      menu.appendChild(li);
      items.push(item);
    }

    // "Alle" steht oben, durch einen Trenner von AP1/AP2 abgesetzt — alle
    // drei sind aber ein einziges menuitemradio-Set (genau ein aktiver Wert).
    addItem("alle", "Alle");

    var sep = document.createElement("li");
    sep.setAttribute("role", "separator");
    sep.className = "filter-switcher__sep";
    menu.appendChild(sep);

    addItem("ap1", "AP1");
    addItem("ap2", "AP2");

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
    window.addEventListener("resize", positionMenu);

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
