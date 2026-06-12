from decimal import Decimal

from rest_framework import serializers


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
