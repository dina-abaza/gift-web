export async function GET() {
  const upstream = "https://iraqi-e-store-api.vercel.app/api/products/offers";
  try {
    const res = await fetch(upstream, { cache: "no-store" });
    if (!res.ok) {
      const text = await res.text();
      return new Response(text || JSON.stringify({ error: "upstream_error" }), {
        status: res.status,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=1800",
        },
      });
    }
    const data = await res.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=1800",
      },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: "fetch_failed" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, s-maxage=60",
      },
    });
  }
}
