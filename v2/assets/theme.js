/* Theme-Umschalter Hell / Dunkel / System. Im <head> laden (ohne defer), damit kein Aufblitzen entsteht.
   Gespeichert in localStorage "fisi:v2:theme" ("light" | "dark"; fehlt = System). */
(function () {
  var KEY = "fisi:v2:theme";
  var root = document.documentElement;

  function read() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function apply(v) {
    if (v === "light" || v === "dark") root.setAttribute("data-theme", v);
    else root.removeAttribute("data-theme");
  }
  apply(read());

  function sync() {
    var v = read() || "system";
    document.querySelectorAll(".theme-switch [data-theme-value]").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-theme-value") === v));
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".theme-switch [data-theme-value]").forEach(function (b) {
      b.addEventListener("click", function () {
        var v = b.getAttribute("data-theme-value");
        try {
          if (v === "system") localStorage.removeItem(KEY); else localStorage.setItem(KEY, v);
        } catch (e) { /* ohne Speicher gilt die Wahl nur für diese Seite */ }
        apply(v);
        sync();
      });
    });
    sync();
  });
})();
