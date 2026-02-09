import PortfolioUI from "./portfolioUI";
import { getPortfolioData } from "./portfolio";

export default async function PortfolioPage() {
    const portfolioData = await getPortfolioData();

    return <PortfolioUI data={portfolioData} />;
}
