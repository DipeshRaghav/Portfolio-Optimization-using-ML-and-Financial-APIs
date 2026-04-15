const MARKET_CURRENCY_RULES = [

  { match: s => s.endsWith(".NS") || s.endsWith(".BO"), locale: "en-IN", currency: "INR" },
  { match: s => s.endsWith(".L"), locale: "en-GB", currency: "GBP" },
  { match: s => s.endsWith(".TO") || s.endsWith(".V"), locale: "en-CA", currency: "CAD" },
  { match: s => s.endsWith(".AX"), locale: "en-AU", currency: "AUD" },
  { match: s => s.endsWith(".HK"), locale: "zh-HK", currency: "HKD" },
  { match: s => s.endsWith(".T"), locale: "ja-JP", currency: "JPY" },
  { match: s => s.endsWith(".SS") || s.endsWith(".SZ"), locale: "zh-CN", currency: "CNY" },

  // crypto + US stocks default
  { match: s => true, locale: "en-US", currency: "USD" }

];


function getCurrency(symbol = "") {

  const s = String(symbol).toUpperCase();

  const rule = MARKET_CURRENCY_RULES.find(r => r.match(s));

  return rule || { locale: "en-US", currency: "USD" };

}


export function formatPriceBySymbol(symbol, value) {

  const num = Number(value);

  if (!Number.isFinite(num)) return "-";

  const { locale, currency } = getCurrency(symbol);

  return new Intl.NumberFormat(locale, {

    style: "currency",
    currency: currency,

    minimumFractionDigits: 2,
    maximumFractionDigits: 2

  }).format(num);

}