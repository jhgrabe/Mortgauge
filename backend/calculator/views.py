from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from . import finance
from .serializers import AffordabilityInputSerializer, PaymentInputSerializer


@api_view(['GET'])
def health(request):
    """Confirms the API is up. The frontend pings this on page load."""
    return Response({'status': 'ok'})


@api_view(['POST'])
def payment(request):
    """Monthly principal & interest payment for a fixed-rate loan."""
    serializer = PaymentInputSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    inputs = serializer.validated_data

    breakdown = finance.piti(
        principal=inputs['principal'],
        annual_rate=inputs['annual_rate'],
        years=inputs['years'],
        annual_taxes=inputs['annual_taxes'],
        annual_insurance=inputs['annual_insurance'],
        monthly_hoa=inputs['monthly_hoa'],
    )

    # Send every money value as a string to avoid float coercion.
    return Response({k: str(v) for k, v in breakdown.items()})


@api_view(['POST'])
def affordability(request):
    """Max home price and DTI ratio, via the 28/36 rule."""
    serializer = AffordabilityInputSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    inputs = serializer.validated_data

    result = finance.affordability(
        annual_income=inputs['annual_income'],
        monthly_debts=inputs['monthly_debts'],
        down_payment=inputs['down_payment'],
        annual_rate=inputs['annual_rate'],
        years=inputs['years'],
        annual_taxes=inputs['annual_taxes'],
        annual_insurance=inputs['annual_insurance'],
        monthly_hoa=inputs['monthly_hoa'],
    )

    # Every Decimal crosses the API as a string, including inside the schedule rows.
    schedule = [{k: str(v) for k, v in row.items()} for row in result.pop('schedule')]
    return Response({
        **{k: str(v) for k, v in result.items()},
        'schedule': schedule,
    })
