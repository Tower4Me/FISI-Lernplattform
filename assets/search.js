/* ==========================================================================
   search.js — Suche ueber Lerneinheiten-Titel (kein Volltext).
   Injiziert das komplette Such-Markup selbst (analog theme.js). Einheiten
   binden nur dieses Skript ein, kein such-spezifisches HTML noetig.

   Datenquelle: data/manifest.json (Unit-Name + Modul-Name je Einheit).
   Ruhezustand: Eingabefeld unauffaellig, KEINE Treffer im Leerzustand.
   Erst bei Eingabe wird gefiltert; Ergebnisse nach Relevanz sortiert
   (exakt > Anfangstreffer > Teiltreffer), umlaut- und case-tolerant.

   Kein CDN, keine Abhaengigkeiten. Kein eigener localStorage-Key noetig.
   ========================================================================== */
(function () {
  "use strict";

  var MAX_RESULTS = 20;

  /* -------------------------------------------------------- Pfad-Basis --- */
  /* Script-Tag selbst traegt den relativen Pfad zum Repo-Root (analog dazu,
     wie style.css/theme.js je nach Seitentiefe eingebunden werden):
     "assets/search.js" (Index) bzw. "../../assets/search.js" (Einheiten). */
  var scriptEl = document.currentScript;
  var prefix = scriptEl
    ? scriptEl.getAttribute("src").replace(/assets\/search\.js.*$/, "")
    : "";

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
  var loadPromise = fetch(prefix + "data/manifest.json")
    .then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json();
    })
    .then(function (data) {
      var list = [];
      var order = 0;
      (data.modules || []).forEach(function (mod) {
        (mod.units || []).forEach(function (u) {
          list.push({
            name: u.name,
            normName: normalize(u.name),
            moduleName: mod.name,
            href: prefix + "module/" + mod.slug + "/" + u.slug + ".html",
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

  /* --------------------------------------------------------- Relevanz --- */
  function search(query) {
    var q = normalize(query);
    if (!q || !entries) return [];
    var matches = [];
    entries.forEach(function (e) {
      var idx = e.normName.indexOf(q);
      if (idx === -1) return;
      var score = e.normName === q ? 0 : (idx === 0 ? 1 : 2);
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
  input.placeholder = isIndex ? "Suche nach Titel (z. B. „Subnetz“, „RAID“) …" : "Suche …";
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

  var header = document.querySelector(".site-header");
  (header || document.body).appendChild(wrap);

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
    input.setAttribute("aria-expanded", "true");
    activeIndex = -1;
    input.setAttribute("aria-activedescendant", "");
  }

  input.addEventListener("input", function () {
    var q = input.value.trim();
    if (!q) {
      listbox.innerHTML = "";
      closeList();
      return;
    }
    loadPromise.then(function () { renderResults(q); });
  });

  input.addEventListener("focus", function () {
    var q = input.value.trim();
    if (q && entries) renderResults(q);
  });

  input.addEventListener("keydown", function (e) {
    if (listbox.hidden && e.key !== "ArrowDown") return;
    if (e.key === "ArrowDown") {
      if (listbox.hidden) {
        var q = input.value.trim();
        if (!q) return;
        renderResults(q);
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
})();
