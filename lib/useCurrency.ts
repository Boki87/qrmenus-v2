import { useEffect, useState } from "react";

type Currency = {
  short: string;
  long: string;
};

export default function useCurrency() {
  const [currencies, setCurrencies] = useState<Currency[]>([]);

  async function fetchCurrencies() {
    const res = await fetch(
      "https://openexchangerates.org/api/currencies.json"
    );
    const resData = (await res.json()) as { [x: string]: string };
    setCurrencies(() => {
      return Object.entries(resData).map((c) => {
        return { short: c[0], long: c[1] };
      });
    });
  }
  useEffect(() => {
    fetchCurrencies();
  }, []);

  return {
    currencies,
  };
}
