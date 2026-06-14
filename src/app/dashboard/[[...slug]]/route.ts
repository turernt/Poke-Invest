import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DIR = path.join(process.cwd(), "src/dashboard-pages");

const SLUG_TO_FILE: Record<string, string> = {
  "": "index.html",
  "cartes_unite": "cartes_unite.html",
  "cartes_pca": "cartes_pca.html",
  "items_scelles": "items_scelles.html",
  "mastersets": "mastersets.html",
  "profile": "profile.html",
};

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug?: string[] }> }
) {
  const { slug } = await params;
  const key = (slug ?? []).join("/");
  const filename = SLUG_TO_FILE[key];

  if (!filename) {
    return new NextResponse("Not found", { status: 404 });
  }

  const filePath = path.join(DIR, filename);
  if (!fs.existsSync(filePath)) {
    return new NextResponse("Not found", { status: 404 });
  }

  let html = fs.readFileSync(filePath, "utf-8");

  // Inline CSS to avoid any static-file serving issues
  const cssPath = path.join(DIR, "style.css");
  if (fs.existsSync(cssPath)) {
    const css = fs.readFileSync(cssPath, "utf-8");
    html = html.replace(
      '<link rel="stylesheet" href="/dashboard/style.css">',
      `<style>\n${css}\n</style>`
    );
  }

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
