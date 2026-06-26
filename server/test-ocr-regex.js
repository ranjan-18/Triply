const text = "TOTAL Rs. 450.50 \n TAX 10.00 \n 9988776655 \n Amount: $1,250.00 \n $1234.56";

// Extract all numbers, handling commas and optional decimals (e.g. 1,000.50, 1000, 50.00)
const numberRegex = /\b\d{1,3}(?:,\d{3})*(?:\.\d+)?\b|\b\d+(?:\.\d+)?\b/g;
const allMatches = text.match(numberRegex);

let maxNumber = 0;
if (allMatches) {
  const numbers = allMatches.map(str => Number(str.replace(/,/g, '')));
  console.log("Found numbers:", numbers);
  const plausibleNumbers = numbers.filter(n => n > 0 && n < 500000);
  if (plausibleNumbers.length > 0) {
    maxNumber = Math.max(...plausibleNumbers);
  }
}
console.log("Max plausible:", maxNumber);

const amountRegex = /(?:total|amount|due|balance|pay)[^\d]*([\d,]+(?:\.\d+)?)/i;
const amountMatch = text.match(amountRegex);

let extractedAmount = maxNumber;
if (amountMatch) {
  console.log("Keyword matched amount:", amountMatch[1]);
  const matchedAmount = Number(amountMatch[1].replace(/,/g, ''));
  if (matchedAmount > 0 && matchedAmount < 500000) {
    extractedAmount = matchedAmount;
  }
}

console.log("Final Extracted Amount:", extractedAmount);
