# Generated by Django 3.1.7 on 2021-05-06 13:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('recycle', '0005_commercialrequest_address'),
    ]

    operations = [
        migrations.AlterField(
            model_name='commercialrequest',
            name='status',
            field=models.CharField(choices=[('A', 'Queued'), ('B', 'In Progress'), ('C', 'Rejected'), ('D', 'Done')], default='A', max_length=1),
        ),
    ]
