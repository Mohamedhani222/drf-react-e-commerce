from django.urls import path , include
from base.views import users_views as views

urlpatterns = [
    path('' , views.getUsers , name='get-users'),
    path('google-auth',views.gosocial),
    path('profile/' , views.getUserProfile , name='get-user'),
    path('profile/update' , views.updateUserProfile , name='update-user'),
    path('register' , views.register , name='register'),
    path('login', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('<str:pk>',views.getUserByID, name='get-user-byId'),
    path('update/<str:pk>',views.updateUser, name='update-user-byadmin'),
    path('delete/<str:pk>',views.deleteuser, name='delete-user'),

]


