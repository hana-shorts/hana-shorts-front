import { useEffect, useState } from "react";

export function useMarketData(stockCode) {
  const [data, setData] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (stockCode) {
      fetch(`http://localhost:5002/api/chart?code=${stockCode}`)
        .then((response) => response.json())
        .then((data) => {
          const formattedData = data.map((item) => ({
            date: new Date(item.date),
            open: item.시가,
            high: item.고가,
            low: item.저가,
            close: item.종가,
            volume: item.거래량,
          }));
          setData(formattedData);
          setLoaded(true);
        })
        .catch((error) => {
          console.error("Error fetching market data:", error);
          setLoaded(false);
        });
    }
  }, [stockCode]);

  return { data, loaded };
}
