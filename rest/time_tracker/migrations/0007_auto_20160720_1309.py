# -*- coding: utf-8 -*-
# Generated by Django 1.9.7 on 2016-07-20 13:09
from __future__ import unicode_literals

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('time_tracker', '0006_auto_20160720_1259'),
    ]

    operations = [
        migrations.AlterField(
            model_name='timereport',
            name='date',
            field=models.DateField(default=datetime.date.today, null=True, verbose_name='Date'),
        ),
        migrations.AlterField(
            model_name='timereport',
            name='seconds',
            field=models.IntegerField(null=True, verbose_name='Seconds'),
        ),
    ]
