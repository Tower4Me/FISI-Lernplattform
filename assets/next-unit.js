/* ==========================================================================
   next-unit.js — Link zur naechsten Einheit desselben Moduls, oberhalb von
   "Zurueck zum Lernplan" im Footer. Injiziert das Markup selbst (analog
   theme.js/search.js) — Einheiten binden nur dieses Skript ein.

   Reihenfolge-Quelle: data/manifest.json (CONVENTIONS §14 — einzige Quelle,
   aus der auch index.html die Modul-/Einheiten-Reihenfolge rendert). Die
   aktuelle Einheit wird aus dem URL-Pfad (module/<modul-slug>/<einheit-
   slug>.html) ermittelt, dann in der units-Liste ihres Moduls gesucht.
   Letzte Einheit eines Moduls: kein Link (bewusst weggelassen, nicht
   deaktiviert dargestellt).

   Kein CDN, keine Abhaengigkeiten. Faellt bei Fetch-Fehler/keinem Treffer
   lautlos weg (kein Link statt kaputtem Link).
   ========================================================================== */
(function () {
  "use strict";

  // Idempotenz-Schutz, analog search.js/filter.js.
  if (document.querySelector(".site-footer__next")) return;

  var footer = document.querySelector(".site-footer");
  if (!footer) return;

  /* -------------------------------------------------------- Pfad-Basis --- */
  var scriptEl = document.currentScript;
  var prefix = scriptEl
    ? scriptEl.getAttribute("src").replace(/assets\/next-unit\.js.*$/, "")
    : "";

  /* ------------------------------------------------- Aktuelle Einheit --- */
  var match = window.location.pathname.match(/module\/([^\/]+)\/([^\/]+)\.html/);
  if (!match) return; // keine Einheiten-Seite (z. B. index.html)
  var currentModuleSlug = match[1];
  var currentUnitSlug = match[2];

  fetch(prefix + "data/manifest.json")
    .then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json();
    })
    .then(function (data) {
      var mod = (data.modules || []).filter(function (m) {
        return m.slug === currentModuleSlug;
      })[0];
      if (!mod || !mod.units) return;

      var idx = -1;
      for (var i = 0; i < mod.units.length; i++) {
        if (mod.units[i].slug === currentUnitSlug) { idx = i; break; }
      }
      if (idx === -1) return; // aktuelle Einheit nicht im Manifest gefunden

      var next = mod.units[idx + 1];
      if (!next) return; // letzte Einheit des Moduls: kein Weiter-Link

      var link = document.createElement("a");
      link.className = "site-footer__next";
      link.href = prefix + "module/" + mod.slug + "/" + next.slug + ".html";
      link.textContent = "Nächste Einheit: " + next.name + " →";

      footer.insertBefore(link, footer.firstChild);
    })
    .catch(function () {
      /* Fetch fehlgeschlagen: kein Link statt kaputtem Link. */
    });
})();
