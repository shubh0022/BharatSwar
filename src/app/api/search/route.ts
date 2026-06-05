import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";

  if (!query) {
    return NextResponse.json({ data: [] });
  }

  try {
    const res = await fetch(`https://api.deezer.com/search?q=${encodeURIComponent(query)}`, {
      next: { revalidate: 300 }, // Cache search for 5 minutes
    });

    if (!res.ok) {
      throw new Error(`Deezer API responded with status ${res.status}`);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Search API proxy error:", error);
    return NextResponse.json({ error: "Failed to fetch search results from Deezer" }, { status: 500 });
  }
}
