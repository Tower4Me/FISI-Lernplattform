/* Kapitel-Check: eine Frage pro Ansicht, Sprungleiste, Prüfen mit Erklärung, Ergebnisseite.
   Fragen stehen als JSON in <script class="check-data"> (Schema: v2/README-v2.md).
   Bestes Ergebnis über window.FisiV2.setCheck (app.js). */
(function () {
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  }
  function icon(id) {
    var ns = "http://www.w3.org/2000/svg";
    var s = document.createElementNS(ns, "svg");
    s.setAttribute("class", "icon");
    s.setAttribute("aria-hidden", "true");
    var u = document.createElementNS(ns, "use");
    u.setAttribute("href", "#" + id);
    s.appendChild(u);
    return s;
  }
  function shuffled(n) {
    var a = [];
    for (var i = 0; i < n; i++) a.push(i);
    for (var j = n - 1; j > 0; j--) {
      var k = Math.floor(Math.random() * (j + 1));
      var t = a[j]; a[j] = a[k]; a[k] = t;
    }
    return a;
  }
  function sameSet(a, b) {
    return a.length === b.length && a.every(function (x) { return b.indexOf(x) >= 0; });
  }

  function init(box) {
    var data = JSON.parse(box.querySelector(".check-data").textContent);
    var key = box.getAttribute("data-check-key");
    var qs = data.fragen;
    var state, cur;

    function reset() {
      state = qs.map(function (q) {
        return { order: shuffled(q.optionen.length), sel: [], done: false, ok: false };
      });
      cur = 0;
    }

    var view = el("div");
    box.appendChild(view);

    function jumpBar() {
      var bar = el("div", "check-jump");
      bar.setAttribute("aria-label", "Fragen");
      qs.forEach(function (q, i) {
        var b = el("button", "", "F" + (i + 1));
        b.type = "button";
        if (state[i].done) b.classList.add(state[i].ok ? "is-ok" : "is-bad");
        if (i === cur) b.setAttribute("aria-current", "step");
        b.setAttribute("aria-label", "Frage " + (i + 1) + (state[i].done ? (state[i].ok ? ", richtig" : ", falsch") : ""));
        b.addEventListener("click", function () { cur = i; render(true); });
        bar.appendChild(b);
      });
      return bar;
    }

    function allDone() { return state.every(function (s) { return s.done; }); }
    function nextOpen() {
      for (var d = 1; d <= qs.length; d++) {
        var i = (cur + d) % qs.length;
        if (!state[i].done) return i;
      }
      return -1;
    }

    function renderQuestion() {
      var q = qs[cur], s = state[cur], multi = q.typ === "mc-multi";
      view.appendChild(jumpBar());
      view.appendChild(el("p", "check-count", "Frage " + (cur + 1) + " von " + qs.length));
      var stem = el("p", "check-stem", q.frage);
      stem.tabIndex = -1;
      view.appendChild(stem);
      view.appendChild(el("p", "check-hint", multi ? "Mehrere Antworten sind richtig." : "Eine Antwort ist richtig."));

      var opts = el("div", "check-options" + (multi ? " is-multi" : ""));
      opts.setAttribute("role", "group");
      opts.setAttribute("aria-label", "Antworten");
      var btnCheck;
      s.order.forEach(function (oi) {
        var b = el("button", "opt", q.optionen[oi]);
        b.type = "button";
        var picked = s.sel.indexOf(oi) >= 0;
        b.setAttribute("aria-pressed", String(picked));
        if (s.done) {
          b.disabled = true;
          var right = q.richtig.indexOf(oi) >= 0;
          if (right) { b.classList.add("is-correct"); b.appendChild(el("span", "opt-tag", "richtig")); }
          else if (picked) { b.classList.add("is-wrong"); b.appendChild(el("span", "opt-tag", "deine Wahl")); }
        } else {
          b.addEventListener("click", function () {
            if (multi) {
              var p = s.sel.indexOf(oi);
              if (p >= 0) s.sel.splice(p, 1); else s.sel.push(oi);
            } else {
              s.sel = [oi];
            }
            opts.querySelectorAll(".opt").forEach(function (o, n) {
              o.setAttribute("aria-pressed", String(s.sel.indexOf(s.order[n]) >= 0));
            });
            btnCheck.disabled = s.sel.length === 0;
          });
        }
        opts.appendChild(b);
      });
      view.appendChild(opts);

      if (s.done) {
        var fb = el("div", "check-feedback " + (s.ok ? "is-ok" : "is-bad"));
        fb.setAttribute("role", "status");
        fb.appendChild(el("p", "fb-verdict", s.ok ? "Richtig" : "Leider falsch"));
        fb.appendChild(el("p", "", q.erklaerung));
        view.appendChild(fb);
      }

      var act = el("div", "check-actions");
      if (!s.done) {
        btnCheck = el("button", "btn btn-primary", "Prüfen");
        btnCheck.type = "button";
        btnCheck.disabled = s.sel.length === 0;
        btnCheck.addEventListener("click", function () {
          s.done = true;
          s.ok = sameSet(s.sel, q.richtig);
          render(false);
        });
        act.appendChild(btnCheck);
      } else if (allDone()) {
        var res = el("button", "btn btn-primary", "Ergebnis anzeigen");
        res.type = "button";
        res.addEventListener("click", function () { cur = -1; render(true); });
        act.appendChild(res);
      } else {
        var nx = el("button", "btn btn-primary", "Nächste Frage");
        nx.type = "button";
        nx.addEventListener("click", function () { cur = nextOpen(); render(true); });
        act.appendChild(nx);
      }
      view.appendChild(act);
      return stem;
    }

    function renderResult() {
      var n = state.filter(function (s) { return s.ok; }).length;
      var pct = Math.round(100 * n / qs.length);
      var old = window.FisiV2 ? window.FisiV2.setCheck(key, pct) : undefined;
      var best = old === undefined ? pct : Math.max(old, pct);
      var wrap = el("div", "check-result");
      wrap.appendChild(el("p", "check-count", "Ergebnis"));
      var score = el("p", "result-score", pct + " %");
      score.tabIndex = -1;
      wrap.appendChild(score);
      wrap.appendChild(el("p", "result-sub", n + " von " + qs.length + " richtig. Bestes Ergebnis bisher: " + best + " %."));
      var list = el("ol", "result-list");
      qs.forEach(function (q, i) {
        var li = el("li", state[i].ok ? "is-ok" : "is-bad");
        li.appendChild(el("span", "rq", "F" + (i + 1)));
        li.appendChild(icon(state[i].ok ? "i-check" : "i-x"));
        var t = el("span", "", q.thema || q.frage);
        li.appendChild(t);
        li.appendChild(el("span", "visually-hidden", state[i].ok ? "richtig" : "falsch"));
        list.appendChild(li);
      });
      wrap.appendChild(list);
      var again = el("button", "btn btn-primary", "Nochmal versuchen");
      again.type = "button";
      again.addEventListener("click", function () { reset(); render(true); });
      var act = el("div", "check-actions");
      act.appendChild(again);
      wrap.appendChild(act);
      view.appendChild(wrap);
      return score;
    }

    function render(moveFocus) {
      view.textContent = "";
      var target = cur < 0 ? renderResult() : renderQuestion();
      if (moveFocus && target) target.focus({ preventScroll: false });
    }

    reset();
    render(false);
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".check[data-check-key]").forEach(init);
  });
})();
