"""Financial formulas. All money math uses Decimal — never float."""
from decimal import Decimal


def monthly_payment(principal, annual_rate, years):
    """Return the monthly principal & interest payment as a Decimal.

    principal: loan amount, e.g. Decimal('300000')
    annual_rate: yearly interest rate as a percentage, e.g. Decimal('6.5')
    years: loan term in years, e.g. 30 (int)

    YOUR TURN — hints:
    1. Convert annual_rate (a percent!) to a monthly rate.
    2. Convert years to a number of monthly payments.
    3. Apply the fixed-rate mortgage payment formula.
    4. annual_rate == 0 needs its own branch — try it in the formula
       and see what breaks, then think about what the payment should
       obviously be when no interest is charged.
    5. Round to cents at the end: value.quantize(Decimal('0.01'))

    Sanity check: 300000 at 6.5 for 30 years ≈ 1896.20
    """
    raise NotImplementedError
