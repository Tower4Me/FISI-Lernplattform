/* Reiter: <div class="reiter" data-reiter> mit .reiter-panel[data-label].
   Alle Panels bleiben im DOM (Druck, Suche); ohne JS stehen sie untereinander. */
(function () {
  var n = 0;
  function init(box) {
    var panels = Array.prototype.slice.call(box.querySelectorAll(":scope > .reiter-panel"));
    if (panels.length < 2) return;
    var list = document.createElement("div");
    list.className = "reiter-tabs";
    list.setAttribute("role", "tablist");
    var tabs = panels.map(function (p, i) {
      var id = "reiter-" + (++n);
      var b = document.createElement("button");
      b.type = "button";
      b.id = id + "-tab";
      b.textContent = p.getAttribute("data-label") || "Reiter " + (i + 1);
      b.setAttribute("role", "tab");
      p.id = p.id || id;
      b.setAttribute("aria-controls", p.id);
      p.setAttribute("role", "tabpanel");
      p.setAttribute("aria-labelledby", b.id);
      p.tabIndex = 0;
      b.addEventListener("click", function () { select(i, false); });
      list.appendChild(b);
      return b;
    });
    function select(i, focus) {
      tabs.forEach(function (t, j) {
        var on = i === j;
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
        panels[j].hidden = !on;
      });
      if (focus) tabs[i].focus();
    }
    list.addEventListener("keydown", function (e) {
      var i = tabs.indexOf(document.activeElement);
      if (i < 0) return;
      var k = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 }[e.key];
      if (k === undefined) return;
      e.preventDefault();
      select((k + tabs.length) % tabs.length, true);
    });
    box.insertBefore(list, panels[0]);
    box.classList.add("is-ready");
    select(0, false);
  }
  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("[data-reiter]").forEach(init);
  });
})();
