from django.db.models.signals import pre_save
from django.contrib.auth.models import User


def update_user(sender ,instance,**kwargs ):
    user =instance
    if user.email !="":
         user.username=user.email
         print('done')
pre_save.connect(update_user ,sender=User)