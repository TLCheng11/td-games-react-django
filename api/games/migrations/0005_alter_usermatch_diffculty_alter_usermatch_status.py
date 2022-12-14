# Generated by Django 4.1.2 on 2022-12-12 02:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('games', '0004_usermatch_diffculty'),
    ]

    operations = [
        migrations.AlterField(
            model_name='usermatch',
            name='diffculty',
            field=models.CharField(choices=[('hard', 'hard'), ('normal', 'normal'), ('medium', 'medium')], default='normal', max_length=6),
        ),
        migrations.AlterField(
            model_name='usermatch',
            name='status',
            field=models.CharField(choices=[('pending', 'pending'), ('accepted', 'accepted'), ('declined', 'declined'), ('finished', 'finished')], default='pending', max_length=10),
        ),
    ]
