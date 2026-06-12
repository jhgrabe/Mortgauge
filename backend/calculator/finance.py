"""Financial formulas. All money math uses Decimal — never float."""
from decimal import Decimal


def monthly_payment(principal, annual_rate, years):
    """Return the monthly principal & interest payment as a Decimal.

    principal: loan amount, e.g. Decimal('300000')
    annual_rate: yearly interest rate as a percentage, e.g. Decimal('6.5')
    years: loan term in years, e.g. 30 (int)

    annual rate to monthly rate: divide by 100 to get a decimal, then divide by 12 to get monthly
      years to months: multiply by 12
    """
    if annual_rate == 0:
        zero_interest = principal / (years * 12)
        return zero_interest.quantize(Decimal('0.01'))
    monthly_rate = annual_rate / Decimal('100') / Decimal('12')
    num_payments = years * 12
    payment = principal * (monthly_rate * (1 + monthly_rate) ** num_payments) / ((1 + monthly_rate) ** num_payments - 1)
    return payment.quantize(Decimal('0.01'))