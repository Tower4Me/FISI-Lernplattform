/* ==========================================================================
   exam-engine.js — Pruefungssimulator (Modul "pruefung").
   Eine einzige Engine fuer alle vier Simulator-Einheiten, Unterscheidung
   nur ueber <div id="exam-root" data-teil="...">. Laedt data/pruefung/
   index.json (Struktur: Teile/Bloecke/Zeit/Punkte) sowie die dort je Teil
   referenzierten Pool-Dateien.

   Getrennt von quiz-engine.js/fisi:progress (die bleiben unangetastet):
   eigener State unter dem Praefix "fisi:exam:".

   fisi:exam:seen -> {
     "<teilId>__<blockId>": { "<fragenId>": <timestamp>, ... }
   }
   Merkt sich pro Block, wann eine Frage zuletzt gezogen wurde. Ziehung:
   zuerst nie gezogene Fragen, danach (falls der Pool kleiner als die
   Zielzahl ist) die am laengsten zurueckliegenden -- nie ein harter
   Ausschluss, ein Durchlauf kommt immer zustande.

   Zielzahl pro Block ist 15 (WISO: 2x15) -- ist der tatsaechliche Pool
   eines Blocks kleiner (z. B. der 5-Fragen-Mini-Pool aus Etappe 1), werden
   nur die vorhandenen Fragen gezogen (keine Wiederholung INNERHALB eines
   einzelnen Durchlaufs) und die Punkte pro Frage entsprechend hochskaliert,
   sodass ein voll richtig beantworteter Block immer die vollen Blockpunkte
   ergibt. Die Zeit pro Block orientiert sich dagegen an der strukturellen
   Zielzahl aus index.json, nicht am aktuellen Pool-Umfang.

   fisi:exam:history -> [
     { "datum": "...", "teil": "ap2-netzwerke", "block": null,
       "punkte": 78, "von": 100, "note": 2, "bestanden": true }
   ]
   Rein lokal, auf die letzten 100 Durchlaeufe begrenzt.

   Kein CDN, keine Abhaengigkeiten, ES5-Stil analog quiz-engine.js.
   ========================================================================== */
(function () {
  "use strict";

  var root = document.getElementById("exam-root");
  if (!root) return;
  var teilId = root.getAttribute("data-teil");
  if (!teilId) return;

  var LS_SEEN = "fisi:exam:seen";
  var LS_HISTORY = "fisi:exam:history";

  var scriptEl = document.currentScript;
  var prefix = scriptEl
    ? scriptEl.getAttribute("src").replace(/assets\/exam-engine\.js.*$/, "")
    : "";

  /* --------------------------------------------------------- Storage --- */
  function readLS(key, fallback) {
    try {
      var v = JSON.parse(localStorage.getItem(key));
      return v == null ? fallback : v;
    } catch (e) {
      return fallback;
    }
  }
  function writeLS(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      return false;
    }
  }

  /* --------------------------------------------------------- Helpers --- */
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }

  function parseNum(str) {
    if (str == null || str === "") return null;
    var n = parseFloat(String(str).replace(",", "."));
    return isNaN(n) ? null : n;
  }

  function formatTime(ms) {
    var totalSec = Math.max(0, Math.ceil(ms / 1000));
    var m = Math.floor(totalSec / 60);
    var s = totalSec % 60;
    return m + ":" + (s < 10 ? "0" : "") + s;
  }

  function noteFromPercent(pct, notenschluessel) {
    var sorted = notenschluessel.slice().sort(function (a, b) { return b.ab - a.ab; });
    for (var i = 0; i < sorted.length; i++) {
      if (pct >= sorted[i].ab) return sorted[i].note;
    }
    return sorted.length ? sorted[sorted.length - 1].note : 6;
  }

  /* ------------------------------------------------------------ Fetch --- */
  function fetchJSON(path) {
    return fetch(path).then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status + " bei " + path);
      return r.json();
    });
  }

  function renderError(msg) {
    root.innerHTML = "";
    var box = el("div", "exam-screen exam-screen--error");
    box.appendChild(el("p", "muted", msg));
    root.appendChild(box);
  }

  function renderAufbau(teil) {
    root.innerHTML = "";
    var box = el("div", "exam-screen exam-screen--start");
    box.appendChild(el("h2", null, teil.name));
    box.appendChild(el("p", "exam-meta",
      "Reale Dauer: " + teil.zeit_minuten + " Minuten · " + teil.gesamtpunkte + " Punkte"));
    box.appendChild(el("p", "muted", "Fragenpool im Aufbau — für diesen Prüfungsteil sind noch keine Simulationsfragen hinterlegt. Schau bald wieder vorbei."));
    root.appendChild(box);
  }

  /* --------------------------------------------------------- Ziehung --- */
  function drawForBlock(pool, block) {
    var poolBlock = pool.filter(function (f) {
      return f.teile.indexOf(teilId) !== -1 && f.block === block.id;
    });
    var target = Math.min(block.fragen, poolBlock.length);

    var seenAll = readLS(LS_SEEN, {});
    var key = teilId + "__" + block.id;
    var seenMap = seenAll[key] || {};

    var unseen = poolBlock.filter(function (f) { return !(f.id in seenMap); });
    var chosen, cycled = false;

    if (unseen.length >= target) {
      chosen = shuffle(unseen).slice(0, target);
    } else {
      var restNeeded = target - unseen.length;
      var seenSorted = poolBlock
        .filter(function (f) { return f.id in seenMap; })
        .sort(function (a, b) { return seenMap[a.id] - seenMap[b.id]; });
      chosen = unseen.concat(seenSorted.slice(0, restNeeded));
      cycled = restNeeded > 0;
    }

    var now = Date.now();
    chosen.forEach(function (f) { seenMap[f.id] = now; });
    seenAll[key] = seenMap;
    writeLS(LS_SEEN, seenAll);

    return { questions: shuffle(chosen), cycled: cycled, poolSize: poolBlock.length };
  }

  function augment(f, blockId) {
    var q = { raw: f, block: blockId, flagged: false };
    if (f.typ === "mc") {
      var withOrig = f.optionen.map(function (text, i) { return { text: text, orig: i }; });
      q.displayOptions = shuffle(withOrig);
      q.correctDisplayIndex = -1;
      for (var i = 0; i < q.displayOptions.length; i++) {
        if (q.displayOptions[i].orig === f.antwort) { q.correctDisplayIndex = i; break; }
      }
      q.userAnswer = null;
    } else if (f.typ === "order") {
      q.userAnswer = shuffle(f.optionen);
    } else if (f.typ === "num") {
      q.userAnswer = null;
    }
    return q;
  }

  function drawQuestions(pool, teil, blockId) {
    var blocks = blockId ? teil.bloecke.filter(function (b) { return b.id === blockId; }) : teil.bloecke;
    var questions = [];
    var cycledBlocks = [];
    blocks.forEach(function (block) {
      var res = drawForBlock(pool, block);
      res.questions.forEach(function (f) { questions.push(augment(f, block.id)); });
      if (res.cycled) cycledBlocks.push(block.name);
    });
    return { questions: questions, cycledBlocks: cycledBlocks, blocks: blocks };
  }

  /* --------------------------------------------------------- Bewertung --- */
  function isAnswered(q) {
    if (q.raw.typ === "mc") return q.userAnswer !== null;
    if (q.raw.typ === "num") return q.userAnswer !== null;
    return true; // order: es gibt immer eine aktuelle Reihenfolge
  }

  function isCorrect(q) {
    if (q.raw.typ === "mc") return q.userAnswer === q.correctDisplayIndex;
    if (q.raw.typ === "num") {
      return q.userAnswer !== null && Math.abs(q.userAnswer - q.raw.loesung) <= (q.raw.toleranz || 0);
    }
    return q.userAnswer.join("␟") === q.raw.optionen.join("␟");
  }

  function formatUserAnswer(q) {
    if (q.raw.typ === "mc") return q.userAnswer === null ? "keine Antwort" : q.displayOptions[q.userAnswer].text;
    if (q.raw.typ === "num") {
      if (q.userAnswer === null) return "keine Antwort";
      return q.userAnswer + (q.raw.einheit ? " " + q.raw.einheit : "");
    }
    return q.userAnswer.join(" → ");
  }

  function formatCorrectAnswer(q) {
    if (q.raw.typ === "mc") return q.raw.optionen[q.raw.antwort];
    if (q.raw.typ === "num") {
      var tol = q.raw.toleranz ? " (± " + q.raw.toleranz + ")" : "";
      return q.raw.loesung + (q.raw.einheit ? " " + q.raw.einheit : "") + tol;
    }
    return q.raw.optionen.join(" → ");
  }

  function pushHistory(entry) {
    var hist = readLS(LS_HISTORY, []);
    hist.push(entry);
    if (hist.length > 100) hist = hist.slice(hist.length - 100);
    writeLS(LS_HISTORY, hist);
  }

  /* -------------------------------------------------------- Startscreen --- */
  function renderStart(teil, pool, index) {
    root.innerHTML = "";
    var totalFragen = teil.bloecke.reduce(function (s, b) { return s + b.fragen; }, 0);

    var wrap = el("div", "exam-screen exam-screen--start");
    wrap.appendChild(el("h2", null, teil.name));
    wrap.appendChild(el("p", "exam-meta",
      "Reale Dauer: " + teil.zeit_minuten + " Minuten · " + totalFragen + " Fragen in " +
      teil.bloecke.length + " Blöcken · " + teil.gesamtpunkte + " Punkte, bestanden ab " +
      (index.bestehen_ab || 50) + " Punkten"));
    wrap.appendChild(el("p", "exam-hinweis",
      "Prüfungssimulation im Stil der AP — eigenständig formulierte Fragen (Multiple Choice und " +
      "Zahleneingabe statt offener Handlungsaufgaben), keine Original-Prüfungsaufgaben. Verbindlich " +
      "sind die offiziellen Unterlagen deiner zuständigen Kammer."));

    var lueckenhaft = teil.bloecke.some(function (b) {
      var count = pool.filter(function (f) { return f.teile.indexOf(teilId) !== -1 && f.block === b.id; }).length;
      return count < b.fragen;
    });
    if (lueckenhaft) {
      wrap.appendChild(el("p", "muted",
        "Hinweis: Der Fragenpool befindet sich noch im Aufbau — in mindestens einem Block stehen " +
        "aktuell weniger als die vollen " + teil.bloecke[0].fragen + " Fragen zur Verfügung. Die " +
        "Punkte werden für den jeweiligen Block automatisch anteilig hochgerechnet."));
    }

    var fieldset = el("fieldset", "exam-block-choice");
    fieldset.appendChild(el("legend", null, "Umfang"));
    var full = el("label", "exam-block-choice__item");
    var fullInput = document.createElement("input");
    fullInput.type = "radio"; fullInput.name = "exam-scope"; fullInput.value = ""; fullInput.checked = true;
    full.appendChild(fullInput);
    full.appendChild(el("span", null, "Voller Durchlauf (alle Blöcke, " + teil.zeit_minuten + " Minuten)"));
    fieldset.appendChild(full);

    teil.bloecke.forEach(function (b) {
      var label = el("label", "exam-block-choice__item");
      var input = document.createElement("input");
      input.type = "radio"; input.name = "exam-scope"; input.value = b.id;
      label.appendChild(input);
      label.appendChild(el("span", null, "Nur Block „" + b.name + "“ (" + b.fragen + " Fragen, " + b.punkte + " Punkte)"));
      fieldset.appendChild(label);
    });
    wrap.appendChild(fieldset);

    var startBtn = el("button", "btn btn--primary", "Simulation starten");
    startBtn.type = "button";
    startBtn.addEventListener("click", function () {
      var chosen = fieldset.querySelector("input[name=exam-scope]:checked");
      startExam(teil, pool, index, chosen && chosen.value ? chosen.value : null);
    });
    wrap.appendChild(startBtn);

    root.appendChild(wrap);
  }

  /* ---------------------------------------------------------- Ablauf --- */
  var current = null; // aktiver State waehrend eines Durchlaufs
  var timerHandle = null;

  function computeMinutes(teil, blockId) {
    if (!blockId) return teil.zeit_minuten;
    var block = teil.bloecke.filter(function (b) { return b.id === blockId; })[0];
    var totalFragen = teil.bloecke.reduce(function (s, b) { return s + b.fragen; }, 0);
    return Math.round(teil.zeit_minuten * block.fragen / totalFragen);
  }

  function startExam(teil, pool, index, blockId) {
    var draw = drawQuestions(pool, teil, blockId);
    if (!draw.questions.length) {
      renderError("Für diesen Umfang stehen aktuell keine Fragen zur Verfügung.");
      return;
    }
    var blocksById = {};
    draw.blocks.forEach(function (b) { blocksById[b.id] = b; });

    current = {
      teil: teil,
      index: index,
      pool: pool,
      blockId: blockId,
      blocksById: blocksById,
      questions: draw.questions,
      cycledBlocks: draw.cycledBlocks,
      cur: 0,
      deadline: Date.now() + computeMinutes(teil, blockId) * 60000
    };

    renderRunning();
    if (timerHandle) clearInterval(timerHandle);
    timerHandle = setInterval(tickTimer, 1000);
  }

  function tickTimer() {
    if (!current) return;
    var remaining = current.deadline - Date.now();
    var timerEl = document.getElementById("exam-timer");
    if (timerEl) timerEl.textContent = formatTime(remaining);
    if (remaining <= 0) {
      clearInterval(timerHandle);
      finishExam(true);
    }
  }

  function renderRunning() {
    root.innerHTML = "";
    var st = current;
    var q = st.questions[st.cur];
    var block = st.blocksById[q.block];

    var wrap = el("div", "exam-screen exam-screen--running");

    var head = el("div", "exam-run-head");
    head.appendChild(el("span", "exam-block-label", "Block: " + block.name));
    head.appendChild(el("span", "exam-progress-label", "Frage " + (st.cur + 1) + " / " + st.questions.length));
    var timer = el("span", "exam-timer", formatTime(st.deadline - Date.now()));
    timer.id = "exam-timer";
    head.appendChild(timer);
    wrap.appendChild(head);

    if (st.cycledBlocks.length) {
      wrap.appendChild(el("p", "exam-cycle-hint",
        "Block(e) einmal vollständig durchlaufen, Fragen wiederholen sich jetzt: " + st.cycledBlocks.join(", ") + "."));
      st.cycledBlocks = []; // nur einmal beim Start des Durchlaufs anzeigen
    }

    var qBox = el("div", "exam-question");
    qBox.appendChild(el("p", "exam-question__text", q.raw.frage));
    qBox.appendChild(renderQuestionBody(q));
    wrap.appendChild(qBox);

    var flagBtn = el("button", "btn", q.flagged ? "Markierung entfernen" : "Später ansehen");
    flagBtn.type = "button";
    flagBtn.addEventListener("click", function () {
      q.flagged = !q.flagged;
      renderRunning();
    });
    wrap.appendChild(flagBtn);

    var navRow = el("div", "exam-nav-row");
    var backBtn = el("button", "btn", "← Zurück");
    backBtn.type = "button";
    backBtn.disabled = st.cur === 0;
    backBtn.addEventListener("click", function () { st.cur--; renderRunning(); });
    navRow.appendChild(backBtn);

    var nextBtn = el("button", "btn", "Weiter →");
    nextBtn.type = "button";
    nextBtn.disabled = st.cur === st.questions.length - 1;
    nextBtn.addEventListener("click", function () { st.cur++; renderRunning(); });
    navRow.appendChild(nextBtn);
    wrap.appendChild(navRow);

    var grid = el("div", "exam-navgrid");
    st.questions.forEach(function (qq, i) {
      var b = el("button", "exam-navgrid__item");
      b.type = "button";
      b.textContent = String(i + 1);
      if (i === st.cur) b.classList.add("is-current");
      if (isAnswered(qq)) b.classList.add("is-answered");
      if (qq.flagged) b.classList.add("is-flagged");
      b.addEventListener("click", function () { st.cur = i; renderRunning(); });
      grid.appendChild(b);
    });
    wrap.appendChild(grid);

    var submitBtn = el("button", "btn btn--primary", "Abgeben");
    submitBtn.type = "button";
    submitBtn.addEventListener("click", function () {
      var unanswered = st.questions.filter(function (qq) { return !isAnswered(qq); }).length;
      if (unanswered > 0) {
        var ok = window.confirm(unanswered + " Frage(n) sind noch unbeantwortet. Trotzdem abgeben?");
        if (!ok) return;
      }
      clearInterval(timerHandle);
      finishExam(false);
    });
    wrap.appendChild(submitBtn);

    root.appendChild(wrap);
  }

  function renderQuestionBody(q) {
    if (q.raw.typ === "mc") {
      var ul = el("ul", "exam-options");
      q.displayOptions.forEach(function (opt, i) {
        var li = el("li", "exam-option");
        var label = el("label", "exam-option__label");
        var input = document.createElement("input");
        input.type = "radio";
        input.name = "exam-mc-" + q.raw.id;
        input.checked = q.userAnswer === i;
        input.addEventListener("change", function () {
          q.userAnswer = i;
          var navBtn = document.querySelectorAll(".exam-navgrid__item")[current.cur];
          if (navBtn) navBtn.classList.add("is-answered");
        });
        label.appendChild(input);
        label.appendChild(el("span", null, opt.text));
        li.appendChild(label);
        ul.appendChild(li);
      });
      return ul;
    }

    if (q.raw.typ === "num") {
      var box = el("div", "exam-num");
      var input = document.createElement("input");
      input.type = "text";
      input.inputMode = "decimal";
      input.className = "exam-num__input";
      input.placeholder = "Zahl eingeben …";
      if (q.userAnswer !== null) input.value = String(q.userAnswer);
      input.addEventListener("input", function () {
        q.userAnswer = parseNum(input.value);
        var navBtn = document.querySelectorAll(".exam-navgrid__item")[current.cur];
        if (navBtn) navBtn.classList.toggle("is-answered", q.userAnswer !== null);
      });
      box.appendChild(input);
      if (q.raw.einheit) box.appendChild(el("span", "exam-num__unit", q.raw.einheit));
      return box;
    }

    // order
    var list = el("ol", "exam-order-list");
    q.userAnswer.forEach(function (text, i) {
      var li = el("li", "exam-order-item");
      li.appendChild(el("span", "exam-order-item__text", text));
      var btns = el("span", "exam-order-item__btns");

      var up = el("button", "btn exam-order-item__btn", "↑");
      up.type = "button";
      up.disabled = i === 0;
      up.addEventListener("click", function () {
        var tmp = q.userAnswer[i - 1];
        q.userAnswer[i - 1] = q.userAnswer[i];
        q.userAnswer[i] = tmp;
        renderRunning();
      });
      btns.appendChild(up);

      var down = el("button", "btn exam-order-item__btn", "↓");
      down.type = "button";
      down.disabled = i === q.userAnswer.length - 1;
      down.addEventListener("click", function () {
        var tmp = q.userAnswer[i + 1];
        q.userAnswer[i + 1] = q.userAnswer[i];
        q.userAnswer[i] = tmp;
        renderRunning();
      });
      btns.appendChild(down);

      li.appendChild(btns);
      list.appendChild(li);
    });
    return list;
  }

  /* -------------------------------------------------------- Auswertung --- */
  function finishExam(auto) {
    var st = current;
    if (!st) return;

    var perBlockCount = {};
    st.questions.forEach(function (q) { perBlockCount[q.block] = (perBlockCount[q.block] || 0) + 1; });

    var pointsPerQ = {};
    Object.keys(perBlockCount).forEach(function (b) {
      pointsPerQ[b] = st.blocksById[b].punkte / perBlockCount[b];
    });

    var perBlockEarned = {}, perModulEarned = {}, perModulPossible = {};
    var total = 0;
    st.questions.forEach(function (q) {
      var pts = pointsPerQ[q.block];
      var earned = isCorrect(q) ? pts : 0;
      perBlockEarned[q.block] = (perBlockEarned[q.block] || 0) + earned;
      total += earned;
      var m = q.raw.modul;
      perModulEarned[m] = (perModulEarned[m] || 0) + earned;
      perModulPossible[m] = (perModulPossible[m] || 0) + pts;
    });

    var basis = Object.keys(perBlockCount).reduce(function (s, b) { return s + st.blocksById[b].punkte; }, 0);
    var pct = basis > 0 ? (total / basis * 100) : 0;
    var note = noteFromPercent(pct, st.index.notenschluessel);
    var bestehenAb = st.index.bestehen_ab || 50;
    var bestanden = pct >= bestehenAb;

    pushHistory({
      datum: new Date().toISOString(),
      teil: teilId,
      block: st.blockId,
      punkte: Math.round(total * 10) / 10,
      von: basis,
      note: note,
      bestanden: bestanden
    });

    renderResult(st, { total: total, basis: basis, pct: pct, note: note, bestanden: bestanden,
      perBlockEarned: perBlockEarned, perModulEarned: perModulEarned, perModulPossible: perModulPossible, auto: auto });
  }

  function renderResult(st, res) {
    if (timerHandle) clearInterval(timerHandle);
    root.innerHTML = "";
    var wrap = el("div", "exam-screen exam-screen--result");

    wrap.appendChild(el("h2", null, st.teil.name + " — Auswertung"));
    if (res.auto) wrap.appendChild(el("p", "muted", "Die Zeit ist abgelaufen, der Durchlauf wurde automatisch abgegeben."));

    var summary = el("div", "exam-result-summary");
    summary.appendChild(el("p", "exam-result-punkte",
      Math.round(res.total * 10) / 10 + " / " + res.basis + " Punkte (" + res.pct.toFixed(1) + " %)"));
    var noteP = el("p", "exam-result-note", "Note " + res.note + " — " + (res.bestanden ? "bestanden" : "nicht bestanden"));
    noteP.classList.add(res.bestanden ? "exam-result-note--pass" : "exam-result-note--fail");
    summary.appendChild(noteP);
    wrap.appendChild(summary);

    // Pro Block
    wrap.appendChild(el("h3", null, "Nach Block"));
    var blockTable = document.createElement("table");
    var blockBody = document.createElement("tbody");
    st.teil.bloecke.filter(function (b) {
      return res.perBlockEarned.hasOwnProperty(b.id);
    }).forEach(function (b) {
      var earned = res.perBlockEarned[b.id] || 0;
      var tr = document.createElement("tr");
      var td1 = document.createElement("td"); td1.textContent = b.name;
      var td2 = document.createElement("td"); td2.textContent = (Math.round(earned * 10) / 10) + " / " + b.punkte;
      tr.appendChild(td1); tr.appendChild(td2);
      blockBody.appendChild(tr);
    });
    blockTable.appendChild(blockBody);
    wrap.appendChild(blockTable);

    // Pro Modul
    wrap.appendChild(el("h3", null, "Nach Themenbereich"));
    var modulKeys = Object.keys(res.perModulPossible);
    var modulRows = modulKeys.map(function (m) {
      var possible = res.perModulPossible[m];
      var earned = res.perModulEarned[m] || 0;
      return { modul: m, earned: earned, possible: possible, pct: possible > 0 ? earned / possible * 100 : 0 };
    }).sort(function (a, b) { return a.pct - b.pct; });

    var modulTable = document.createElement("table");
    var modulBody = document.createElement("tbody");
    modulRows.forEach(function (r, i) {
      var tr = document.createElement("tr");
      if (i === 0 && r.pct < 100) tr.className = "exam-result-weakest";
      var td1 = document.createElement("td"); td1.textContent = r.modul;
      var td2 = document.createElement("td"); td2.textContent =
        (Math.round(r.earned * 10) / 10) + " / " + (Math.round(r.possible * 10) / 10) + " (" + r.pct.toFixed(0) + " %)";
      tr.appendChild(td1); tr.appendChild(td2);
      modulBody.appendChild(tr);
    });
    modulTable.appendChild(modulBody);
    wrap.appendChild(modulTable);

    // Pro Frage
    wrap.appendChild(el("h3", null, "Alle Fragen im Detail"));
    st.questions.forEach(function (q, i) {
      var correct = isCorrect(q);
      var box = el("div", "exam-review" + (correct ? " exam-review--ok" : " exam-review--fail"));
      box.appendChild(el("p", "exam-review__question", (i + 1) + ". " + q.raw.frage));
      box.appendChild(el("p", "exam-review__answer", "Deine Antwort: " + formatUserAnswer(q)));
      if (!correct) box.appendChild(el("p", "exam-review__correct", "Richtig wäre: " + formatCorrectAnswer(q)));
      if (q.raw.erklaerung) box.appendChild(el("p", "exam-review__erklaerung", q.raw.erklaerung));
      wrap.appendChild(box);
    });

    var againBtn = el("button", "btn btn--primary", "Neuer Durchlauf");
    againBtn.type = "button";
    againBtn.addEventListener("click", function () {
      renderStart(st.teil, st.pool, st.index);
    });
    wrap.appendChild(againBtn);

    root.appendChild(wrap);
  }

  /* ------------------------------------------------------------- Init --- */
  fetchJSON(prefix + "data/pruefung/index.json").then(function (index) {
    var teil = (index.teile || []).filter(function (t) { return t.id === teilId; })[0];
    if (!teil) { renderError("Unbekannter Prüfungsteil „" + teilId + "“."); return; }

    if (!teil.pool_dateien || !teil.pool_dateien.length) {
      renderAufbau(teil);
      return;
    }

    Promise.all(teil.pool_dateien.map(function (datei) {
      return fetchJSON(prefix + "data/pruefung/" + datei);
    })).then(function (pools) {
      var pool = [];
      pools.forEach(function (p) { (p.fragen || []).forEach(function (f) { pool.push(f); }); });
      renderStart(teil, pool, index);
    }).catch(function (err) {
      renderError("Fragenpool konnte nicht geladen werden (" + err.message + "). Bei file:// ggf. lokalen Server nutzen.");
    });
  }).catch(function (err) {
    renderError("Prüfungs-Index konnte nicht geladen werden (" + err.message + "). Bei file:// ggf. lokalen Server nutzen.");
  });
})();
