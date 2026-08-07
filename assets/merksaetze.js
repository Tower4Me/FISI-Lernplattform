/* merksaetze.js — "Alle Merksaetze drucken".
   Zwei Rollen in einer Datei, je nach Seite (Selbst-Erkennung ueber
   vorhandene IDs, analog filter.js):
   - index.html: Link-Button in .site-header__actions, direkt nach dem
     Filter-Button (haengt sich per Skript-Ladereihenfolge dort ein,
     identisches Muster wie theme.js/filter.js), verlinkt zu
     merksaetze.html. Echter Link, kein JS-Toggle.
   - merksaetze.html: laedt alle Unit-Pfade aus data/manifest.json,
     extrahiert die #merksatz-Section jeder Einheit per DOMParser
     (fetch+parse ist inert, kein Skript aus der Fremd-HTML wird je
     ausgefuehrt) und rendert eine druckbare Sammelansicht in
     Manifest-Reihenfolge (Modul -> Einheit).

   Gedrosselte Parallelitaet: Worker-Pool mit fester Groesse (N=8
   gleichzeitige Fetches, naechster startet sobald einer fertig ist) statt
   181 Fetches auf einmal -- spuerbar schonender fuer GitHub Pages/CDN,
   ohne strikt sequenziell (und damit langsam) zu sein.

   Fehlertoleranz: jeder Fetch/Parse-Fehler (Netzwerk, HTTP-Status,
   fehlende Section, fehlendes <p>) wird pro Einheit abgefangen und am Ende
   sichtbar gelistet -- bricht die restliche Ladung nie ab.

   Sicherheit: NIE innerHTML von fremdem Fetch-Inhalt. Nur
   DOMParser.parseFromString (fuehrt keine Scripts aus) + gezieltes
   document.importNode des einzelnen <p> aus der Merksatz-Section +
   Tag-Allowlist-Sanitizing (nur CODE/STRONG/EM/B/I/BR bleiben erhalten,
   alle Attribute werden gestrippt, alles andere wird zu reinem Text
   entpackt statt geloescht).

   Kein CDN, kein Framework. */
(function () {
  "use strict";

  var CONCURRENCY = 8;
  var INLINE_ALLOWLIST = ["CODE", "STRONG", "EM", "B", "I", "BR"];

  /* ---------------------------------------------- Button auf index.html --- */
  function buildIndexButton() {
    if (!document.getElementById("module-list")) return; // nur auf index.html
    if (document.getElementById("merksaetze-druck-link")) return; // Idempotenz-Schutz

    var link = document.createElement("a");
    link.id = "merksaetze-druck-link";
    link.className = "filter-switcher__btn merksaetze-druck-link";
    link.href = "merksaetze.html";
    link.textContent = "Alle Merksätze drucken";

    // Unter dem Filter-Button stapeln (nicht daneben in dieselbe Reihe):
    // .site-header__actions hat bewusst flex-wrap: nowrap (Suche/Theme/
    // Filter sollen als Gruppe nicht untereinander rutschen, siehe
    // CONVENTIONS §15a) -- der neue Button bricht daher gezielt nur
    // innerhalb einer eigenen Spalte zusammen mit dem Filter-Button aus,
    // statt dieses Verhalten fuer die ganze Leiste aufzuweichen.
    var filterSwitcher = document.querySelector(".site-header__actions .filter-switcher");
    if (filterSwitcher) {
      var stack = document.createElement("div");
      stack.className = "site-header__actions-stack";
      filterSwitcher.parentNode.insertBefore(stack, filterSwitcher);
      stack.appendChild(filterSwitcher);
      stack.appendChild(link);
    } else {
      var actions = document.querySelector(".site-header__actions");
      (actions || document.body).appendChild(link);
    }
  }

  /* ------------------------------------------------- Inline-Sanitizing --- */
  function sanitizeInline(node) {
    var children = Array.prototype.slice.call(node.childNodes);
    children.forEach(function (child) {
      if (child.nodeType !== 1) return; // nur Elementknoten pruefen, Text unangetastet
      sanitizeInline(child); // erst die Kinder bereinigen, dann sich selbst
      if (INLINE_ALLOWLIST.indexOf(child.tagName) === -1) {
        // Nicht erlaubtes Element: entpacken (Kinder an seine Stelle
        // schieben), NICHT loeschen -- der Lerninhalt bleibt vollstaendig.
        while (child.firstChild) node.insertBefore(child.firstChild, child);
        node.removeChild(child);
      } else {
        while (child.attributes.length > 0) {
          child.removeAttribute(child.attributes[0].name);
        }
      }
    });
  }

  function extractMerksatz(html) {
    var doc = new DOMParser().parseFromString(html, "text/html");
    var section = doc.querySelector("#merksatz.section--merksatz");
    if (!section) throw new Error("keine Merksatz-Section gefunden");
    var p = section.querySelector("p");
    if (!p) throw new Error("kein <p> in der Merksatz-Section");
    var clone = document.importNode(p, true);
    sanitizeInline(clone);
    return clone;
  }

  /* --------------------------------------------------- Merksatz laden --- */
  function loadUnit(unit) {
    return fetch(unit.href)
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.text();
      })
      .then(function (html) {
        return { unit: unit, node: extractMerksatz(html) };
      })
      .catch(function (err) {
        return { unit: unit, error: err.message };
      });
  }

  // Worker-Pool: N gleichzeitige Fetches, naechster startet sobald einer
  // fertig ist. onEach feuert nach JEDEM einzelnen Abschluss (nicht erst am
  // Batch-Ende), fuer einen fluessigen Fortschrittsbalken.
  function loadAll(units, onEach) {
    return new Promise(function (resolve) {
      var results = new Array(units.length);
      var next = 0;
      var done = 0;

      function startNext() {
        if (next >= units.length) return;
        var i = next++;
        loadUnit(units[i]).then(function (result) {
          results[i] = result;
          done++;
          onEach(done, units.length);
          if (done === units.length) {
            resolve(results);
          } else {
            startNext();
          }
        });
      }

      var workers = Math.min(CONCURRENCY, units.length);
      for (var w = 0; w < workers; w++) startNext();
    });
  }

  /* --------------------------------------------------------- Rendering --- */
  function buildPage() {
    var list = document.getElementById("merksaetze-list");
    if (!list) return; // nur auf merksaetze.html

    var progress = document.getElementById("merksaetze-progress");
    var errorsBox = document.getElementById("merksaetze-errors");
    var printBtn = document.getElementById("merksaetze-print");
    if (printBtn) printBtn.addEventListener("click", function () { window.print(); });

    fetch("data/manifest.json")
      .then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      })
      .then(function (data) {
        var units = [];
        (data.modules || []).forEach(function (mod) {
          (mod.units || []).forEach(function (u) {
            units.push({
              moduleName: mod.name,
              name: u.name,
              href: "module/" + mod.slug + "/" + u.slug + ".html"
            });
          });
        });

        if (progress) {
          progress.textContent = "Lade Merksätze … 0 / " + units.length + " geladen";
        }

        return loadAll(units, function (done, total) {
          if (progress) {
            progress.textContent = "Lade Merksätze … " + done + " / " + total + " geladen";
          }
        });
      })
      .then(function (results) {
        var currentModule = null;
        var errors = [];

        results.forEach(function (result) {
          if (result.error) {
            errors.push(result);
            return;
          }
          if (result.unit.moduleName !== currentModule) {
            currentModule = result.unit.moduleName;
            var h2 = document.createElement("h2");
            h2.className = "merksaetze-module";
            h2.textContent = currentModule;
            list.appendChild(h2);
          }

          var entry = document.createElement("div");
          entry.className = "merksaetze-entry";
          var h3 = document.createElement("h3");
          h3.textContent = result.unit.name;
          entry.appendChild(h3);
          entry.appendChild(result.node);
          list.appendChild(entry);
        });

        if (progress) {
          progress.textContent = results.length + " Einheiten geladen" +
            (errors.length ? " (" + errors.length + " übersprungen, siehe unten)" : "");
        }

        if (errors.length && errorsBox) {
          errorsBox.hidden = false;
          var h2 = document.createElement("h2");
          h2.textContent = "Nicht geladen (" + errors.length + ")";
          errorsBox.appendChild(h2);
          var ul = document.createElement("ul");
          errors.forEach(function (e) {
            var li = document.createElement("li");
            li.textContent = e.unit.moduleName + " – " + e.unit.name + ": " + e.error;
            ul.appendChild(li);
          });
          errorsBox.appendChild(ul);
        }
      })
      .catch(function () {
        if (progress) {
          progress.textContent = "Fehler beim Laden von data/manifest.json — Merksätze konnten nicht geladen werden.";
        }
      });
  }

  function init() {
    buildIndexButton();
    buildPage();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
