import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaExchangeAlt, FaSync } from "react-icons/fa";

const currencySymbols = {
  USD: "$",
  INR: "₹",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
  AUD: "A$",
  CAD: "C$",
  CNY: "¥",
  CHF: "CHF",
};

const CurrencyConverter = () => {
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("INR");
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [rates, setRates] = useState({});
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchRates = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.currencylayer.com/live?access_key=${import.meta.env.VITE_CURRENCY_KEY}`
      );

      if (response.data.success) {
        const quoteRates = {};
        Object.entries(response.data.quotes).forEach(([key, value]) => {
          const currency = key.replace("USD", "");
          quoteRates[currency] = value;
        });
        quoteRates["USD"] = 1;
        setRates(quoteRates);
        setLastUpdated(new Date().toLocaleTimeString());
      } else {
        console.error("Currencylayer error:", response.data.error.info);
      }
    } catch (error) {
      console.error("Error fetching currency rates:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  useEffect(() => {
    if (rates[fromCurrency] && rates[toCurrency]) {
      let result;
      if (fromCurrency === "USD") {
        result = amount * rates[toCurrency];
      } else if (toCurrency === "USD") {
        result = amount / rates[fromCurrency];
      } else {
        result = (amount / rates[fromCurrency]) * rates[toCurrency];
      }
      setConvertedAmount(result.toFixed(2));
    }
  }, [amount, fromCurrency, toCurrency, rates]);

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <div className="min-h-screen mt-16 md:mt-0 bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#212121] rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-[#2c2c2c] p-5">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Currency Converter</h2>
            <button
              onClick={fetchRates}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white transition"
              title="Refresh rates"
            >
              <FaSync className={loading ? "animate-spin" : ""} />
            </button>
          </div>
          {lastUpdated && (
            <p className="text-xs text-gray-400 mt-1">Updated: {lastUpdated}</p>
          )}
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-3 rounded-lg bg-[#333333] text-white border border-[#444444] focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition"
              placeholder="Enter amount"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-medium text-gray-300">From</label>
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-[#333333] text-white border border-[#444444] focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition"
              >
                {Object.keys(currencySymbols).map((currency) => (
                  <option key={`from-${currency}`} value={currency}>
                    {currency} ({currencySymbols[currency]})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-center md:col-span-1">
              <button
                onClick={handleSwap}
                className="p-3 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white transition transform hover:scale-110"
                title="Swap currencies"
              >
                <FaExchangeAlt />
              </button>
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-medium text-gray-300">To</label>
              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-[#333333] text-white border border-[#444444] focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition"
              >
                {Object.keys(currencySymbols).map((currency) => (
                  <option key={`to-${currency}`} value={currency}>
                    {currency} ({currencySymbols[currency]})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-[#2c2c2c] p-5 rounded-xl">
            <p className="text-sm text-gray-400">Converted Amount</p>
            <p className="text-3xl font-bold text-white mt-1">
              {convertedAmount
                ? `${currencySymbols[toCurrency] || ""}${convertedAmount}`
                : loading
                ? "Loading..."
                : "—"}
            </p>
            <p className="text-sm text-gray-400 mt-2">
              {amount} {fromCurrency} = {convertedAmount} {toCurrency}
            </p>
          </div>
        </div>

        <div className="px-6 py-4 bg-[#1a1a1a] text-center text-xs text-gray-500">
          Exchange rates provided by CurrencyLayer API
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverter;