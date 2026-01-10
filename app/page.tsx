import Header from "@/components/Header";
import StockCard from "@/components/StockCard";
import { getSortedPropertiesData } from "@/lib/stocks";

export default function Home() {
  const stocks = getSortedPropertiesData();

  return (
    <>
      <Header />
      <main>
        <div className="relative -top-[10px] flex flex-col gap-8">
          {stocks.length === 0 ? (
            <p>No stocks yet. Create your first property in content/stocks/</p>
          ) : (
            stocks.map((property) => (
              <StockCard key={property.slug} {...property} />
            ))
          )}
        </div>
      </main>
    </>
  );
}
