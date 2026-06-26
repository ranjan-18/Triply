// server/modules/expenses/ocr.service.js

import Tesseract from "tesseract.js";
import fs from "fs";

/**
 * Scan an uploaded receipt image and extract text to find amounts and categorize.
 */
export const scanReceipt = async (filePath) => {
  try {
    const { data: { text } } = await Tesseract.recognize(filePath, "eng", {
      logger: m => console.log(m)
    });

    // Delete the file after processing to save space (since we only need the extracted text)
    fs.unlinkSync(filePath);

    // Extract all numbers, handling commas and optional decimals (e.g. 1,000.50, 1000, 50.00)
    const numberRegex = /\b\d{1,3}(?:,\d{3})*(?:\.\d+)?\b|\b\d+(?:\.\d+)?\b/g;
    const allMatches = text.match(numberRegex);
    
    let maxNumber = 0;
    if (allMatches) {
      const numbers = allMatches.map(str => Number(str.replace(/,/g, '')));
      // Filter out massive numbers (likely phone numbers or IDs) to find plausible totals
      const plausibleNumbers = numbers.filter(n => n > 0 && n < 500000);
      if (plausibleNumbers.length > 0) {
        maxNumber = Math.max(...plausibleNumbers);
      }
    }

    // Try to find an explicit "Total" amount
    // Matches "Total", "Amount", "Due", "Balance", "Pay" followed by any non-digit chars, then a number
    const amountRegex = /(?:total|amount|due|balance|pay)[^\d]*([\d,]+(?:\.\d+)?)/i;
    const amountMatch = text.match(amountRegex);

    let extractedAmount = maxNumber;
    if (amountMatch) {
      const matchedAmount = Number(amountMatch[1].replace(/,/g, ''));
      if (matchedAmount > 0 && matchedAmount < 500000) {
        // If we found a number right after "Total", it's highly likely to be the actual total
        extractedAmount = matchedAmount;
      }
    }

    // Advanced Categorization based on broader keywords
    let category = "Other";
    const textLower = text.toLowerCase();
    
    if (textLower.match(/restaurant|cafe|food|pizza|burger|dining|eatery|menu|kitchen|bistro|grill|steak|diner|coffee|tea|bakery/)) {
      category = "Food";
    } else if (textLower.match(/uber|lyft|taxi|cab|train|flight|airways|transit|airlines|metro|bus|station|airport|railway/)) {
      category = "Transport";
    } else if (textLower.match(/hotel|airbnb|resort|motel|inn|booking|stay|room|hospitality/)) {
      category = "Stay";
    }

    return {
      text,
      amount: extractedAmount > 0 ? extractedAmount : null,
      category,
    };
  } catch (error) {
    console.error("OCR Error:", error);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    throw new Error("Failed to scan receipt");
  }
};
