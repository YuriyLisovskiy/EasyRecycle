# Generated by Django 3.1.7 on 2021-05-09 14:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0006_auto_20210506_1339'),
    ]

    operations = [
        migrations.AlterField(
            model_name='usermodel',
            name='avatar_info',
            field=models.CharField(max_length=50),
        ),
    ]