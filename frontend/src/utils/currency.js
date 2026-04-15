const MARKET_CURRENCY_RULES = [
  { match: (symbol) => symbol.endsWith(".NS") || symbol.endsWith(".BO"), locale: "en-IN", currency: "INR" },
  { match: (symbol) => symbol.endsWith(".L"), locale: "en-GB", currency: "GBP" },
  { match: (symbol) => symbol.endsWith(".TO") || symbol.endsWith(".V"), locale: "en-CA", currency: "CAD" },
  { match: (symbol) => symbol.endsWith(".AX"), locale: "en-AU", currency: "AUD" },
  { match: (symbol) => symbol.endsWith(".HK"), locale: "zh-HK", currency: "HKD" },
  { match: (symbol) => symbol.endsWith(".T"), locale: "ja-JP", currency: "JPY" },
  { match: (symbol) => symbol.endsWith(".SS") || symbol.endsWith(".SZ"), locale: "zh-CN", currency: "CNY" },
  { match: (symbol) => symbol === "BTC" || symbol === "ETH" || symbol.endsWith("-USD"), locale: "en-US", currency: "USD" },
];

const DEFAULT_MARKET = { locale: "en-US", currency: "USD" };

export function getCurrencyForSymbol(symbol = "") {
  const normalized = String(symbol).toUpperCase().trim();
  const matched = MARKET_CURRENCY_RULES.find((rule) => rule.match(normalized));
  return matched ? { locale: matched.locale, currency: matched.currency } : DEFAULT_MARKET;
}

export function formatPriceBySymbol(symbol, value, options = {}) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return "-";

  const { locale, currency } = getCurrencyForSymbol(symbol);
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...options,
  }).format(amount);
}
