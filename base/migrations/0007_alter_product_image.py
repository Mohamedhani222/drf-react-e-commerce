# Generated by Django 4.0.6 on 2022-10-25 19:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0006_rename_catregory_product_category'),
    ]

    operations = [
        migrations.AlterField(
            model_name='product',
            name='image',
            field=models.ImageField(blank=True, default='/backend/static/images/download (1).png', null=True, upload_to=''),
        ),
    ]
