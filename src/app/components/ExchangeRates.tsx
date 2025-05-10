// src/app/components/ExchangeRates.tsx

'use client';

import React, { useEffect, useState } from 'react';

export default function ExchangeRates() {
  const [rates, setRates] = useState<{ [key: string]: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState(1);
  const [targetCurrency, setTargetCurrency] = useState('EUR');

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await fetch(
          //If you want to use your account key, go to https://www.exchangerate-api.com/ to create an account and free 1500 api requests per month. Else can just use my api key.
          'https://v6.exchangerate-api.com/v6/6dce37797dbdb9e77b0132f6/latest/USD'
        );
        const data = await res.json();
        setRates(data.conversion_rates);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch exchange rates', error);
        setLoading(false);
      }
    };

    fetchRates();
  }, []);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value;

    // If the input is empty, reset to 0
    if (input === '') {
      setAmount(0); // Set it to 0 instead of 1 to handle empty input
    } else {
      // Parse the number, and update the state
      const parsedAmount = parseFloat(input);

      if (!isNaN(parsedAmount)) {
        setAmount(parsedAmount);
      } else {
        setAmount(0); // In case of invalid input, set to 0
      }
    }
  };

  const convertedAmount = rates
    ? (amount * rates[targetCurrency]).toFixed(2)
    : '0.00';

  const topCurrencies = ['EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'MYR'];

  return (
    <div className="bg-white shadow-2xl rounded-3xl p-10 max-w-6xl mx-auto my-20">
      <h2 className="text-4xl font-bold text-center mb-10 text-gray-800">
        Currency Exchange Center
      </h2>

      {/* Live Exchange Rates */}
      {loading ? (
        <p className="text-center text-gray-500 text-lg">
          Loading exchange rates...
        </p>
      ) : rates ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mb-12">
          {topCurrencies.map((currency) => (
            <div
              key={currency}
              className="bg-gray-100 rounded-xl p-4 text-center text-lg font-medium text-gray-700 shadow-sm"
            >
              1 USD = {rates[currency]} {currency}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-red-500 text-lg">
          Failed to load exchange rates.
        </p>
      )}

      {/* Currency Converter Calculator */}
      <div className="bg-purple-50 p-8 rounded-2xl shadow-md">
        <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Convert USD to Another Currency
        </h3>

        <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
          <input
            type="number"
            className="w-full sm:w-1/2 p-4 text-lg rounded-lg border border-gray-300"
            value={amount || ''}
            onChange={handleAmountChange}
            placeholder="Enter amount in USD"
          />
          <select
            className="w-full sm:w-1/2 p-4 text-lg rounded-lg border border-gray-300"
            value={targetCurrency}
            onChange={(e) => setTargetCurrency(e.target.value)}
          >
            {rates &&
              Object.keys(rates).map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
          </select>
        </div>

        <div className="text-center text-2xl font-bold text-purple-700">
          {amount} USD = {convertedAmount} {targetCurrency}
        </div>
      </div>
    </div>
  );
}
