# Generated by Django 4.1.2 on 2022-10-26 21:50

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('friends', '0002_alter_friend_invited_by'),
    ]

    operations = [
        migrations.AlterField(
            model_name='friend',
            name='status',
            field=models.CharField(choices=[('pending', 'pending'), ('accepted', 'accepted'), ('declined', 'declined')], default='pending', max_length=10),
        ),
        migrations.AlterUniqueTogether(
            name='friend',
            unique_together={('user', 'friend')},
        ),
    ]