import currency from "currency.js";

const formatMoney = (amount: number, currencyCode: string) => {
  const symbol = currencyCode === "GBP" ? "₮" : "₮";

  return currency(amount, {
    symbol,
    precision: 3,
    separator: ",",
    decimal: ".",
  }).format();
};

export default formatMoney;
