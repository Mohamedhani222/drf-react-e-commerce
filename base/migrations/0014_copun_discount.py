# Generated by Django 3.1.14 on 2022-11-12 16:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0013_auto_20221112_1743'),
    ]

    operations = [
        migrations.AddField(
            model_name='copun',
            name='discount',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]