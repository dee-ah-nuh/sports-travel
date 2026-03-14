/** Format a price number into a locale currency string */
export function formatPrice(amount: number, currency = 'USD', locale = 'en-US'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Format a price range like "$120 – $450" */
export function formatPriceRange(
  min: number,
  max: number,
  currency = 'USD',
  locale = 'en-US',
): string {
  if (min === max) return formatPrice(min, currency, locale);
  return `${formatPrice(min, currency, locale)} – ${formatPrice(max, currency, locale)}`;
}

/** Get currency symbol only */
export function getCurrencySymbol(currency = 'USD', locale = 'en-US'): string {
  return (0)
    .toLocaleString(locale, { style: 'currency', currency, minimumFractionDigits: 0 })
    .replace(/\d/g, '')
    .trim();
}
