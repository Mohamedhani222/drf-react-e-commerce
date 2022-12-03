from rest_framework import serializers
from .models import *
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils import timezone

class UserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField(read_only=True)
    _id = serializers.SerializerMethodField(read_only=True)
    isAdmin = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model=User
        fields =['id' ,'_id','username' ,'email' ,'name' ,'isAdmin']

    def get_isAdmin(self,obj):
        return obj.is_staff
    
    def get__id(self,obj):
        return obj.id

    def get_name(self , obj):
        name =obj.first_name
        if name =='':
            name =obj.email
        return name

class UserWithToken(UserSerializer):
    token =serializers.SerializerMethodField(read_only=True)
    class Meta:
        model=User
        fields =['id' ,'_id','username' ,'email' ,'name' ,'isAdmin' ,'token']
    
    def get_token(self,obj):
        token =RefreshToken.for_user(obj)
        return str(token.access_token)


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model =Review
        fields ='__all__'

class CopunSerializer(serializers.ModelSerializer):
    is_valid=serializers.SerializerMethodField(read_only=True)
    class Meta:
        model =Copun
        fields =['code','validfrom','validto','is_valid']
    def get_is_valid(self,obj):
        if obj.validto < timezone.now():
            return False
        else:
            return True



class ProductSerializer(serializers.ModelSerializer):
    reviews =serializers.SerializerMethodField(read_only=True)
    class Meta:
        model =Product
        fields ='__all__'

    def get_reviews(self,obj):
        reviews = obj.review_set.all()
        serializer = ReviewSerializer(reviews, many=True)
        return serializer.data

class ShippingAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model =ShippingAddress
        fields ='__all__'


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model =OrderItem
        fields ='__all__'



class OrderSerializer(serializers.ModelSerializer):
    OrderItems =serializers.SerializerMethodField(read_only=True)
    shippingaddress =serializers.SerializerMethodField(read_only=True)
    user =serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = Order
        fields =['user','paymentMethod','taxPrice','shippingPrice','totalPrice','isPaid','paidAt','isDelivered','deliveredAt','createdAt','_id','copun','shippingaddress','OrderItems']
        
    def get_OrderItems(self , obj):
        items =obj.orderitem_set.all()
        serializer =OrderItemSerializer(items,many=True)
        return serializer.data
    
    def get_shippingaddress(self , obj):
        try:
            address =ShippingAddressSerializer(obj.shippingaddress,many=False).data  ## i make mistake here is not writing (.data)
        except:
            address=False
        return address
    def get_user(self,obj):
        user = UserSerializer(obj.user ,many=False)
        return user.data
























