/* welcome.js — einmaliges Willkommens-Popup auf index.html.
   Erscheint nur, solange der localStorage-Key "fisi:welcome-seen" nicht
   gesetzt ist; einmal geschlossen = nie wieder, bis localStorage geleert
   wird. Baut sich selbst per DOM auf, analog theme.js/filter.js. Rein
   additiv (keine Aenderung an manifest.json-Fetch oder Modullisten-
   Rendering) und blockiert deren Ladevorgang nicht. Kein CDN, kein
   Framework, Key-Praefix "fisi:" wie Theme/Filter/Fortschritt. */
(function () {
  "use strict";

  var LS_KEY = "fisi:welcome-seen";

  function getStored() {
    try { return localStorage.getItem(LS_KEY); } catch (e) { return null; }
  }
  function setStored() {
    try { localStorage.setItem(LS_KEY, "1"); } catch (e) { /* Storage gesperrt/voll: ignorieren */ }
  }

  function buildUI() {
    if (getStored()) return;
    if (document.getElementById("welcome-overlay")) return; // Schutz gegen doppelte Injektion

    var overlay = document.createElement("div");
    overlay.className = "welcome-overlay";
    overlay.id = "welcome-overlay";

    var dialog = document.createElement("div");
    dialog.className = "welcome-dialog";
    dialog.setAttribute("role", "dialog");
    dialog.setAttribute("aria-modal", "true");
    dialog.setAttribute("aria-labelledby", "welcome-title");

    dialog.innerHTML =
      '<h2 id="welcome-title">Willkommen auf der FISI-Lernplattform</h2>' +
      "<p>Kurz zur Orientierung, bevor es losgeht:</p>" +
      "<ul>" +
      "<li>Jede Einheit folgt demselben Aufbau: Einstieg, Konzept, Praxisbeispiel, Merksatz, Quiz.</li>" +
      "<li>Dein Fortschritt wird lokal in deinem Browser gespeichert (kein Server, kein Konto) — eine Einheit gilt ab 80&nbsp;% richtiger Quiz-Antworten als erledigt.</li>" +
      "<li>Einige Einheiten enthalten interaktive Tools direkt zum Ausprobieren.</li>" +
      "<li>Über den Farb-Button oben lassen sich verschiedene Farbschemata wählen.</li>" +
      "<li>Jede Einheit lässt sich einzeln als PDF drucken (Strg+P bzw. Cmd+P).</li>" +
      "</ul>" +
      '<p class="welcome-dialog__disclaimer">Diese Seite ist eine Lernergänzung, keine offizielle Prüfungsvorbereitung. Manche Inhalte sind ausführlicher behandelt, als für die Prüfung nötig wäre, andere möglicherweise nicht so präzise oder vollständig, wie es wünschenswert wäre. Für Richtigkeit oder Vollständigkeit kann keine Gewähr übernommen werden.</p>';

    var closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "btn btn--primary welcome-dialog__close";
    closeBtn.textContent = "Verstanden, los geht's";
    dialog.appendChild(closeBtn);

    overlay.appendChild(dialog);
    document.body.appendChild(overlay);

    function focusableElements() {
      return Array.prototype.slice.call(
        dialog.querySelectorAll('a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])')
      );
    }

    function onKeydown(e) {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== "Tab") return;
      // Fokus-Falle: Tab/Shift+Tab zirkulieren nur innerhalb des Dialogs.
      var items = focusableElements();
      if (items.length === 0) return;
      var first = items[0];
      var last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    function close() {
      setStored();
      overlay.parentNode.removeChild(overlay);
      document.removeEventListener("keydown", onKeydown);
      // Kein ausloesendes Element (Auto-Open beim Laden) -- Fokus sinnvoll
      // auf das erste interaktive Element im Header lenken, sonst <body>.
      var fallback = document.querySelector(".site-search__input") || document.body;
      fallback.focus();
    }

    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) close();
    });
    closeBtn.addEventListener("click", close);
    document.addEventListener("keydown", onKeydown);

    closeBtn.focus();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", buildUI);
  } else {
    buildUI();
  }
})();
