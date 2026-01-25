export default function formatPrice(value?: number | null) {
  if (value === null || value === undefined) return "0";

  const num = Number(value);
  if (isNaN(num)) return "0";

  if (num >= 1_000_000_000)
    return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
  if (num >= 1_000_000)
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "k";

  return num.toString();
}
