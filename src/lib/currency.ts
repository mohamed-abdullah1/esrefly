import isSiteArabic from "./is-site-arabic";

export default function format(amount: number) {
  return new Intl.NumberFormat(isSiteArabic() ? "ar-SA" : "en-SA", {
    style: "currency",
    currency: "SAR", // Use 'USD' for US dollars
    currencyDisplay: "narrowSymbol", // Display the currency symbol ($)
    minimumFractionDigits: 0, // No decimal places
  }).format(amount);
}
