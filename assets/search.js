/* ==========================================================================
   search.js — Suche ueber Lerneinheiten-Titel (kein Volltext).
   Injiziert das komplette Such-Markup selbst (analog theme.js). Einheiten
   binden nur dieses Skript ein, kein such-spezifisches HTML noetig.

   Datenquelle: data/manifest.json (Unit-Name + Modul-Name je Einheit).
   Optionales Feld pro Unit: "aliases" (Array alternativer Suchbegriffe,
   z. B. "Teilkostenrechnung" fuer die Einheit "Zuschlagskalkulation & BAB")
   -- durchsucht, aber nie angezeigt: Treffer zeigen immer den echten Titel.
   Ruhezustand: Eingabefeld unauffaellig, KEINE Treffer im Leerzustand.
   Erst bei Eingabe wird gefiltert; Ergebnisse nach Relevanz sortiert
   (exakt > Anfangstreffer > Teiltreffer), umlaut- und case-tolerant.

   Kein CDN, keine Abhaengigkeiten. Kein eigener localStorage-Key noetig.
   ========================================================================== */
(function () {
  "use strict";

  // Idempotenz-Schutz: falls dieses Skript je zweimal auf derselben Seite
  // ausgefuehrt wuerde (doppeltes Script-Tag, Speculative-Prerendering o.ae.),
  // sonst wuerden doppelte IDs (#site-search-input) entstehen.
  if (document.getElementById("site-search-input")) return;

  var MAX_RESULTS = 20;

  /* -------------------------------------------------------- Pfad-Basis --- */
  /* Kommt von manifest-loader.js (muss als erstes Skript vor diesem hier
     eingebunden sein) -- einmal pro Seite berechnet statt in jedem
     manifest-ladenden Skript einzeln. */
  var prefix = window.FISIManifest.prefix;

  var isIndex = !!document.getElementById("module-list");

  /* --------------------------------------------------- Umlaut-Toleranz --- */
  function normalize(str) {
    return String(str)
      .toLowerCase()
      .replace(/ä/g, "ae")
      .replace(/ö/g, "oe")
      .replace(/ü/g, "ue")
      .replace(/ß/g, "ss");
  }

  /* ------------------------------------------------------- Daten laden --- */
  var entries = null; // erst nach Laden von manifest.json gefuellt
  var loadPromise = window.FISIManifest.load()
    .then(function (data) {
      var list = [];
      var order = 0;
      (data.modules || []).forEach(function (mod) {
        (mod.units || []).forEach(function (u) {
          var relHref = "module/" + mod.slug + "/" + u.slug + ".html";
          list.push({
            name: u.name,
            normName: normalize(u.name),
            normAliases: (u.aliases || []).map(normalize),
            moduleName: mod.name,
            relHref: relHref,
            href: prefix + relHref,
            order: order++
          });
        });
      });
      entries = list;
      return list;
    })
    .catch(function () {
      entries = [];
      return entries;
    });

  /* --------------------------------------------- Inhaltsindex (lazy) --- */
  /* data/search-index.json (von tools/build_search_index.py erzeugt) haelt
     je Einheit die <h3>-Ueberschriften plus den Merksatz-Text -- fuer
     Treffer, die im Titel/Alias nicht auftauchen, aber im Inhalt stehen
     (z. B. "DPI" fuer die Einheit "Drucker"). Bewusst erst beim ersten
     Eingabe-Event geladen (nicht beim Skriptstart wie das Manifest), da
     das die meisten Seitenaufrufe ohne jede Sucheingabe betrifft -- das
     Promise wird danach gecacht, laedt also nur einmal pro Seitenaufruf. */
  var contentIndex = null; // relHref -> normalisierter Volltext
  var contentIndexPromise = null;
  function loadContentIndex() {
    if (!contentIndexPromise) {
      contentIndexPromise = fetch(prefix + "data/search-index.json")
        .then(function (r) {
          if (!r.ok) throw new Error("HTTP " + r.status);
          return r.json();
        })
        .then(function (data) {
          var map = {};
          Object.keys(data).forEach(function (relHref) {
            var e = data[relHref];
            var text = (e.headings || []).join(" ") + " " + (e.merksatz || "");
            map[relHref] = normalize(text);
          });
          contentIndex = map;
          return map;
        })
        .catch(function () {
          contentIndex = {};
          return contentIndex;
        });
    }
    return contentIndexPromise;
  }

  /* --------------------------------------------------------- Relevanz --- */
  /* Titel-Treffer koennen exakt sein (score 0). Alias-Treffer (z. B.
     "Teilkostenrechnung" -> "Zuschlagskalkulation & BAB") sind nie exakt,
     da der Alias nicht der sichtbare Titel ist -- angezeigt wird immer
     entry.name, der Alias dient nur der Auffindbarkeit. Inhaltstreffer
     (score 3, aus dem Inhaltsindex) sind die unterste Stufe: nur relevant,
     wenn weder Titel noch Alias passen. */
  function matchScore(e, q) {
    var idx = e.normName.indexOf(q);
    if (idx !== -1) return e.normName === q ? 0 : (idx === 0 ? 1 : 2);
    for (var i = 0; i < e.normAliases.length; i++) {
      var aliasIdx = e.normAliases[i].indexOf(q);
      if (aliasIdx !== -1) return aliasIdx === 0 ? 1 : 2;
    }
    if (contentIndex) {
      var body = contentIndex[e.relHref];
      if (body && body.indexOf(q) !== -1) return 3;
    }
    return -1;
  }

  function search(query) {
    var q = normalize(query);
    if (!q || !entries) return [];
    var matches = [];
    entries.forEach(function (e) {
      var score = matchScore(e, q);
      if (score === -1) return;
      matches.push({ entry: e, score: score });
    });
    matches.sort(function (a, b) {
      return a.score - b.score || a.entry.order - b.entry.order;
    });
    return matches.slice(0, MAX_RESULTS).map(function (m) { return m.entry; });
  }

  /* ------------------------------------------------------------- UI --- */
  var wrap = document.createElement("div");
  wrap.className = "site-search" + (isIndex ? " site-search--prominent" : " site-search--compact");

  var label = document.createElement("label");
  label.className = "visually-hidden";
  label.setAttribute("for", "site-search-input");
  label.textContent = "Suche nach Lerneinheiten";

  var input = document.createElement("input");
  input.type = "text";
  input.id = "site-search-input";
  input.className = "site-search__input";
  input.placeholder = isIndex ? "Suche nach Titel (z. B. „Subnetting“, „RAID“) …" : "Suche …";
  input.autocomplete = "off";
  input.setAttribute("role", "combobox");
  input.setAttribute("aria-autocomplete", "list");
  input.setAttribute("aria-expanded", "false");
  input.setAttribute("aria-controls", "site-search-listbox");
  input.setAttribute("aria-activedescendant", "");

  var listbox = document.createElement("ul");
  listbox.id = "site-search-listbox";
  listbox.className = "site-search__results";
  listbox.setAttribute("role", "listbox");
  listbox.hidden = true;

  wrap.appendChild(label);
  wrap.appendChild(input);
  wrap.appendChild(listbox);

  // Suche landet in derselben Kopfzeile wie der Breadcrumb (nicht unter
  // Titel/Fortschrittsbalken): Breadcrumb + Suche werden gemeinsam in eine
  // neue Flex-Zeile "site-header__top" verschoben. Die Suche steckt darin in
  // einem eigenen Wrapper "site-header__actions" — theme.js haengt den
  // Theme-Button dort direkt daneben ein (statt fixiert oben rechts), damit
  // beide rechtsbuendig nebeneinander sitzen. Rein zur Laufzeit per
  // DOM-Umbau, die Einheiten-HTML bleibt unangetastet.
  var header = document.querySelector(".site-header");
  if (header) {
    var breadcrumbs = header.querySelector(".breadcrumbs");
    var topRow = document.createElement("div");
    topRow.className = "site-header__top";
    if (breadcrumbs && breadcrumbs.parentNode === header) {
      header.insertBefore(topRow, breadcrumbs);
      topRow.appendChild(breadcrumbs);
    } else {
      header.insertBefore(topRow, header.firstChild);
    }
    var actions = document.createElement("div");
    actions.className = "site-header__actions";
    actions.appendChild(wrap);
    topRow.appendChild(actions);
  } else {
    document.body.appendChild(wrap);
  }

  /* --------------------------------------------------- Render/State --- */
  var currentResults = [];
  var activeIndex = -1;

  function optionId(i) { return "site-search-option-" + i; }

  function closeList() {
    listbox.hidden = true;
    input.setAttribute("aria-expanded", "false");
    input.setAttribute("aria-activedescendant", "");
    activeIndex = -1;
  }

  function setActive(i) {
    var options = listbox.querySelectorAll(".site-search__option");
    for (var j = 0; j < options.length; j++) {
      options[j].setAttribute("aria-selected", j === i ? "true" : "false");
      options[j].classList.toggle("is-active", j === i);
    }
    activeIndex = i;
    if (i >= 0 && options[i]) {
      input.setAttribute("aria-activedescendant", options[i].id);
      options[i].scrollIntoView({ block: "nearest" });
    } else {
      input.setAttribute("aria-activedescendant", "");
    }
  }

  function goTo(entry) {
    if (!entry) return;
    window.location.href = entry.href;
  }

  /* Nur auf schmalen Screens ist .site-search__results per CSS auf
     position:fixed umgestellt (Panel loest sich aus der schmalen
     Header-Spalte, siehe style.css). Dort setzen wir top/max-height hier
     aus der tatsaechlichen Position des Eingabefelds statt aus einem
     Fixwert -- der waere bei zweizeiligem Breadcrumb-Umbruch oder
     abweichender Kopfzeilenhoehe daneben. Auf breiten Screens bleibt das
     Panel absolut positioniert (CSS regelt top ueber calc(100% + ...)),
     dort wird nichts inline gesetzt. */
  function positionResults() {
    if (listbox.hidden) return;
    if (getComputedStyle(listbox).position !== "fixed") {
      listbox.style.top = "";
      listbox.style.maxHeight = "";
      return;
    }
    var top = Math.round(input.getBoundingClientRect().bottom + 8);
    listbox.style.top = top + "px";
    listbox.style.maxHeight = "calc(100vh - " + top + "px - 0.5rem)";
  }

  function renderResults(query) {
    listbox.innerHTML = "";
    currentResults = search(query);

    if (!currentResults.length) {
      var empty = document.createElement("li");
      empty.className = "site-search__empty";
      empty.setAttribute("role", "presentation");
      empty.textContent = "Keine Treffer";
      listbox.appendChild(empty);
    } else {
      currentResults.forEach(function (entry, i) {
        var li = document.createElement("li");
        li.id = optionId(i);
        li.className = "site-search__option";
        li.setAttribute("role", "option");
        li.setAttribute("aria-selected", "false");

        var name = document.createElement("span");
        name.className = "site-search__option-name";
        name.textContent = entry.name;

        var path = document.createElement("span");
        path.className = "site-search__option-path";
        path.textContent = entry.moduleName;

        li.appendChild(name);
        li.appendChild(path);
        li.addEventListener("click", function () { goTo(entry); });
        listbox.appendChild(li);
      });
    }

    listbox.hidden = false;
    positionResults();
    input.setAttribute("aria-expanded", "true");
    activeIndex = -1;
    input.setAttribute("aria-activedescendant", "");
  }

  // Wartet auf Manifest UND Inhaltsindex, dann erst rendern -- so hat
  // schon das allererste Ergebnis nach einer Eingabe Zugriff auf
  // Inhaltstreffer. loadContentIndex() startet den Fetch beim ersten
  // Aufruf hier (nicht beim Skriptstart), das Promise ist danach gecacht.
  function triggerSearch(q, onDone) {
    Promise.all([loadPromise, loadContentIndex()]).then(function () {
      renderResults(q);
      if (onDone) onDone();
    });
  }

  input.addEventListener("input", function () {
    var q = input.value.trim();
    if (!q) {
      listbox.innerHTML = "";
      closeList();
      return;
    }
    triggerSearch(q);
  });

  input.addEventListener("focus", function () {
    var q = input.value.trim();
    if (q) triggerSearch(q);
  });

  input.addEventListener("keydown", function (e) {
    if (listbox.hidden && e.key !== "ArrowDown") return;
    if (e.key === "ArrowDown") {
      if (listbox.hidden) {
        var q = input.value.trim();
        if (!q) return;
        e.preventDefault();
        triggerSearch(q, function () {
          if (currentResults.length) setActive(0);
        });
        return;
      }
      if (!currentResults.length) return;
      e.preventDefault();
      setActive(activeIndex + 1 >= currentResults.length ? 0 : activeIndex + 1);
    } else if (e.key === "ArrowUp") {
      if (!currentResults.length) return;
      e.preventDefault();
      setActive(activeIndex - 1 < 0 ? currentResults.length - 1 : activeIndex - 1);
    } else if (e.key === "Enter") {
      if (activeIndex >= 0 && currentResults[activeIndex]) {
        e.preventDefault();
        goTo(currentResults[activeIndex]);
      }
    } else if (e.key === "Escape") {
      closeList();
    }
  });

  // Verhindert, dass ein Klick in die Ergebnisliste zuerst den Blur des
  // Eingabefelds ausloest (Standard-Combobox-Muster: mousedown auf der
  // Liste abfangen, bevor der Browser den Fokus wechselt).
  listbox.addEventListener("mousedown", function (e) { e.preventDefault(); });

  input.addEventListener("blur", function () {
    // Kurzer Timeout: ein Klick auf eine Option darf nicht durch sofortiges
    // Schliessen der Liste verhindert werden.
    window.setTimeout(function () {
      if (!wrap.contains(document.activeElement)) closeList();
    }, 0);
  });

  document.addEventListener("click", function (e) {
    if (!wrap.contains(e.target)) closeList();
  });

  window.addEventListener("resize", positionResults);
})();
