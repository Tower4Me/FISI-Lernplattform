#!/usr/bin/env node
/*
 * tools/check.js — Konsistenzprüfung zwischen HTML-Einheiten,
 * data/manifest.json und Quiz-JSON-Dateien. Keine externen Abhängigkeiten,
 * nur Node-Bordmittel (fs, path).
 *
 * Prüft:
 *   1. Jeder data-quiz-src-Pfad in module/**\/*.html zeigt auf eine
 *      tatsächlich existierende JSON-Datei.
 *   2. Jeder Einheiten-Eintrag in data/manifest.json zeigt auf eine
 *      tatsächlich existierende module/<modul-slug>/<einheit-slug>.html.
 *   3. Jede referenzierte Quiz-JSON ist syntaktisch valides JSON.
 *
 * Aufruf:  node tools/check.js
 * Exit-Code 0 = alles ok, 1 = mindestens eine Inkonsistenz gefunden.
 * Dokumentation: CONVENTIONS.md Abschnitt 15.
 */

"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const MODULE_DIR = path.join(ROOT, "module");
const MANIFEST_PATH = path.join(ROOT, "data", "manifest.json");

const errors = [];

function toRepoRel(p) {
  return path.relative(ROOT, p).split(path.sep).join("/");
}

function findHtmlFiles(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(findHtmlFiles(full));
    } else if (entry.isFile() && entry.name.endsWith(".html")) {
      results.push(full);
    }
  }
  return results;
}

function checkJsonValid(jsonPath, contextLabel) {
  if (!fs.existsSync(jsonPath)) {
    errors.push(contextLabel + ": Datei fehlt: " + toRepoRel(jsonPath));
    return;
  }
  const raw = fs.readFileSync(jsonPath, "utf8");
  try {
    JSON.parse(raw);
  } catch (e) {
    errors.push(contextLabel + ": " + toRepoRel(jsonPath) + " ist kein valides JSON (" + e.message + ")");
  }
}

/* ---- 1. data-quiz-src in allen HTML-Einheiten pruefen ------------------ */

const htmlFiles = findHtmlFiles(MODULE_DIR);
const quizSrcRegex = /data-quiz-src="([^"]+)"/g;

for (const htmlFile of htmlFiles) {
  const html = fs.readFileSync(htmlFile, "utf8");
  let match;
  let foundAny = false;
  quizSrcRegex.lastIndex = 0;
  while ((match = quizSrcRegex.exec(html)) !== null) {
    foundAny = true;
    const quizSrc = match[1];
    const resolved = path.resolve(path.dirname(htmlFile), quizSrc);
    checkJsonValid(resolved, "data-quiz-src in " + toRepoRel(htmlFile));
  }
  if (!foundAny) {
    errors.push("Keine data-quiz-src gefunden in " + toRepoRel(htmlFile));
  }
}

/* ---- 2 + 3. Manifest gegen HTML-Dateien und Quiz-JSONs pruefen -------- */

if (!fs.existsSync(MANIFEST_PATH)) {
  errors.push("Manifest fehlt: " + toRepoRel(MANIFEST_PATH));
} else {
  let manifest = null;
  try {
    manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
  } catch (e) {
    errors.push("data/manifest.json ist kein valides JSON (" + e.message + ")");
  }

  if (manifest) {
    for (const mod of manifest.modules || []) {
      for (const unit of mod.units || []) {
        const label = mod.slug + "/" + unit.slug;
        const htmlPath = path.join(MODULE_DIR, mod.slug, unit.slug + ".html");

        if (!fs.existsSync(htmlPath)) {
          errors.push("Manifest-Eintrag " + label + ": HTML fehlt (" + toRepoRel(htmlPath) + ")");
        }

        if (unit.quiz) {
          const quizPath = path.join(ROOT, unit.quiz);
          checkJsonValid(quizPath, "Manifest-Eintrag " + label + " (quiz)");
        } else {
          errors.push("Manifest-Eintrag " + label + ": kein \"quiz\"-Feld gesetzt");
        }
      }
    }
  }
}

/* ---- Ausgabe ------------------------------------------------------------ */

if (errors.length === 0) {
  console.log("Alles ok. Keine Inkonsistenzen gefunden.");
  process.exit(0);
} else {
  console.log(errors.length + " Inkonsistenz(en) gefunden:\n");
  errors.forEach(function (e) {
    console.log("  - " + e);
  });
  process.exit(1);
}
