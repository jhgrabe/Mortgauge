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

    try:
        monthly = finance.monthly_payment(
            principal=inputs['principal'],
            annual_rate=inputs['annual_rate'],
            years=inputs['years'],
        )
    except NotImplementedError:
        return Response(
            {'detail': 'monthly_payment() is not written yet — see calculator/finance.py'},
            status=status.HTTP_501_NOT_IMPLEMENTED,
        )

    # JSON has no decimal type — send money as a string ("1896.20")
    # so nothing downstream coerces it back into a float.
    return Response({'monthly_payment': str(monthly)})
