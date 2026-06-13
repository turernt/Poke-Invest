import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q");
  if (!q) return NextResponse.json({ error: "Missing query" }, { status: 400 });

  const EBAY_TOKEN = process.env.EBAY_OAUTH_TOKEN;
  if (!EBAY_TOKEN) {
    return NextResponse.json({ error: "eBay token not configured" }, { status: 500 });
  }

  try {
    const url = new URL("https://api.ebay.com/buy/browse/v1/item_summary/search");
    url.searchParams.set("q", q);
    url.searchParams.set("filter", "conditionIds:{3000},buyingOptions:{FIXED_PRICE}");
    url.searchParams.set("sort", "price");
    url.searchParams.set("limit", "10");

    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${EBAY_TOKEN}`,
        "Content-Type": "application/json",
        "X-EBAY-C-MARKETPLACE-ID": "EBAY_FR",
      },
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: text }, { status: res.status });
    }

    const data = await res.json();
    const items = data.itemSummaries || [];

    if (!items.length) {
      return NextResponse.json({ price: null, count: 0 });
    }

    const prices = items
      .map((i: { price?: { value?: string } }) => parseFloat(i.price?.value || "0"))
      .filter((p: number) => p > 0);

    const avg = prices.reduce((a: number, b: number) => a + b, 0) / prices.length;

    return NextResponse.json({ price: Math.round(avg * 100) / 100, count: prices.length });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
