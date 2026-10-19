#!/usr/bin/env node
// Crea un tema nuevo a partir de midnight.css y lo registra en manifest.json y themes.json.
//   node tools/add-theme.mjs ocean "Ocean" "#38bdf8"
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const [id, name, accent = "#4cc9f0"] = process.argv.slice(2);

if (!id || id === "off" || !name || !/^[a-z0-9-]+$/.test(id) || !/^#[0-9a-f]{6}$/i.test(accent)) {
  console.error('Uso: node tools/add-theme.mjs <id-en-minusculas> "<Nombre>" [#acento]');
  console.error('Ej.: node tools/add-theme.mjs ocean "Ocean" "#38bdf8"');
  process.exit(1);
}

const cssRel = `css/themes/${id}.css`;
const cssPath = path.join(root, cssRel);
if (fs.existsSync(cssPath)) { console.error(`Ya existe ${cssRel}`); process.exit(1); }

const rgb = [1, 3, 5].map((i) => parseInt(accent.slice(i, i + 2), 16)).join(", ");
const template = fs.readFileSync(path.join(root, "css/themes/midnight.css"), "utf8");
const css = template
  .replace(/^\/\*.*\*\/\n/, `/* ${name} — tema nuevo: ajusta las variables a tu gusto. */\n`)
  .replaceAll('data-esp-theme="midnight"', `data-esp-theme="${id}"`)
  .replace(/--link: #[0-9a-f]{6};/i, `--link: ${accent};`)
  .replace(/--accent: #[0-9a-f]{6};/i, `--accent: ${accent};`)
  .replace(/--accent-soft: rgba\([^)]*\);/, `--accent-soft: rgba(${rgb}, .12);`);
fs.writeFileSync(cssPath, css);

const manifestPath = path.join(root, "manifest.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
manifest.content_scripts[0].css.splice(manifest.content_scripts[0].css.indexOf("css/accessibility.css"), 0, cssRel);
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");

const get = (v) => css.match(new RegExp(`--${v}: (#[0-9a-f]{6})`, "i"))[1];
const themesPath = path.join(root, "themes.json");
const themes = JSON.parse(fs.readFileSync(themesPath, "utf8"));
themes.push({ id, name, colors: [get("bg"), get("surface"), accent], text: get("text"), scheme: "dark" });
fs.writeFileSync(
  themesPath,
  "[\n" + themes.map((t) => "  " + JSON.stringify(t).replace(/,"/g, ', "').replace(/":/g, '": ').replace(/^\{/, "{ ").replace(/\}$/, " }")).join(",\n") + "\n]\n"
);

console.log(`Tema "${name}" creado en ${cssRel}. Recarga la extensión y elígelo en el popup.`);
