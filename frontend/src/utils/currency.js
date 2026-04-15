export function formatPriceBySymbol(symbol, value) {

  const amount = Number(value);

  // prevent crash
  if (!Number.isFinite(amount)) return "₹0";

  return new Intl.NumberFormat("en-IN", {

    style: "currency",
    currency: "INR",

    minimumFractionDigits: 0,
    maximumFractionDigits: 2

  }).format(amount);

}