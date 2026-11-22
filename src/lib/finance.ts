/** Illustrative amortising loan repayment. rate = annual % (e.g. 9.5). */
export function calcRepayment(amount: number, annualRate: number, months: number, fee = 0) {
  const r = annualRate / 100 / 12;
  const monthly = r === 0 ? amount / months : (amount * r) / (1 - Math.pow(1 + r, -months));
  const totalRepaid = monthly * months + fee;
  return { monthly, totalRepaid, totalCost: totalRepaid - amount };
}

export const gbp = (n: number) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(n);

/** Invoice finance: upfront advance and estimated fees for one invoice. */
export function calcInvoice(invoice: number, advancePct: number, serviceFeePct: number, annualDiscountPct: number, days: number) {
  const advance = invoice * (advancePct / 100);
  const serviceFee = invoice * (serviceFeePct / 100);
  const discount = advance * (annualDiscountPct / 100) * (days / 365);
  const fees = serviceFee + discount;
  return { advance, fees, balance: invoice - advance - fees };
}

/** Asset finance (hire purchase style): deposit up front, optional balloon at end. */
export function calcAsset(price: number, deposit: number, annualRate: number, months: number, balloon = 0) {
  const financed = price - deposit;
  const r = annualRate / 100 / 12;
  const pvBalloon = r === 0 ? balloon : balloon / Math.pow(1 + r, months);
  const base = financed - pvBalloon;
  const monthly = r === 0 ? base / months : (base * r) / (1 - Math.pow(1 + r, -months));
  const totalPaid = deposit + monthly * months + balloon;
  return { financed, monthly, totalPaid, totalCost: totalPaid - price };
}
