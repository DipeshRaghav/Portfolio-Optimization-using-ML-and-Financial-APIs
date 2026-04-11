/**
 * Infer trading currency from Yahoo-style ticker suffixes.
 * US listings without a suffix default to USD.
 */
export function currencyForSymbol(symbol) {
  const s = String(symbol || "")
    .trim()
    .toUpperCase();

  if (s.endsWith(".NS") || s.endsWith(".BO") || s.endsWith(".NSE")) {
    return { currency: "INR", locale: "en-IN" };
  }
  if (s.endsWith(".L")) return { currency: "GBP", locale: "en-GB" };
  if (s.endsWith(".DE") || s.endsWith(".F") || s.endsWith(".PA")) {
    return { currency: "EUR", locale: "de-DE" };
  }
  if (s.endsWith(".HK")) return { currency: "HKD", locale: "en-HK" };
  if (s.endsWith(".T") || s.endsWith(".TOKYO")) return { currency: "JPY", locale: "ja-JP" };
  if (s.endsWith(".AX")) return { currency: "AUD", locale: "en-AU" };
  if (s.endsWith(".TO") || s.endsWith(".V")) return { currency: "CAD", locale: "en-CA" };
  if (s.endsWith(".SW")) return { currency: "CHF", locale: "de-CH" };

  return { currency: "USD", locale: "en-US" };
}

function fractionDigits(currency) {
  return currency === "JPY" ? 0 : 2;
}

/**
 * Full instrument price for tooltips and stat cards.
 */
export function formatInstrumentPrice(value, symbol) {
  if (typeof value !== "number" || Number.isNaN(value)) return "—";
  const { currency, locale } = currencyForSymbol(symbol);
  const fd = fractionDigits(currency);
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: fd,
      minimumFractionDigits: fd,
    }).format(value);
  } catch {
    return `${value.toFixed(fd)} ${currency}`;
  }
}

/**
 * Compact currency ticks for chart Y-axis (avoids overflow).
 */
export function formatAxisPriceTick(value, symbol) {
  if (typeof value !== "number" || Number.isNaN(value)) return "";
  const { currency, locale } = currencyForSymbol(symbol);
  const abs = Math.abs(value);
  try {
    if (abs >= 1000) {
      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        notation: "compact",
        compactDisplay: "short",
        maximumFractionDigits: 1,
      }).format(value);
    }
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: fractionDigits(currency),
    }).format(value);
  } catch {
    return abs >= 1000 ? `${(value / 1000).toFixed(1)}k` : String(value);
  }
}
