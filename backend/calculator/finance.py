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


def max_loan_amount(monthly_pi_payment, annual_rate, years):
    """Inverse of monthly_payment(): given a target P&I payment, return the
    largest loan that payment supports.

    Same formula as monthly_payment(), solved for principal instead of
    payment.
    """
    if monthly_pi_payment <= 0:
        return Decimal('0.00')
    if annual_rate == 0:
        return (monthly_pi_payment * years * 12).quantize(Decimal('0.01'))
    monthly_rate = annual_rate / Decimal('100') / Decimal('12')
    num_payments = years * 12
    growth = (1 + monthly_rate) ** num_payments
    principal = monthly_pi_payment * (growth - 1) / (monthly_rate * growth)
    return principal.quantize(Decimal('0.01'))


def affordability(annual_income, monthly_debts, down_payment, annual_rate, years,
                   annual_taxes=Decimal('0'), annual_insurance=Decimal('0'),
                   monthly_hoa=Decimal('0')):
    """Return max home price and DTI using the 28/36 rule.

    Front-end ratio: housing payment (PITI) <= 28% of gross monthly income.
    Back-end ratio: housing payment + other debts <= 36% of gross monthly
    income. The lower of the two limits wins.
    """
    monthly_income = annual_income / 12
    front_end_limit = monthly_income * Decimal('0.28')
    back_end_limit = monthly_income * Decimal('0.36') - monthly_debts
    max_piti = max(min(front_end_limit, back_end_limit), Decimal('0'))

    monthly_taxes = annual_taxes / 12
    monthly_insurance = annual_insurance / 12
    max_pi = max(max_piti - monthly_taxes - monthly_insurance - monthly_hoa, Decimal('0'))

    max_loan = max_loan_amount(max_pi, annual_rate, years)
    max_home_price = max_loan + down_payment

    dti = ((max_piti + monthly_debts) / monthly_income * 100) if monthly_income > 0 else Decimal('0')

    return {
        'max_home_price': max_home_price.quantize(Decimal('0.01')),
        'max_loan_amount': max_loan.quantize(Decimal('0.01')),
        'max_monthly_piti': max_piti.quantize(Decimal('0.01')),
        'dti_ratio': dti.quantize(Decimal('0.01')),
    }


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