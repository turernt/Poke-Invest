import { NextResponse } from "next/server";
import indexHtml from "../../../dashboard-pages/index";
import cartesUniteHtml from "../../../dashboard-pages/cartes_unite";
import cartesPcaHtml from "../../../dashboard-pages/cartes_pca";
import itemsScelles from "../../../dashboard-pages/items_scelles";
import mastersetsHtml from "../../../dashboard-pages/mastersets";
import profileHtml from "../../../dashboard-pages/profile";
import styleCss from "../../../dashboard-pages/style";

const CSS_LINK = '<link rel="stylesheet" href="/dashboard/style.css">';
const INLINE_STYLE = `<style>\n${styleCss}\n</style>`;

function inlineCss(html: string): string {
  return html.replace(CSS_LINK, INLINE_STYLE);
}

const PAGES: Record<string, string> = {
  "": inlineCss(indexHtml),
  "cartes_unite": inlineCss(cartesUniteHtml),
  "cartes_pca": inlineCss(cartesPcaHtml),
  "items_scelles": inlineCss(itemsScelles),
  "mastersets": inlineCss(mastersetsHtml),
  "profile": inlineCss(profileHtml),
};

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug?: string[] }> }
) {
  const { slug } = await params;
  const key = (slug ?? []).join("/");
  const html = PAGES[key];

  if (!html) {
    return new NextResponse("Not found", { status: 404 });
  }

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
