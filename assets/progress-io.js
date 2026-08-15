/* ==========================================================================
   progress-io.js — Export/Import des Fortschritts (localStorage-Key
   "fisi:progress") als JSON-Datei. Kein Sync, kein Server: reiner
   Datei-Download bzw. -Upload durch die Nutzerin/den Nutzer selbst, z. B.
   um zwischen zwei Browsern/Geraeten zu wechseln oder ein Backup zu haben.

   Existiert nur auf index.html (Selbst-Erkennung ueber #module-list,
   analog filter.js/merksaetze.js). UI: eigener Zahnrad-Icon-Button
   (".progress-switcher", Optik/Aufbau 1:1 an theme.js/filter.js
   angeglichen -- Button + selbst injiziertes Dropdown-Menue, hier mit
   zwei Aktions-Eintraegen statt Radios) statt zwei einzelner Pillen.
   Sitzt direkt neben dem Farbe-Button in der von merksaetze.js gebauten
   Flex-Toolbar ".site-header__buttons" (siehe CONVENTIONS §15d), mit
   Fallback auf ".site-header__actions" bzw. document.body, falls diese
   Toolbar aus irgendeinem Grund fehlt.

   Zum "zaehlt_nicht"-Feld aus data/manifest.json (kennzeichnet Einheiten
   des Moduls "Pruefung", die nie als "erledigt" zaehlen, siehe
   index.html): Dieses Feld lebt ausschliesslich im Manifest und wird beim
   Rendern der Modulliste ausgewertet -- es hat keine Entsprechung in
   "fisi:progress" selbst, weil die Pruefungssimulator-Seiten kein
   quiz-engine.js einbinden und daher nie einen Eintrag dort erzeugen.
   Export/Import behandeln "fisi:progress" deshalb bewusst als
   undurchsichtige Einheit-zu-Fortschritt-Abbildung, ohne nach
   "zaehlt_nicht" zu filtern -- die bestehende Zaehllogik in index.html
   greift beim naechsten Rendern ohnehin unveraendert.

   Rein clientseitig: Blob + <a download> fuer den Export, FileReader fuer
   den Import. Kein CDN, kein Framework. */
(function () {
  "use strict";

  var LS_KEY = "fisi:progress";

  // Zahnrad-Icon, currentColor, kein Hex-Wert -- selbst verfasstes
  // Markup, kein Fremd-Fetch (vgl. Kommentar in theme.js). V1 (Ring +
  // Speichen-Strahlen) sah bei 16px Buttongroesse wie eine Sonne statt
  // einem Zahnrad aus -- ersetzt durch eine klassische Zahnrad-Kontur
  // (Kreis-Nabe + gezackter Aussenring als ein zusammenhaengender Pfad),
  // bei realer Buttongroesse gegen zwei Alternativ-Icons visuell geprueft.
  var ICON_SVG = '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" ' +
    'fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z"/>' +
    '<path d="M19.4 13.5c.1-.5.1-1 0-1.5l1.7-1.3-1.5-2.6-2 .6a6.6 6.6 0 0 0-1.3-.8l-.3-2.1H12.9l-.3 2.1c-.5.2-.9.4-1.3.8l-2-.6-1.5 2.6 1.7 1.3c-.1.5-.1 1 0 1.5l-1.7 1.3 1.5 2.6 2-.6c.4.3.8.6 1.3.8l.3 2.1h2.9l.3-2.1c.5-.2.9-.4 1.3-.8l2 .6 1.5-2.6z"/>' +
    '</svg>';
  function icon(svg) {
    var span = document.createElement("span");
    span.className = "icon-btn__icon";
    span.innerHTML = svg;
    return span;
  }

  var btn, menu, items = [];

  // Nur auf schmalen Screens ist .filter-switcher__menu per CSS auf
  // position:fixed umgestellt (siehe CONVENTIONS §15d, analog
  // positionResults() in search.js und positionMenu() in theme.js/filter.js).
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

  function buildUI() {
    if (!document.getElementById("module-list")) return; // nur index.html
    if (document.getElementById("progress-menu-btn")) return; // Idempotenz-Schutz

    var wrap = document.createElement("div");
    wrap.className = "progress-switcher";

    btn = document.createElement("button");
    btn.type = "button";
    btn.id = "progress-menu-btn";
    btn.className = "filter-switcher__btn icon-btn";
    btn.setAttribute("aria-haspopup", "menu");
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-label", "Fortschritt: exportieren oder importieren (Menü öffnen)");
    btn.title = "Fortschritt exportieren/importieren";
    btn.appendChild(icon(ICON_SVG));

    menu = document.createElement("ul");
    menu.className = "filter-switcher__menu";
    menu.setAttribute("role", "menu");
    menu.setAttribute("aria-labelledby", "progress-menu-btn");
    menu.hidden = true;

    var exportItem = addItem("Fortschritt exportieren");
    var importItem = addItem("Fortschritt importieren");

    function addItem(text) {
      var li = document.createElement("li");
      li.setAttribute("role", "none");
      var item = document.createElement("button");
      item.type = "button";
      item.setAttribute("role", "menuitem");
      item.className = "filter-switcher__item";
      item.textContent = text;
      li.appendChild(item);
      menu.appendChild(li);
      items.push(item);
      return item;
    }

    var fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "application/json";
    fileInput.hidden = true;

    var status = document.createElement("p");
    status.id = "progress-io-status";
    status.className = "progress-io__status muted";
    status.setAttribute("role", "status");
    status.hidden = true;

    function showStatus(text) {
      status.textContent = text;
      status.hidden = false;
    }

    function pad(n) { return n < 10 ? "0" + n : String(n); }

    exportItem.addEventListener("click", function () {
      closeMenu();
      btn.focus();

      var raw = localStorage.getItem(LS_KEY) || "{}";
      var pretty;
      try {
        pretty = JSON.stringify(JSON.parse(raw), null, 2);
      } catch (e) {
        pretty = raw; // sollte nie vorkommen, aber lieber rohen Inhalt exportieren als abbrechen
      }
      var blob = new Blob([pretty], { type: "application/json" });
      var url = URL.createObjectURL(blob);
      var now = new Date();
      var filename = "fisi-fortschritt-" + now.getFullYear() + "-" +
        pad(now.getMonth() + 1) + "-" + pad(now.getDate()) + ".json";

      var a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      showStatus("Fortschritt als „" + filename + "“ heruntergeladen.");
    });

    importItem.addEventListener("click", function () {
      closeMenu();
      fileInput.click();
    });

    fileInput.addEventListener("change", function () {
      var file = fileInput.files && fileInput.files[0];
      if (!file) return;

      var reader = new FileReader();
      reader.onload = function () {
        var imported;
        try {
          imported = JSON.parse(String(reader.result));
        } catch (e) {
          showStatus("Import fehlgeschlagen: Datei ist kein gültiges JSON.");
          fileInput.value = "";
          return;
        }
        if (typeof imported !== "object" || imported === null || Array.isArray(imported)) {
          showStatus("Import fehlgeschlagen: Datei entspricht nicht dem erwarteten Format.");
          fileInput.value = "";
          return;
        }

        var count = Object.keys(imported).length;
        var proceed = window.confirm(
          count + " Einheit(en) aus dieser Datei einlesen? Bereits vorhandener " +
          "Fortschritt zu denselben Einheiten wird dabei durch den Stand aus der " +
          "Datei ersetzt, Fortschritt zu anderen Einheiten bleibt erhalten."
        );
        fileInput.value = "";
        if (!proceed) return;

        var current;
        try {
          current = JSON.parse(localStorage.getItem(LS_KEY)) || {};
        } catch (e) {
          current = {};
        }
        var merged = Object.assign({}, current, imported);

        try {
          localStorage.setItem(LS_KEY, JSON.stringify(merged));
        } catch (e) {
          showStatus("Import fehlgeschlagen: localStorage nicht verfügbar.");
          return;
        }
        window.location.reload();
      };
      reader.readAsText(file);
    });

    wrap.appendChild(btn);
    wrap.appendChild(menu);
    wrap.appendChild(fileInput);

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

    // Direkt neben dem Farbe-Button einhaengen (nicht ans Ende der
    // Toolbar), analog zur Platzierung im Screenshot-Wunsch: Farbe |
    // Zahnrad | Filter | Drucken. .site-header__buttons kommt von
    // merksaetze.js, das vor diesem Skript laedt (Ladereihenfolge
    // theme.js -> search.js -> filter.js -> merksaetze.js ->
    // progress-io.js), .theme-switcher existiert an dieser Stelle also
    // garantiert bereits.
    var toolbar = document.querySelector(".site-header__buttons");
    var themeSwitcher = toolbar && toolbar.querySelector(".theme-switcher");
    var actions = document.querySelector(".site-header__actions");
    var target = toolbar || actions || document.body;

    if (toolbar && themeSwitcher) {
      toolbar.insertBefore(wrap, themeSwitcher.nextSibling);
    } else {
      target.appendChild(wrap);
    }
    target.appendChild(status);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", buildUI);
  } else {
    buildUI();
  }
})();
