// server: fetch news from Finnhub

export async function fetchFinnhubNews(count = 50) {
    const key = process.env.FINNHUB_API_KEY;
    if (!key) throw new Error("Missing FINNHUB_API_KEY in environment");

    const url = `https://finnhub.io/api/v1/news?category=general&token=${key}`;
    const res = await fetch(url, { next: { revalidate: 300 } }); // Cache for 5 minutes
    if (!res.ok) {
        throw new Error(`Finnhub fetch failed: ${res.status}`);
    }

    const data = await res.json();
    if (!Array.isArray(data)) return [];
    return data.slice(0, count);
}
