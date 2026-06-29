import Decimal from 'decimal.js';
import dayjs from 'dayjs';
Decimal.set({ precision: 20, rounding: Decimal.ROUND_HALF_UP });

export function calculateLoanSchedule({ totalPrincipal, annualRate, loanDate, termMonths, firstDueDate }) {
  const schedule = [];
  let remainingPrincipal = totalPrincipal;
  let totalInterest = new Decimal(0);
  // Enhanced interest rate handling logic
  const monthlyRate = annualRate.eq(0) ? new Decimal(0) : annualRate.div(12);
  // PMT function implementation
  function pmt(rate, nper, pv) {
    if (rate.eq(0)) {
      if (nper === 0) return new Decimal(0);
      return pv.div(-nper); // Ensure the sign is correct
    }

    const temp = new Decimal(1).plus(rate).pow(nper);
    return pv.mul(rate).mul(temp).div(temp.minus(1)).neg();
  }

  // PPMT function implementation (first period only)
  function ppmtFirstPeriod(rate, nper, pv) {
    if (rate.eq(0)) {
      return pv.div(nper); // Split evenly across the first period
    }
    const denominator = new Decimal(1).plus(rate).pow(nper).minus(1);
    return pv.mul(rate).div(denominator);
  }
  // Enhanced first-period handling (including zero-rate check)
  const daysDiff = dayjs(firstDueDate).diff(dayjs(loanDate), 'day') || 1;

  // First-period principal calculation
  const firstPrincipal = ppmtFirstPeriod(monthlyRate, termMonths, totalPrincipal).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);

  // First-period interest calculation (by day)
  const firstInterest = annualRate.eq(0)
    ? new Decimal(0)
    : totalPrincipal.mul(daysDiff).mul(annualRate).div(360).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);

  // First-period handling
  remainingPrincipal = totalPrincipal.sub(firstPrincipal).toDecimalPlaces(2);

  totalInterest = totalInterest.add(firstInterest);

  schedule.push({
    period: 1,
    payment: firstPrincipal.add(firstInterest).toDecimalPlaces(2).toNumber(),
    principal: firstPrincipal.toNumber(),
    interest: firstInterest.toNumber(),
    remainingPrincipal: remainingPrincipal.toNumber(),
  });

  if (termMonths > 1) {
    const remainingTerm = termMonths - 1;
    const pmtVal = pmt(monthlyRate, remainingTerm, remainingPrincipal.neg()).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
    // Special handling for zero interest rate
    const isZeroRate = monthlyRate.eq(0);
    const fixedPrincipal = isZeroRate ? remainingPrincipal.div(remainingTerm).toDecimalPlaces(2) : new Decimal(0);
    for (let period = 2; period <= termMonths; period++) {
      const isLast = period === termMonths;
      let interest = new Decimal(0);
      let principal;
      if (!isZeroRate) {
        interest = remainingPrincipal.mul(monthlyRate).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
      }
      if (isLast) {
        principal = remainingPrincipal.toDecimalPlaces(2);
      } else if (isZeroRate) {
        principal = fixedPrincipal;
      } else {
        principal = pmtVal.sub(interest).toDecimalPlaces(2);
        // Principal protection logic
        if (principal.gt(remainingPrincipal)) {
          principal = remainingPrincipal.toDecimalPlaces(2);
        }
      }
      const payment = principal.add(interest).toDecimalPlaces(2);
      remainingPrincipal = remainingPrincipal.sub(principal).toDecimalPlaces(2);
      schedule.push({
        period,
        payment: payment.toNumber(),
        principal: principal.toNumber(),
        interest: interest.toNumber(),
        remainingPrincipal: remainingPrincipal.toNumber(),
      });

      totalInterest = totalInterest.add(interest);
    }
  }
  // Handle floating-point errors (zero out the last period)
  if (schedule.length > 0) {
    const last = schedule[schedule.length - 1];
    if (new Decimal(last.remainingPrincipal).gt(0)) {
      last.principal = new Decimal(last.principal).add(last.remainingPrincipal);
      last.payment = new Decimal(last.payment).add(last.remainingPrincipal);
      last.remainingPrincipal = new Decimal(0);
    }
  }

  return {
    schedule,
    totalInterest: totalInterest.toDecimalPlaces(2),
  };
}

export function calculateStandardSchedule({ totalPrincipal, annualRate, totalPeriods }) {
  // PMT function implementation (supports zero interest rate)
  const getPMT = (rate, periods, presentValue) => {
    if (rate.eq(0)) return presentValue.div(periods).neg();
    const exponent = new Decimal(1).plus(rate).pow(periods);
    return presentValue.mul(rate).mul(exponent).div(exponent.minus(1)).neg();
  };
  // Create a standard equal-installment (principal + interest) schedule
  const createStandardSchedule = (total, rate, periods) => {
    const pmt = getPMT(rate, periods, total.neg()).toDecimalPlaces(2);
    const schedule = [];
    let remaining = total;
    let totalInterest = new Decimal(0);
    for (let i = 1; i <= periods; i++) {
      const isLast = i === periods;
      const interest = remaining.mul(rate).toDecimalPlaces(2);
      const principal = isLast ? remaining : pmt.minus(interest).toDecimalPlaces(2);

      schedule.push({
        period: i,
        payment: principal.plus(interest).toNumber(),
        principal: principal.toNumber(),
        interest: interest.toNumber(),
        remainingPrincipal: remaining.sub(principal).toNumber(),
      });
      totalInterest = totalInterest.plus(interest);
      remaining = remaining.sub(principal);
    }
    // Final-period calibration
    if (schedule.length > 0) {
      const last = schedule[schedule.length - 1];
      if (!new Decimal(last.remainingPrincipal).eq(0)) {
        last.principal = new Decimal(last.principal).plus(last.remainingPrincipal).toNumber();
        last.payment = new Decimal(last.payment).plus(last.remainingPrincipal).toNumber();
        last.remainingPrincipal = 0;
      }
    }
    return { schedule, totalInterest: totalInterest.toDecimalPlaces(2) };
  };
  // Main calculation function
  const monthlyRate = annualRate.div(12);
  return createStandardSchedule(totalPrincipal, monthlyRate, totalPeriods);
}
