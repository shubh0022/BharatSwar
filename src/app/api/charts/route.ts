import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch("https://api.deezer.com/chart", {
      next: { revalidate: 3600 }, // Cache global charts for 1 hour
    });

    if (!res.ok) {
      throw new Error(`Deezer API responded with status ${res.status}`);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Charts API proxy error:", error);
    return NextResponse.json({ error: "Failed to fetch charts from Deezer" }, { status: 500 });
  }
}
