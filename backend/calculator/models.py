from django.db import models


class Scenario(models.Model):
    """A named, saved set of affordability inputs.

    Results (max price, DTI, schedule) aren't stored — they're derived from
    these inputs by finance.affordability() whenever a scenario is loaded,
    so the numbers never go stale if a formula changes.
    """
    name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    annual_income = models.DecimalField(max_digits=12, decimal_places=2)
    monthly_debts = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    down_payment = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    annual_rate = models.DecimalField(max_digits=6, decimal_places=3)
    years = models.IntegerField()
    annual_taxes = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    annual_insurance = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    monthly_hoa = models.DecimalField(max_digits=8, decimal_places=2, default=0)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.name
