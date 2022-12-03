from rest_framework.response import Response
from ..models import *
from ..serializer import ProductSerializer, UserSerializer ,UserWithToken
from rest_framework.decorators import api_view ,permission_classes
from rest_framework.permissions import IsAuthenticated ,IsAdminUser,AllowAny
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.hashers import make_password ,check_password
from rest_framework import status
from django.contrib.auth.models import User
from google.oauth2 import id_token
from google.auth.transport import requests
from rest_framework import exceptions
from rest_framework_simplejwt.tokens import RefreshToken

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):

    def validate(self,attrs):
        data =super().validate(attrs)
        serializer =UserWithToken(self.user).data
        for k , v in serializer.items():
            data[k]=v
        return data

    
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


### profile for user who is signed in
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserProfile(request):
    user =request.user
    serializer =UserSerializer(user , many=False)
    return Response(serializer.data)

### For Edit Profile
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateUserProfile(request):
    user =request.user
    serializer =UserWithToken(user , many=False)
    data =request.data
    user.first_name =data['name']
    user.username =data['email']
    user.email =data['email']
    if data['password'] != "" and user.check_password(data['oldpassword']):
        user.password=make_password(data['password'])
    elif user.check_password(data['oldpassword']) == False and data['oldpassword'] != '':
        return Response({'detail':'old password was wrong'} , status=status.HTTP_403_FORBIDDEN)
    user.save()
    return Response(serializer.data)



## register user
@api_view(['POST'])
def register(request):
    data = request.data
    try:
        user =User.objects.create(
        first_name=data['name'],
        username =data['email'],
        email =data['email'],
        password =make_password(data['password'])
    )
        serializer =UserWithToken(user , many=False)
        return Response(serializer.data)
    except:
        message ={'User With This Email Already Exist'}
        return Response(message , status=status.HTTP_400_BAD_REQUEST)

#### End Authenticated

### all users for admin of website

@api_view(['GET'])
@permission_classes([IsAdminUser])
def getUsers(request):
    users =User.objects.all()
    serializer =UserSerializer(users , many=True)
    return Response(serializer.data)



#### For Admin panel to get user
@api_view(['GET'])
@permission_classes([IsAdminUser])
def getUserByID(request , pk):
    users =User.objects.get(pk=pk)
    serializer =UserSerializer(users , many=False)
    return Response(serializer.data)



#  edit 
@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateUser(request , pk):
    user =User.objects.get(pk=pk)
    data =request.data
    user.first_name =data['name']
    user.username =data['email']
    user.email =data['email']
    user.is_staff =data['isAdmin']
    user.save()

    serializer =UserSerializer(user , many=False)
    return Response(serializer.data)

# delete
@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteuser(request , pk ):
    user =User.objects.get(pk=pk)
    user.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)



@api_view(['POST'])
def gosocial(request):
    token=request.data['token']
    googleUser =id_token.verify_token(token ,requests.Request(),audience=None,clock_skew_in_seconds=2)
    if not googleUser:
            raise exceptions.AuthenticationFailed('unauthenticated')
    user = User.objects.filter(email=googleUser['email']).first()
    if not user:
            user = User.objects.create(
                first_name=googleUser['given_name'],
                last_name=googleUser['family_name'],
                email=googleUser['email']
            )
            user.set_password(token)
            user.save()
    serializer=UserWithToken(user,many=False)
    return Response(serializer.data)







