/* Navigation, Fortschritt, "Nur AP1", Mobilmenü.
   Fortschritt in localStorage "fisi:v2:progress" = {done: {id: 1}, checks: {key: bestProzent}}.
   Der Live-Schlüssel "fisi:progress" wird hier nie angefasst. */
(function () {
  var KEY = "fisi:v2:progress";
  var AP1 = "fisi:v2:ap1";

  function load() {
    try {
      var p = JSON.parse(localStorage.getItem(KEY) || "{}");
      return { done: p.done || {}, checks: p.checks || {} };
    } catch (e) { return { done: {}, checks: {} }; }
  }
  function save(p) {
    try { localStorage.setItem(KEY, JSON.stringify(p)); } catch (e) { /* ohne Speicher kein Fortschritt */ }
  }

  function markDone(id) {
    var p = load();
    if (p.done[id]) return;
    p.done[id] = 1;
    save(p);
    paint();
  }

  /* Bestes Ergebnis eines Checks speichern; liefert den bisherigen Bestwert. */
  function setCheck(key, pct) {
    var p = load();
    var old = p.checks[key];
    if (old === undefined || pct > old) { p.checks[key] = pct; save(p); paint(); }
    return old;
  }

  function paint() {
    var p = load();
    document.querySelectorAll(".up[data-id]").forEach(function (a) {
      a.classList.toggle("is-done", !!p.done[a.getAttribute("data-id")]);
    });
    document.querySelectorAll(".up[data-check]").forEach(function (a) {
      var v = p.checks[a.getAttribute("data-check")];
      a.classList.toggle("is-done", v !== undefined);
      if (v !== undefined) a.setAttribute("title", "Bestes Ergebnis: " + v + " %");
    });
    document.querySelectorAll(".kap-progress[data-ids]").forEach(function (s) {
      var ids = s.getAttribute("data-ids").split(" ").filter(Boolean);
      var n = ids.filter(function (id) { return p.done[id]; }).length;
      s.textContent = n + "/" + ids.length;
      s.setAttribute("aria-label", n + " von " + ids.length + " gelesen");
    });
  }

  window.FisiV2 = { load: load, setCheck: setCheck, markDone: markDone };

  document.addEventListener("DOMContentLoaded", function () {
    var body = document.body;
    paint();

    /* Unterpunkt gilt als gelesen, sobald der Pager sichtbar ist oder "Weiter" geklickt wird. */
    var id = body.getAttribute("data-up");
    var pager = document.querySelector(".pager");
    if (id && pager) {
      if ("IntersectionObserver" in window) {
        var io = new IntersectionObserver(function (es) {
          if (es.some(function (e) { return e.isIntersecting; })) { markDone(id); io.disconnect(); }
        });
        io.observe(pager);
      }
      var next = pager.querySelector(".next");
      if (next) next.addEventListener("click", function () { markDone(id); });
    }

    /* Lernfelder auf- und zuklappen */
    document.querySelectorAll(".lf-head").forEach(function (b) {
      b.addEventListener("click", function () {
        var li = b.parentElement;
        var open = !li.classList.contains("is-open");
        li.classList.toggle("is-open", open);
        b.setAttribute("aria-expanded", String(open));
      });
    });

    /* Nur AP1 */
    var ap1 = document.getElementById("ap1-only");
    if (ap1) {
      var on = false;
      try { on = localStorage.getItem(AP1) === "1"; } catch (e) { /* Standard: aus */ }
      ap1.checked = on;
      body.classList.toggle("only-ap1", on);
      ap1.addEventListener("change", function () {
        body.classList.toggle("only-ap1", ap1.checked);
        try {
          if (ap1.checked) localStorage.setItem(AP1, "1"); else localStorage.removeItem(AP1);
        } catch (e) { /* gilt dann nur für diese Seite */ }
      });
    }

    /* Mobilmenü */
    var toggle = document.querySelector(".nav-toggle");
    function setNav(open) {
      body.classList.toggle("nav-open", open);
      if (toggle) toggle.setAttribute("aria-expanded", String(open));
    }
    if (toggle) toggle.addEventListener("click", function () { setNav(!body.classList.contains("nav-open")); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setNav(false); });
    document.querySelectorAll(".sidenav a").forEach(function (a) {
      a.addEventListener("click", function () { setNav(false); });
    });

    /* Aktuellen Eintrag in der Seitenleiste sichtbar machen */
    var cur = document.querySelector('.sidenav [aria-current="page"]');
    var side = document.querySelector(".sidenav");
    if (cur && side && side.scrollHeight > side.clientHeight) {
      side.scrollTop = Math.max(0, cur.offsetTop - side.clientHeight / 3);
    }
  });
})();
