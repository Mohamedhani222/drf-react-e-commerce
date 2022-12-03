import decimal
from rest_framework.response import Response
from base.models import *
from base.serializer import ProductSerializer, CopunSerializer, OrderSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework import status
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.db.models import Count


@api_view(['GET'])
def getProducts(request):
    query = request.query_params.get('keyword')
    if query == None:
        query = ''
    products = Product.objects.all().filter(show=True, name__icontains=query)
    page = request.query_params.get('page')
    paginator = Paginator(products, 4)
    try:
        products = paginator.page(page)
    except PageNotAnInteger:
        products = paginator.page(1)
    except EmptyPage:
        products = paginator.page(paginator.num_pages)
    if page == None:
        page = 1
    page = int(page)

    serializer = ProductSerializer(products, many=True)
    return Response({'products': serializer.data, 'page': page, 'pages': paginator.num_pages})

@api_view(['GET'])
def getTopProducts(request):
    products=Product.objects.filter(rating__gte=2).order_by('-rating')[:5]
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def addProducts(request):
    serializer = ProductSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors)


@api_view(['GET'])
def getProduct(request, pk):
    product = Product.objects.get(_id=pk, show=True)
    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)


####### For Admin Page ###########

@api_view(['GET'])
@permission_classes([IsAdminUser])
def getProductAdmin(request, pk):
    product = Product.objects.get(pk=pk)
    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def getProductsAdmin(request):
    query = request.query_params.get('keyword')
    if query == None:
        query = ''
    products = Product.objects.all().filter(name__icontains=query)
    page = request.query_params.get('page')
    paginator = Paginator(products, 5)
    try:
        products = paginator.page(page)
    except PageNotAnInteger:
        products = paginator.page(1)
    except EmptyPage:
        products = paginator.page(paginator.num_pages)
    if page == None:
        page = 1
    page = int(page)

    serializer = ProductSerializer(products, many=True)
    return Response({'products': serializer.data, 'page': page, 'pages': paginator.num_pages})


@api_view(['POST'])
@permission_classes([IsAdminUser])
def createProduct(request):
    user = request.user
    product = Product.objects.create(
        user=user,
        name='Sample Name',
        price=0,
        brand='Sample Brand',
        countInStock=0,
        category='Sample Category',
        describtion=''
    )
    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)


@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateProduct(request, pk):
    data = request.data
    product = Product.objects.get(_id=pk)

    product.name = data['name']
    product.price = data['price']
    product.brand = data['brand']
    product.category = data['category']
    product.describtion = data['describtion']
    product.countInStock = data['countInStock']
    product.show = data['show']
    product.save()
    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)


@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteProduct(request, pk):
    product = Product.objects.get(_id=pk)
    product.delete()
    return Response('Product Deleted')


@api_view(['POST'])
def Uploadimage(request):
    data = request.data
    product_id = data['product_id']
    product = Product.objects.get(_id=product_id)
    product.image = request.FILES.get('image')
    product.save()
    return Response('Image was uploaded successfully')


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def CreateReviewForProduct(request, pk):
    data = request.data
    user = request.user
    product = Product.objects.get(_id=pk)
    comment = data['comment']
# (1) check if review already exist
    Existreview = Review.objects.filter(product=product, user=user).exists()
    if Existreview:
        return Response({'detail': 'Product Already Reviewed !'}, status=status.HTTP_400_BAD_REQUEST)
    elif data['rating'] == 0:
        return Response({'detail': 'You Must rate The Product'}, status=status.HTTP_400_BAD_REQUEST)
    elif data['rating'] == None:
        return Response({'detail': 'You Must rate The Product'}, status=status.HTTP_400_BAD_REQUEST)
    else:
        review = Review.objects.create(
            product=product,
            user=user,
            name=user.first_name,
            rating=data['rating'],
            comment=comment
        )
        reviews = Review.objects.filter(product=product)
        product.numReviews = len(reviews)
        total = 0

        for i in reviews:
            total += i.rating  # هنا بحسب عدد الستارز بتوع العملاء كلهم

        product.rating = total / len(reviews)
        product.save()

        return Response('Review Added')


@api_view(['GET'])
def getCoupons(request):
    copuns = Copun.objects.all()
    serializer = CopunSerializer(copuns, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def verifycopon(request, pk):
    data = request.data
    user = request.user
    order = Order.objects.get(
        _id=pk, user=user, isDelivered=False, isPaid=False)
    print(data['copon'])
    copun = Copun.objects.filter(code=data['copon'])
    if not copun.exists():
        return Response({'detail': 'Copun is Not Vaild '}, status=status.HTTP_400_BAD_REQUEST)
    code = Copun.objects.get(code=data['copon'])
    if code.validto < timezone.now():
        return Response({'detail': 'Copun is Expired'}, status=status.HTTP_400_BAD_REQUEST)
    elif order.copun != None:
        return Response({'detail': 'You Already Add Coupon '}, status=status.HTTP_400_BAD_REQUEST)
    elif order.totalPrice < 1000:
        return Response({'detail': 'You must order items with 1000$ to put copon'}, status=status.HTTP_400_BAD_REQUEST)

    else:
        Total = order.totalPrice - \
            (decimal.Decimal(code.discount) / 100) * order.totalPrice
        order.copun = code
        order.totalPrice = Total
        order.save()
        return Response({'detail': 'Copon Added Successfully '}, status=status.HTTP_200_OK)
