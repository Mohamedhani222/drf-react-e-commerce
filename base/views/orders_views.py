from datetime import datetime
from rest_framework.response import Response
from base.serializer import OrderSerializer
from base.models import *
from base.serializer import ProductSerializer 
from rest_framework.decorators import api_view ,permission_classes
from rest_framework.permissions import IsAuthenticated ,IsAdminUser
from rest_framework import status


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_order(request):
    user =request.user
    data =request.data
    OrderItems =data['OrderItems']
    if OrderItems and len(OrderItems) == 0:
        return Response({'details':'No Order Items'} , status=status.HTTP_400_BAD_REQUEST)
    else:
# (1) Create Order
        order = Order.objects.create(
            user =user,
            paymentMethod=data['paymentMethod'],
            taxPrice=data['taxPrice'],
            shippingPrice=data['shippingPrice'],
            totalPrice=data['totalPrice']
        )

# 2) Create shipping address
        shipping =ShippingAddress.objects.create(
            order= order,
            address=data['shippingaddress']['address'],
            city =data['shippingaddress']['city'],
            PostalCode=data['shippingaddress']['postalcode'],
            Country=data['shippingaddress']['country'],
        )
# (3) connect order items with product 
        for x in OrderItems:
            product =Product.objects.get(_id=x['product'])

            item =OrderItem.objects.create(
                product=product,
                order=order,
                name=product.name,
                qty =x['qty'],
                price =x['price'],
                image =product.image.url
            )
        #(4) update stock
            product.countInStock -= item.qty
            product.save()

        serializer=OrderSerializer(order ,many=False)
        return Response(serializer.data)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getOrderById(request , pk):
    try:
            
        user=request.user
        order = Order.objects.get(_id=pk)
        if user.is_staff or order.user == user :
            serializer =OrderSerializer(order , many=False)
            return Response(serializer.data)
        else :
            return Response({'details':'Not have permission to see This Order'} , status=status.HTTP_400_BAD_REQUEST)
    except:
        return Response ({'detail':' Order Not Exist '} , status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getMyOrders(request):
    user =request.user
    orders =Order.objects.all().filter(user=user )
    serializer=OrderSerializer(orders ,many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def getOrders(request):
    orders =Order.objects.all()
    serializer=OrderSerializer(orders ,many=True)
    return Response(serializer.data)



@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def UpdateOrderToPaid(request ,pk):
    order=Order.objects.get(_id=pk)
    order.isPaid =True
    order.paidAt =datetime.now()
    order.save()
    return Response('Order Was paid Successfully')



@api_view(['PUT'])
@permission_classes([IsAdminUser])
def UpdateOrderToDelivered(request ,pk):
    order=Order.objects.get(_id=pk)
    order.isDelivered =True
    order.deliveredAt =datetime.now()
    order.save()
    return Response('Order In the way')



