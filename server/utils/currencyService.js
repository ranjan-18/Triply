// server/utils/currencyService.js

import axios from "axios";
import logger from "./logger.js";

/**
 * Fetch exchange rate from Frankfurter API.
 * If fetching fails, defaults to 1.
 *
 * @param {string} fromCurrency - e.g. "USD"
 * @param {string} toCurrency - e.g. "INR"
 * @param {Date} date - Optional date for historical rates
 * @returns {Promise<number>} Exchange rate
 */
export const getExchangeRate = async (fromCurrency, toCurrency, date = new Date()) => {
  const from = fromCurrency?.toUpperCase() || "INR";
  const to = toCurrency?.toUpperCase() || "INR";

  if (from === to) return 1;

  try {
    // Frankfurter expects YYYY-MM-DD for historical dates, or 'latest'
    const dateString = date.toISOString().split("T")[0];
    
    // Some dates might be in the future relative to API timezone, fallback to latest if needed
    // But for simplicity, we'll try latest first if date is today, else historical
    const isToday = dateString === new Date().toISOString().split("T")[0];
    const endpoint = isToday ? "latest" : dateString;

    const url = `https://api.frankfurter.app/${endpoint}?from=${from}&to=${to}`;
    
    const response = await axios.get(url);
    
    if (response.data && response.data.rates && response.data.rates[to]) {
      return response.data.rates[to];
    }
    
    return 1;
  } catch (error) {
    logger.error(`Currency API failed for ${from}->${to}: ${error.message}`);
    return 1; // Fallback to 1 on failure
  }
};
