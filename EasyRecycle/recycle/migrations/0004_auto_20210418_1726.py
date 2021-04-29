# Generated by Django 3.1.7 on 2021-04-18 17:26

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('recycle', '0003_transaction_mass'),
    ]

    operations = [
        migrations.CreateModel(
            name='GarbageType',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('garbage_type', models.CharField(choices=[('OR', 'Organic'), ('GL', 'Glass'), ('ME', 'Metal'), ('PA', 'Paper'), ('PL', 'Plastic')], default='OR', max_length=2)),
            ],
        ),
        migrations.RemoveField(
            model_name='commercialrequest',
            name='service',
        ),
        migrations.AddField(
            model_name='commercialrequest',
            name='location',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='recycle.location'),
        ),
        migrations.AddField(
            model_name='commercialrequest',
            name='mass',
            field=models.FloatField(default=0.0),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='location',
            name='price_per_kg',
            field=models.FloatField(default=0),
        ),
        migrations.DeleteModel(
            name='Service',
        ),
        migrations.AddField(
            model_name='garbagetype',
            name='location',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='recycle.location'),
        ),
    ]