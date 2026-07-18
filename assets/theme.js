/* theme.js — vier Themes: white, dark, creme, terminal.
   Verantwortlich fuer: barrierefreies Umschalt-Menue, Persistenz (localStorage),
   Reaktion auf System-Praeferenz solange keine manuelle Wahl gespeichert ist.

   FOUC-Vermeidung passiert NICHT hier, sondern durch ein winziges Inline-
   Snippet im <head> jeder Seite (vor dem style.css-Link) — das setzt
   data-theme sofort. Dieses Skript synchronisiert danach nur noch die UI
   und kann daher gefahrlos am Seitenende/normal geladen werden.

   Kein CDN, keine Abhaengigkeiten. Key-Praefix "fisi:" wie beim Fortschritt
   in quiz-engine.js. */
(function () {
  "use strict";

  var LS_KEY = "fisi:theme";
  var THEMES = [
    { value: "white", label: "White Mode" },
    { value: "dark", label: "Dark Mode" },
    { value: "creme", label: "Creme" },
    { value: "terminal", label: "Terminal" }
  ];
  var SPECIAL_START_INDEX = 2; // ab hier: "Spezialdesigns" (Creme/Terminal), Trenner davor

  var root = document.documentElement;
  var mql = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;

  function getStored() {
    try { return localStorage.getItem(LS_KEY); } catch (e) { return null; }
  }
  function setStored(value) {
    try { localStorage.setItem(LS_KEY, value); } catch (e) { /* Storage gesperrt/voll: ignorieren */ }
  }
  function systemTheme() {
    return (mql && mql.matches) ? "dark" : "white";
  }
  function labelFor(value) {
    for (var i = 0; i < THEMES.length; i++) {
      if (THEMES[i].value === value) return THEMES[i].label;
    }
    return value;
  }

  var btn, menu, items = [];

  function applyTheme(value) {
    root.setAttribute("data-theme", value);
    updateUI(value);
  }

  function updateUI(value) {
    if (!btn) return;
    btn.textContent = "Theme: " + labelFor(value);
    items.forEach(function (item) {
      var active = item.dataset.theme === value;
      item.setAttribute("aria-checked", active ? "true" : "false");
      item.classList.toggle("is-active", active);
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

  function buildUI() {
    var wrap = document.createElement("div");
    wrap.className = "theme-switcher";

    btn = document.createElement("button");
    btn.type = "button";
    btn.id = "theme-switcher-btn";
    btn.className = "theme-switcher__btn";
    btn.setAttribute("aria-haspopup", "menu");
    btn.setAttribute("aria-expanded", "false");

    menu = document.createElement("ul");
    menu.className = "theme-switcher__menu";
    menu.setAttribute("role", "menu");
    menu.setAttribute("aria-labelledby", "theme-switcher-btn");
    menu.hidden = true;

    THEMES.forEach(function (t, idx) {
      if (idx === SPECIAL_START_INDEX) {
        var sep = document.createElement("li");
        sep.setAttribute("role", "separator");
        sep.className = "theme-switcher__sep";
        menu.appendChild(sep);
      }
      var li = document.createElement("li");
      li.setAttribute("role", "none");

      var item = document.createElement("button");
      item.type = "button";
      item.setAttribute("role", "menuitemradio");
      item.setAttribute("aria-checked", "false");
      item.className = "theme-switcher__item";
      item.textContent = t.label;
      item.dataset.theme = t.value;
      item.addEventListener("click", function () {
        setStored(t.value);
        applyTheme(t.value);
        closeMenu();
        btn.focus();
      });

      li.appendChild(item);
      menu.appendChild(li);
      items.push(item);
    });

    wrap.appendChild(btn);
    wrap.appendChild(menu);
    // Sitzt normalerweise direkt neben der Suche (site-search.js legt dafuer
    // .site-header__actions an, rechtsbuendig in derselben Kopfzeile wie der
    // Breadcrumb). Fallback auf die alte fixierte Ecke oben rechts, falls
    // dieser Container aus irgendeinem Grund fehlt (z.B. search.js entfernt).
    var actions = document.querySelector(".site-header__actions");
    (actions || document.body).appendChild(wrap);

    function toggleMenu() {
      if (menu.hidden) { openMenu(); } else { closeMenu(); }
    }

    btn.addEventListener("click", toggleMenu);
    btn.addEventListener("keydown", function (e) {
      // Enter/Space explizit selbst behandeln (mit preventDefault) statt uns
      // auf die native Klick-Synthese des Browsers zu verlassen: sonst kann
      // dieselbe Eingabe sowohl hier als auch als synthetischer "click" auf
      // dem Button ankommen und das Menu doppelt togglen (auf UND wieder zu).
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

    // Aktuellen Stand (vom Inline-Snippet gesetzt) in der UI spiegeln.
    updateUI(root.getAttribute("data-theme") || getStored() || systemTheme());
  }

  // System-Praeferenz nur solange befolgen, wie keine manuelle Wahl vorliegt.
  if (mql) {
    var onSystemChange = function (e) {
      if (getStored()) return; // manuelle Wahl hat Vorrang
      applyTheme(e.matches ? "dark" : "white");
    };
    if (mql.addEventListener) mql.addEventListener("change", onSystemChange);
    else if (mql.addListener) mql.addListener(onSystemChange); // Safari < 14 Fallback
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", buildUI);
  } else {
    buildUI();
  }
})();
