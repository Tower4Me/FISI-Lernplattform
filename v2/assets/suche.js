/* Suche über window.SUCHINDEX (assets/suchindex.js, vom Build erzeugt).
   Alle Suchwörter müssen in Titel, Zwischenüberschriften oder Merksatz vorkommen.
   Rang: Treffer im Titel vor Zwischenüberschrift vor Merksatz. Läuft ohne Server. */
(function () {
  var idx = window.SUCHINDEX || [];
  var q = document.getElementById("suche-q");
  var list = document.getElementById("suche-treffer");
  var info = document.getElementById("suche-info");
  if (!q || !list) return;

  function norm(s) {
    return s.toLowerCase().replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss");
  }
  idx.forEach(function (e) {
    e._t = norm(e.n + " " + e.t);
    e._h = e.h.map(function (h) { return norm(h[1]); });
    e._m = norm(e.m);
  });

  function esc(s) {
    return s.replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; });
  }

  function suche(text) {
    var words = norm(text).split(/\s+/).filter(function (w) { return w.length > 1; });
    if (!words.length) return [];
    var res = [];
    idx.forEach(function (e) {
      var score = 0, hit = -1;
      for (var i = 0; i < words.length; i++) {
        var w = words[i], s = 0;
        if (e._t.indexOf(w) >= 0) s = 3;
        for (var j = 0; j < e._h.length; j++) {
          if (e._h[j].indexOf(w) >= 0) { if (s < 2) s = 2; if (hit < 0) hit = j; }
        }
        if (!s && e._m.indexOf(w) >= 0) s = 1;
        if (!s) return;
        score += s;
      }
      res.push({ e: e, score: score, hit: hit });
    });
    res.sort(function (a, b) { return b.score - a.score || a.e.n.localeCompare(b.e.n, "de", { numeric: true }); });
    return res;
  }

  function zeige() {
    var text = q.value.trim();
    var res = suche(text);
    list.innerHTML = res.slice(0, 50).map(function (r) {
      var e = r.e, url = e.u + (r.hit >= 0 ? "#" + e.h[r.hit][0] : "");
      var sub = r.hit >= 0 ? "<p class=\"suche-h\">Abschnitt: " + esc(e.h[r.hit][1]) + "</p>" : "";
      return "<li class=\"lf-item\" data-stufe=\"" + e.s + "\"><span class=\"num\">" + e.n + "</span><div>" +
        "<a href=\"" + url + "\">" + esc(e.t) + "</a>" + sub +
        "<p class=\"suche-m\">" + esc(e.m.length > 180 ? e.m.slice(0, 177) + " …" : e.m) + "</p></div></li>";
    }).join("");
    info.textContent = text ? (res.length ? res.length + " Treffer" + (res.length > 50 ? ", die ersten 50" : "") : "Keine Treffer") : "";
    try { history.replaceState(null, "", text ? "?q=" + encodeURIComponent(text) : location.pathname); } catch (e) { /* file:// */ }
  }

  var m = /[?&]q=([^&]*)/.exec(location.search);
  if (m) q.value = decodeURIComponent(m[1].replace(/\+/g, " "));
  q.addEventListener("input", zeige);
  zeige();
  q.focus();
})();
