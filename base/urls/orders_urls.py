from django.urls import path
from base.views import orders_views as views


urlpatterns = [

    path('' ,views.getOrders ),
    path('add' , views.add_order , name='add-order'),
    path('<str:pk>/' , views.getOrderById , name='get-order'),
    path('<str:pk>/pay/' , views.UpdateOrderToPaid , name='updateordertopaid'),
    path('<str:pk>/deliver/' , views.UpdateOrderToDelivered , name='UpdateOrderToDelivered'),
    path('myorders' ,views.getMyOrders , name='get-orders')
]
