# Generated by Django 4.1.2 on 2022-12-09 03:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('games', '0003_match_usermatch_match_users'),
    ]

    operations = [
        migrations.AddField(
            model_name='usermatch',
            name='diffculty',
            field=models.CharField(choices=[('normal', 'normal'), ('medium', 'medium'), ('hard', 'hard')], default='normal', max_length=6),
        ),
    ]
