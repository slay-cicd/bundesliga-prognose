export function formatPrice(price: number, currency: string = "$"): string {
  if (currency === "") {
    // Forex pairs
    return price.toFixed(4);
  }
  if (price >= 10000) {
    return `${currency}${price.toLocaleString("de-DE", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  }
  if (price >= 100) {
    return `${currency}${price.toLocaleString("de-DE", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
  }
  if (price >= 1) {
    return `${currency}${price.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  return `${currency}${price.toLocaleString("de-DE", { minimumFractionDigits: 4, maximumFractionDigits: 4 })}`;
}

export function formatChange(change: number): string {
  const sign = change >= 0 ? "+" : "";
  return `${sign}${change.toFixed(1)}%`;
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatCents(cents: number): string {
  return `${cents}¢`;
}
