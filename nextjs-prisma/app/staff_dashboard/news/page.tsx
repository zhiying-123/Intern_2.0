import NewsUI from "./newsUI";
import { fetchFinnhubNews } from "./news";

export default async function Page() {
    let items = [] as any[];

    try {
        items = await fetchFinnhubNews(50); // Increased to 50 for better scrolling
    } catch (e) {
        console.error("Failed to load Finnhub news:", e);
        items = [];
    }

    return (
        <NewsUI items={items} />
    );
}
