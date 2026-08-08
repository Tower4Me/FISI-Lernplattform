/* ==========================================================================
   progress-io.js — Export/Import des Fortschritts (localStorage-Key
   "fisi:progress") als JSON-Datei. Kein Sync, kein Server: reiner
   Datei-Download bzw. -Upload durch die Nutzerin/den Nutzer selbst, z. B.
   um zwischen zwei Browsern/Geraeten zu wechseln oder ein Backup zu haben.

   Existiert nur auf index.html (Selbst-Erkennung ueber #module-list,
   analog filter.js/merksaetze.js). Haengt sich in das von merksaetze.js
   gebaute 2-Spalten-Grid ".site-header__buttons" ein (Reihe 3), mit
   Fallback auf ".site-header__actions" bzw. document.body, falls dieses
   Grid aus irgendeinem Grund fehlt.

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

  function buildUI() {
    if (!document.getElementById("module-list")) return; // nur index.html
    if (document.getElementById("progress-io-export")) return; // Idempotenz-Schutz

    var exportBtn = document.createElement("button");
    exportBtn.type = "button";
    exportBtn.id = "progress-io-export";
    exportBtn.className = "filter-switcher__btn";
    exportBtn.textContent = "Fortschritt exportieren";

    var importBtn = document.createElement("button");
    importBtn.type = "button";
    importBtn.id = "progress-io-import";
    importBtn.className = "filter-switcher__btn";
    importBtn.textContent = "Fortschritt importieren";

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

    exportBtn.addEventListener("click", function () {
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

    importBtn.addEventListener("click", function () { fileInput.click(); });

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

    var grid = document.querySelector(".site-header__buttons");
    var actions = document.querySelector(".site-header__actions");
    var target = grid || actions || document.body;
    target.appendChild(exportBtn);
    target.appendChild(importBtn);
    target.appendChild(fileInput);
    target.appendChild(status);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", buildUI);
  } else {
    buildUI();
  }
})();
