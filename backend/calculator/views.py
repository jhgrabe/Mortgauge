from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from . import finance
from .serializers import PaymentInputSerializer


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
