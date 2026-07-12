/* ==========================================================================
   quiz-engine.js — laedt Fragen aus JSON, wertet aus, speichert Fortschritt.
   Fortschritt liegt in localStorage (Key-Praefix "fisi:").
   Laeuft in lokaler Umgebung (file:// oder eigener Server), NICHT in der
   Artifact-Vorschau (dort ist localStorage gesperrt).
   ==========================================================================

   Quiz-JSON-Schema (data/<modul>/<einheit>.json):
   {
     "unit": "it-sicherheit/toms",
     "questions": [
       {
         "id": "q1",
         "question": "Text der Frage?",
         "options": ["A", "B", "C", "D"],
         "answer": 1,                 // Index der richtigen Option (0-basiert)
         "explanation": "Warum B richtig ist."
       }
     ]
   }

   Fortschritt-Schema in localStorage:
   fisi:progress -> {
     "it-sicherheit/toms": { "done": true, "score": 3, "total": 3, "ts": 169... }
   }
*/

(function () {
  "use strict";

  var LS_KEY = "fisi:progress";

  /* ----------------------------------------------------- Progress-Store */
  var Progress = {
    _read: function () {
      try {
        return JSON.parse(localStorage.getItem(LS_KEY)) || {};
      } catch (e) {
        return {};
      }
    },
    _write: function (data) {
      try {
        localStorage.setItem(LS_KEY, JSON.stringify(data));
        return true;
      } catch (e) {
        // localStorage nicht verfuegbar (z.B. Artifact-Sandbox) -> still ignorieren
        return false;
      }
    },
    get: function (unit) {
      return this._read()[unit] || null;
    },
    getAll: function () {
      return this._read();
    },
    set: function (unit, entry) {
      var all = this._read();
      all[unit] = Object.assign({}, all[unit], entry, { ts: Date.now() });
      this._write(all);
      return all[unit];
    },
    reset: function (unit) {
      var all = this._read();
      if (unit) { delete all[unit]; } else { all = {}; }
      this._write(all);
    }
  };

  /* ------------------------------------------------------------- Helpers */
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  /* -------------------------------------------------------- Quiz-Render */
  function renderQuiz(container, data) {
    var unit = data.unit;
    var questions = data.questions || [];
    container.innerHTML = "";

    if (!questions.length) {
      container.appendChild(el("p", "muted", "Noch keine Fragen hinterlegt."));
      return;
    }

    var state = questions.map(function () { return { chosen: null, locked: false }; });

    questions.forEach(function (q, qi) {
      var block = el("div", "quiz__q");
      block.appendChild(el("p", "quiz__question", (qi + 1) + ". " + q.question));

      var list = el("ul", "quiz__options");
      q.options.forEach(function (opt, oi) {
        var li = el("li", "quiz__option");
        var input = el("input");
        input.type = "radio";
        input.name = unit + "-" + q.id;
        input.value = String(oi);
        input.addEventListener("change", function () {
          if (state[qi].locked) return;
          state[qi].chosen = oi;
        });
        li.appendChild(input);
        li.appendChild(el("span", null, opt));
        list.appendChild(li);
      });
      block.appendChild(list);

      var fb = el("p", "quiz__feedback");
      fb.setAttribute("data-q", qi);
      block.appendChild(fb);

      container.appendChild(block);
    });

    var actions = el("div");
    var checkBtn = el("button", "btn btn--primary", "Auswerten");
    var resetBtn = el("button", "btn", "Zuruecksetzen");
    resetBtn.style.marginLeft = "0.5rem";
    actions.appendChild(checkBtn);
    actions.appendChild(resetBtn);
    container.appendChild(actions);

    var result = el("p", "quiz__result");
    container.appendChild(result);

    checkBtn.addEventListener("click", function () {
      var score = 0;
      questions.forEach(function (q, qi) {
        var qBlock = container.querySelectorAll(".quiz__q")[qi];
        var options = qBlock.querySelectorAll(".quiz__option");
        var fb = qBlock.querySelector(".quiz__feedback");
        state[qi].locked = true;

        options.forEach(function (li, oi) {
          li.classList.remove("quiz__option--correct", "quiz__option--wrong");
          if (oi === q.answer) li.classList.add("quiz__option--correct");
          if (oi === state[qi].chosen && oi !== q.answer) li.classList.add("quiz__option--wrong");
        });

        if (state[qi].chosen === q.answer) {
          score++;
          fb.className = "quiz__feedback quiz__feedback--ok";
          fb.textContent = "Richtig. " + (q.explanation || "");
        } else {
          fb.className = "quiz__feedback quiz__feedback--fail";
          var chosenTxt = state[qi].chosen == null ? "Keine Antwort gewaehlt." : "Falsch.";
          fb.textContent = chosenTxt + " " + (q.explanation || "");
        }
      });

      result.textContent = "Ergebnis: " + score + " / " + questions.length;
      Progress.set(unit, { done: true, score: score, total: questions.length });
    });

    resetBtn.addEventListener("click", function () {
      Progress.reset(unit);
      renderQuiz(container, data);
    });
  }

  /* ----------------------------------------------------------- Loader */
  function loadQuiz(container) {
    var src = container.getAttribute("data-quiz-src");
    if (!src) {
      container.appendChild(el("p", "muted", "Kein data-quiz-src gesetzt."));
      return;
    }
    fetch(src)
      .then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      })
      .then(function (data) { renderQuiz(container, data); })
      .catch(function (err) {
        container.appendChild(
          el("p", "muted", "Quiz konnte nicht geladen werden (" + err.message +
             "). Bei file:// ggf. lokalen Server nutzen.")
        );
      });
  }

  /* ------------------------------------------------- Auto-Init + Export */
  function init() {
    document.querySelectorAll("[data-quiz-src]").forEach(loadQuiz);
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // Fuer index.html-Fortschrittsanzeige exportieren
  window.FISIProgress = Progress;
})();
