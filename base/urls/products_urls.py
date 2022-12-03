from django.urls import path
from base.views import products_views

urlpatterns = [
    path('', products_views.getProducts),
    path('topproducts', products_views.getTopProducts),
    path('copons', products_views.getCoupons, name='copons'),
    path('addcopon/<str:pk>/', products_views.verifycopon, name='copons'),
    path('admin', products_views.getProductsAdmin, name='products-admin'),
    path('product/<str:pk>', products_views.getProductAdmin, name='product-admin'),
    path('product/<str:pk>/reviews', products_views.CreateReviewForProduct),
    path('create', products_views.createProduct, name='product-create'),
    path('upload', products_views.Uploadimage, name='image-upload'),
    path('<str:pk>', products_views.getProduct, name='product'),
    path('delete/<str:pk>', products_views.deleteProduct, name='product-delete'),
    path('update/<str:pk>', products_views.updateProduct, name='product-update'),
]
