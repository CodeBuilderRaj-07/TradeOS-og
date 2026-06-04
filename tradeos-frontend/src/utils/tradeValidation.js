export const REQUIRED_FIELDS = ["symbol", "entryPrice"];
export const NUMERIC_FIELDS = ["entryPrice", "stopLoss", "takeProfit", "pnl"];

export function validateTradeForm(data) {
  const errors = {};

  for (const field of REQUIRED_FIELDS) {
    if (!data[field] || String(data[field]).trim() === "") {
      errors[field] = `${field === "entryPrice" ? "Entry Price" : "Symbol"} is required`;
    }
  }

  for (const field of NUMERIC_FIELDS) {
    if (data[field] && isNaN(Number(data[field]))) {
      errors[field] = "Must be a valid number";
    }
  }

  if (data.entryPrice && Number(data.entryPrice) <= 0) {
    errors.entryPrice = "Entry price must be positive";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
