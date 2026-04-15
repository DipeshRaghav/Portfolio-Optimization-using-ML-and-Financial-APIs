const currencyMap = [

  // INDIA
  { check: s => s.endsWith(".NS") || s.endsWith(".BO"), locale: "en-IN", currency: "INR" },

  // UK
  { check: s => s.endsWith(".L"), locale: "en-GB", currency: "GBP" },

  // CANADA
  { check: s => s.endsWith(".TO"), locale: "en-CA", currency: "CAD" },

  // JAPAN
  { check: s => s.endsWith(".T"), locale: "ja-JP", currency: "JPY" },

  // CHINA
  { check: s => s.endsWith(".SS") || s.endsWith(".SZ"), locale: "zh-CN", currency: "CNY" },

  // DEFAULT → USA
  { check: () => true, locale: "en-US", currency: "USD" }

];


function getCurrency(symbol="") {

  const s = symbol.toUpperCase();

  return currencyMap.find(r => r.check(s));

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