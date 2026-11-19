import { mkdir, copyFile } from "node:fs/promises";
import path from "node:path";

// GitHub Pages serves static files only. Create a real index.html for every
// React Router URL so known routes return HTTP 200 instead of the 404 fallback.
const routes = [
  "/",
  "/partnerup",
  "/partnerup/democreate",
  "/partnerup/clupp",
  "/partnerup/securing-the-local",
  "/partnerup/assumptions",
  "/partnerup/resilience-pathways",
  "/youth",
  "/youth/ghetto-youth",
  "/youth/economic-empowerment",
  "/youth/uji-sato",
  "/social-justice",
  "/social-justice/right-to-life",
  "/social-justice/mathare-resilience-hub",
  "/social-justice/ghetto-stories",
  "/publications",
  "/about",
  "/donate",
];

const outputDir = path.resolve("dist");
const appShell = path.join(outputDir, "index.html");

for (const route of routes) {
  if (route === "/") continue;

  const routeDir = path.join(outputDir, route.slice(1));
  await mkdir(routeDir, { recursive: true });
  await copyFile(appShell, path.join(routeDir, "index.html"));
}

console.log(`Created static entry pages for ${routes.length} routes.`);
