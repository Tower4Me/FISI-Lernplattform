/* ==========================================================================
   sql-editor.js — interaktives SQL-Terminal auf Basis von sql.js (SQLite
   als WebAssembly, lokal vendort unter assets/tools/vendor/sql.js/).

   Einbindung:
     <div class="tool" data-tool="sql-editor">
       <script type="application/sql">
         -- optionale Seed-SQL, einmalig beim (Neu-)Start ausgeführt
         CREATE TABLE ...;
       </script>
       <p class="muted">SQL-Editor wird geladen …</p>
     </div>

   Lazy Load: sql-wasm.js/.wasm (zusammen ~700 KB) werden erst geladen,
   wenn der Tool-Container in den sichtbaren Bereich scrollt
   (IntersectionObserver) — nicht beim initialen Seitenaufbau.
   Kein CDN: beide Dateien liegen lokal im Repo, siehe CONVENTIONS.md
   Abschnitt "Vendorte Drittanbieter-Bibliotheken".
   ========================================================================== */

(function () {
  "use strict";

  // document.currentScript ist nur synchron beim ersten Auswerten gültig —
  // deshalb sofort sichern, bevor irgendein async Code läuft.
  var thisScriptSrc = document.currentScript && document.currentScript.src;
  var vendorBase = thisScriptSrc
    ? new URL("./vendor/sql.js/", thisScriptSrc).href
    : "vendor/sql.js/";

  var sqlJsModulePromise = null;

  function loadSqlJs() {
    if (sqlJsModulePromise) return sqlJsModulePromise;
    sqlJsModulePromise = new Promise(function (resolve, reject) {
      var script = document.createElement("script");
      script.src = vendorBase + "sql-wasm.js";
      script.onload = function () {
        if (typeof window.initSqlJs !== "function") {
          reject(new Error("sql-wasm.js geladen, aber initSqlJs fehlt."));
          return;
        }
        window
          .initSqlJs({ locateFile: function (file) { return vendorBase + file; } })
          .then(resolve, reject);
      };
      script.onerror = function () {
        reject(new Error("sql-wasm.js konnte nicht geladen werden."));
      };
      document.head.appendChild(script);
    });
    return sqlJsModulePromise;
  }

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function buildResultTable(result) {
    var wrap = el("div");
    var table = el("table");
    if (result.values.length !== 1) {
      table.appendChild(
        el("caption", null, result.values.length + " Zeile(n)")
      );
    } else {
      table.appendChild(el("caption", null, "1 Zeile"));
    }
    var thead = el("thead");
    var headRow = el("tr");
    result.columns.forEach(function (col) {
      headRow.appendChild(el("th", null, col));
    });
    thead.appendChild(headRow);
    table.appendChild(thead);

    var tbody = el("tbody");
    result.values.forEach(function (row) {
      var tr = el("tr");
      row.forEach(function (value) {
        tr.appendChild(el("td", null, value === null ? "NULL" : String(value)));
      });
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    wrap.appendChild(table);
    return wrap;
  }

  function buildTool(container) {
    var seedNode = container.querySelector('script[type="application/sql"]');
    var seedSql = seedNode ? seedNode.textContent.trim() : "";

    container.innerHTML = "";

    var intro = el(
      "p",
      "tool__hint",
      "SQL-Befehle eingeben und auf „Ausführen“ klicken. Mehrere Befehle " +
        "können mit Semikolon getrennt in einem Block stehen."
    );

    var labelId = "sql-editor-input-" + Math.random().toString(36).slice(2, 9);
    var label = el("label", "tool__label", "SQL-Eingabe");
    label.setAttribute("for", labelId);

    var textarea = el("textarea", "tool__terminal-input");
    textarea.id = labelId;
    textarea.spellcheck = false;
    textarea.placeholder = "SQL-Engine wird geladen, sobald der Editor sichtbar wird oder du hier klickst …";

    var actions = el("div", "tool__terminal-actions");
    var runBtn = el("button", "btn btn--primary", "Ausführen");
    runBtn.type = "button";
    var resetBtn = el("button", "btn", "Zurücksetzen");
    resetBtn.type = "button";
    actions.appendChild(runBtn);
    actions.appendChild(resetBtn);

    var status = el("p", "tool__terminal-status", "SQL-Engine wird geladen …");
    status.setAttribute("aria-live", "polite");
    status.style.whiteSpace = "pre-wrap";

    var resultArea = el("div", "tool__terminal-result");

    container.appendChild(intro);
    container.appendChild(label);
    container.appendChild(textarea);
    container.appendChild(actions);
    container.appendChild(status);
    container.appendChild(resultArea);

    var db = null;

    // DCL-Simulation: SQLite selbst hat kein Benutzer-/Rechtesystem, GRANT/
    // REVOKE/SHOW GRANTS sind daher keine echten SQLite-Befehle. Diese drei
    // Schlüsselwörter werden vor dem Ausführen abgefangen und gegen einen
    // simplen In-Memory-Rechte-Speicher simuliert (echte SQL-Syntax, aber
    // eigene Auswertung statt Weiterleitung an sql.js).
    var grants = {}; // { 'user': { 'tabelle_oder_*.*': ["SELECT", "INSERT", ...] } }
    var ALL_RIGHTS = ["SELECT", "INSERT", "UPDATE", "DELETE", "CREATE", "DROP"];

    function normalizeRights(str) {
      if (/ALL\s+PRIVILEGES/i.test(str)) return ALL_RIGHTS.slice();
      return str
        .split(",")
        .map(function (r) { return r.trim().toUpperCase(); })
        .filter(Boolean);
    }

    function formatGrants(user) {
      var userGrants = grants[user];
      if (!userGrants || Object.keys(userGrants).length === 0) {
        return "Keine Rechte für '" + user + "'.";
      }
      var lines = ["Rechte für '" + user + "':"];
      Object.keys(userGrants).forEach(function (table) {
        var rights = userGrants[table];
        if (rights.length > 0) {
          lines.push("  " + table + ": " + rights.join(", "));
        }
      });
      return lines.length > 1 ? lines.join("\n") : "Keine Rechte für '" + user + "'.";
    }

    function runDclStatement(stmt) {
      var m;
      if ((m = /^GRANT\s+(.+?)\s+ON\s+(\*\.\*|[\w]+)\s+TO\s+'([^']+)'(\s+WITH\s+GRANT\s+OPTION)?$/i.exec(stmt))) {
        var rights = normalizeRights(m[1]);
        var table = m[2];
        var user = m[3];
        grants[user] = grants[user] || {};
        grants[user][table] = Array.from(new Set((grants[user][table] || []).concat(rights)));
        return (
          "GRANT ausgeführt: " + rights.join(", ") + " auf " + table +
          " für '" + user + "'" + (m[4] ? " (mit Weitergabe-Recht)" : "") + "."
        );
      }
      if ((m = /^REVOKE\s+(.+?)\s+ON\s+(\*\.\*|[\w]+)\s+FROM\s+'([^']+)'$/i.exec(stmt))) {
        var revokeRights = normalizeRights(m[1]);
        var revokeTable = m[2];
        var revokeUser = m[3];
        if (!grants[revokeUser] || !grants[revokeUser][revokeTable]) {
          return "REVOKE ausgeführt: '" + revokeUser + "' hatte ohnehin keine Rechte auf " + revokeTable + ".";
        }
        grants[revokeUser][revokeTable] = grants[revokeUser][revokeTable].filter(function (r) {
          return revokeRights.indexOf(r) === -1;
        });
        return "REVOKE ausgeführt: " + revokeRights.join(", ") + " auf " + revokeTable + " von '" + revokeUser + "' entzogen.";
      }
      if ((m = /^SHOW\s+GRANTS\s+FOR\s+'([^']+)'$/i.exec(stmt))) {
        return formatGrants(m[1]);
      }
      throw new Error(
        "Unbekannte DCL-Syntax. Erwartet: GRANT <Rechte> ON <Tabelle> TO 'user'; " +
          "REVOKE <Rechte> ON <Tabelle> FROM 'user'; SHOW GRANTS FOR 'user';"
      );
    }

    // Naive Statement-Trennung an Semikolons außerhalb einfacher
    // Anführungszeichen — reicht für die Kurzbefehle in diesem Editor.
    function splitStatements(sql) {
      var stmts = [];
      var current = "";
      var inString = false;
      for (var i = 0; i < sql.length; i++) {
        var ch = sql[i];
        if (ch === "'") inString = !inString;
        if (ch === ";" && !inString) {
          stmts.push(current);
          current = "";
        } else {
          current += ch;
        }
      }
      if (current.trim()) stmts.push(current);
      return stmts.map(function (s) { return s.trim(); }).filter(Boolean);
    }

    function runSeed(database) {
      grants = {};
      if (!seedSql) return;
      database.run(seedSql);
    }

    function renderError(err) {
      status.textContent = "Fehler: " + err.message;
      status.className = "tool__terminal-status tool__terminal-status--error";
    }

    function renderOk(text) {
      status.textContent = text;
      status.className = "tool__terminal-status tool__terminal-status--ok";
    }

    function execute() {
      resultArea.innerHTML = "";
      var raw = textarea.value.trim();
      if (!raw) {
        renderOk("Kein SQL eingegeben.");
        return;
      }
      var statements = splitStatements(raw);
      var messages = [];
      try {
        statements.forEach(function (stmt) {
          if (/^(GRANT|REVOKE|SHOW\s+GRANTS)\b/i.test(stmt)) {
            messages.push(runDclStatement(stmt));
            return;
          }
          var isDml = /^(INSERT|UPDATE|DELETE)\b/i.test(stmt);
          var results = db.exec(stmt + ";");
          if (results.length === 0) {
            var changed = isDml ? db.getRowsModified() : 0;
            messages.push(
              "Befehl ausgeführt." +
                (changed > 0 ? " (" + changed + " Zeile(n) betroffen)" : "")
            );
          } else {
            results.forEach(function (result) {
              resultArea.appendChild(buildResultTable(result));
            });
          }
        });
        renderOk(messages.length ? messages.join("\n") : "Befehl ausgeführt.");
      } catch (err) {
        renderError(err);
      }
    }

    function resetDb() {
      resultArea.innerHTML = "";
      try {
        if (db) db.close();
        db = new window.__sqlJsModule.Database();
        runSeed(db);
        renderOk("Zurückgesetzt. Ausgangszustand wiederhergestellt.");
      } catch (err) {
        renderError(err);
      }
    }

    var activationPromise = null;

    // Lädt die SQL-Engine genau einmal (Promise wird gecacht) und legt die
    // Datenbank inkl. Seed-Daten an. Alle Aufrufer (Klick, Fokus,
    // IntersectionObserver) hängen sich an dasselbe Promise.
    function activate() {
      if (activationPromise) return activationPromise;
      status.textContent = "SQL-Engine wird geladen …";
      activationPromise = loadSqlJs()
        .then(function (SQL) {
          window.__sqlJsModule = SQL;
          db = new SQL.Database();
          runSeed(db);
          renderOk("Bereit.");
        })
        .catch(function (err) {
          renderError(err);
          activationPromise = null; // erneuter Versuch beim nächsten Klick möglich
          throw err;
        });
      return activationPromise;
    }

    runBtn.addEventListener("click", function () {
      activate().then(execute, function () {});
    });
    resetBtn.addEventListener("click", function () {
      activate().then(resetDb, function () {});
    });
    // Fallback, falls IntersectionObserver im jeweiligen Browser nicht
    // zuverlässig feuert: Fokussieren der Eingabe lädt die Engine ebenfalls.
    textarea.addEventListener("focus", activate, { once: true });

    // Primärer Ladeauslöser: Tool-Container scrollt in den sichtbaren
    // Bereich (spart Ladezeit/Datenvolumen, solange niemand scrollt).
    if ("IntersectionObserver" in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              observer.disconnect();
              activate();
            }
          });
        },
        { rootMargin: "200px" }
      );
      observer.observe(container);
    } else {
      activate();
    }
  }

  function init() {
    document.querySelectorAll('[data-tool="sql-editor"]').forEach(buildTool);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
