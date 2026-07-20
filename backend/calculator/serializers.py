from decimal import Decimal

from rest_framework import serializers

from .models import Scenario


class PaymentInputSerializer(serializers.Serializer):
    """Validates the inputs for the monthly payment calculation.

    DecimalField parses the incoming JSON values straight into Decimal,
    so the view and finance.py never touch floats.
    """
    principal = serializers.DecimalField(
        max_digits=12, decimal_places=2, min_value=Decimal('1'),
    )
    annual_rate = serializers.DecimalField(
        max_digits=6, decimal_places=3,
        min_value=Decimal('0'), max_value=Decimal('30'),
    )
    years = serializers.IntegerField(min_value=1, max_value=50)
    annual_taxes = serializers.DecimalField(
        max_digits=10, decimal_places=2, min_value=Decimal('0'),
        required=False, default=Decimal('0'),
    )
    annual_insurance = serializers.DecimalField(
        max_digits=10, decimal_places=2, min_value=Decimal('0'),
        required=False, default=Decimal('0'),
    )
    monthly_hoa = serializers.DecimalField(
        max_digits=8, decimal_places=2, min_value=Decimal('0'),
        required=False, default=Decimal('0'),
    )


class ScenarioSerializer(serializers.ModelSerializer):
    """Saves and lists Scenarios. Field-level validation (max_digits,
    decimal_places) comes straight from the model, so it can't drift out
    of sync with the database.
    """
    class Meta:
        model = Scenario
        fields = [
            'id', 'name', 'created_at',
            'annual_income', 'monthly_debts', 'down_payment',
            'annual_rate', 'years',
            'annual_taxes', 'annual_insurance', 'monthly_hoa',
        ]
        read_only_fields = ['id', 'created_at']


class AffordabilityInputSerializer(serializers.Serializer):
    """Validates the inputs for the max-affordable-price calculation."""
    annual_income = serializers.DecimalField(
        max_digits=12, decimal_places=2, min_value=Decimal('1'),
    )
    monthly_debts = serializers.DecimalField(
        max_digits=10, decimal_places=2, min_value=Decimal('0'),
        required=False, default=Decimal('0'),
    )
    down_payment = serializers.DecimalField(
        max_digits=12, decimal_places=2, min_value=Decimal('0'),
        required=False, default=Decimal('0'),
    )
    annual_rate = serializers.DecimalField(
        max_digits=6, decimal_places=3,
        min_value=Decimal('0'), max_value=Decimal('30'),
    )
    years = serializers.IntegerField(min_value=1, max_value=50)
    annual_taxes = serializers.DecimalField(
        max_digits=10, decimal_places=2, min_value=Decimal('0'),
        required=False, default=Decimal('0'),
    )
    annual_insurance = serializers.DecimalField(
        max_digits=10, decimal_places=2, min_value=Decimal('0'),
        required=False, default=Decimal('0'),
    )
    monthly_hoa = serializers.DecimalField(
        max_digits=8, decimal_places=2, min_value=Decimal('0'),
        required=False, default=Decimal('0'),
    )
