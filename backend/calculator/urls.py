from django.urls import path

from . import views

urlpatterns = [
    path('health/', views.health, name='health'),
    path('payment/', views.payment, name='payment'),
    path('affordability/', views.affordability, name='affordability'),
    path('scenarios/', views.ScenarioListCreate.as_view(), name='scenarios'),
]
