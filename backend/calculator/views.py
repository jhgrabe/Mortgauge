from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(['GET'])
def health(request):
    """Confirms the API is up. The frontend pings this on page load."""
    return Response({'status': 'ok'})
