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


def piti(principal, annual_rate, years,
         annual_taxes=Decimal('0'), annual_insurance=Decimal('0'),
         monthly_hoa=Decimal('0')):
    """Return a breakdown of the full monthly housing payment (PITI).

    Taxes and insurance are billed annually but paid monthly via escrow,
    so each is divided by 12. HOA is already a monthly figure.
    """
    pi = monthly_payment(principal, annual_rate, years)
    monthly_taxes = (annual_taxes / 12).quantize(Decimal('0.01'))
    monthly_insurance = (annual_insurance / 12).quantize(Decimal('0.01'))
    monthly_hoa = monthly_hoa.quantize(Decimal('0.01'))
    total = pi + monthly_taxes + monthly_insurance + monthly_hoa
    return {
        'principal_and_interest': pi,
        'taxes': monthly_taxes,
        'insurance': monthly_insurance,
        'hoa': monthly_hoa,
        'total': total.quantize(Decimal('0.01')),
    }