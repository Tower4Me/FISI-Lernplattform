/* ==========================================================================
   next-unit.js — Footer-Navigation einer Einheit: "Zurueck zum Lernplan"
   (links) und "Naechste Einheit" (rechts), beide als Button (.btn) in
   einem eigenen Flex-Wrapper .site-footer__nav. Baut das bestehende
   "Zurueck"-Link-Markup zur Laufzeit um und ergaenzt bei Bedarf den
   Weiter-Link — analog theme.js/search.js injiziert das Skript selbst,
   Einheiten binden nur dieses Skript ein, keine HTML-Aenderung pro Seite
   noetig (auch fuer den Button-Umbau des "Zurueck"-Links nicht).

   Reihenfolge-Quelle: data/manifest.json (CONVENTIONS §14 — einzige Quelle,
   aus der auch index.html die Modul-/Einheiten-Reihenfolge rendert). Die
   aktuelle Einheit wird aus dem URL-Pfad (module/<modul-slug>/<einheit-
   slug>.html) ermittelt, dann in der units-Liste ihres Moduls gesucht.
   Letzte Einheit eines Moduls: kein Weiter-Link (bewusst weggelassen,
   nicht deaktiviert dargestellt) — "Zurueck" bleibt dann allein und damit
   dank justify-content: space-between weiterhin links stehen.

   Kein CDN, keine Abhaengigkeiten. Faellt bei Fetch-Fehler/keinem Treffer
   lautlos weg (kein Weiter-Link statt kaputtem Link); der "Zurueck"-Button
   wird trotzdem umgebaut, unabhaengig vom Fetch-Ergebnis.
   ========================================================================== */
(function () {
  "use strict";

  // Idempotenz-Schutz, analog search.js/filter.js.
  if (document.querySelector(".site-footer__nav")) return;

  var footer = document.querySelector(".site-footer");
  if (!footer) return;

  var backLink = footer.querySelector("a");
  if (!backLink) return; // z. B. index.html, dessen Footer keinen Link enthaelt

  backLink.classList.add("btn");

  var nav = document.createElement("div");
  nav.className = "site-footer__nav";
  footer.insertBefore(nav, backLink);
  nav.appendChild(backLink);

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
      link.className = "site-footer__next btn btn--primary";
      link.href = prefix + "module/" + mod.slug + "/" + next.slug + ".html";
      link.textContent = "Nächste Einheit: " + next.name + " →";

      nav.appendChild(link); // nach dem "Zurueck"-Button = rechte Seite
    })
    .catch(function () {
      /* Fetch fehlgeschlagen: kein Weiter-Link statt kaputtem Link. */
    });
})();
