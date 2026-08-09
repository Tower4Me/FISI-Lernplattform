/* ==========================================================================
   manifest-loader.js — zentraler, gecachter Fetch von data/manifest.json.

   Vorher holte sich jedes Skript, das die Modul-/Einheitenliste braucht
   (search.js, merksaetze.js, next-unit.js, das Inline-Skript in
   index.html), das Manifest einzeln per eigenem fetch() -- auf index.html
   liefen dadurch mehrere identische Requests parallel. Dieses Skript
   berechnet den Repo-Root-Pfad-Praefix einmal (analog dazu, wie die
   Verbraucher-Skripte es bisher je selbst aus ihrem eigenen
   <script src>-Pfad ableiteten) und cacht das Fetch-Promise, sodass
   window.FISIManifest.load() beliebig oft aufgerufen werden kann, aber
   nur einmal pro Seitenaufruf tatsaechlich netzwerkt.

   Muss VOR jedem Verbraucher-Skript eingebunden sein (steht deshalb als
   erstes <script>-Tag in jeder Seite). Liefert die rohen manifest.json-
   Daten ({title, modules}) unveraendert -- jeder Verbraucher baut sich
   daraus weiterhin seine eigene Sicht (search.js z. B. eine flache,
   normalisierte Liste; next-unit.js sucht nur die aktuelle Einheit).

   Kein CDN, keine Abhaengigkeiten. */
(function () {
  "use strict";

  if (window.FISIManifest) return; // Idempotenz-Schutz, analog den anderen Skripten

  var scriptEl = document.currentScript;
  var prefix = scriptEl
    ? scriptEl.getAttribute("src").replace(/assets\/manifest-loader\.js.*$/, "")
    : "";

  var promise = null;
  function load() {
    if (!promise) {
      promise = fetch(prefix + "data/manifest.json").then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      });
    }
    return promise;
  }

  window.FISIManifest = { prefix: prefix, load: load };
})();
