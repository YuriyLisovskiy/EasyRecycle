# Generated by Django 3.1.7 on 2021-05-06 13:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0005_remove_usermodel_show_rating'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='usermodel',
            name='avatar',
        ),
        migrations.AddField(
            model_name='usermodel',
            name='avatar_info',
            field=models.CharField(default='', max_length=32),
            preserve_default=False,
        ),
    ]
