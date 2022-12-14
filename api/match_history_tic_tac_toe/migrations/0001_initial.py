# Generated by Django 4.1.2 on 2022-12-06 20:08

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('games', '0003_match_usermatch_match_users'),
    ]

    operations = [
        migrations.CreateModel(
            name='MatchHistoryTicTacToe',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('player', models.CharField(choices=[('X', 'X'), ('O', 'O')], max_length=1)),
                ('position', models.IntegerField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('match', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='tic_tac_toe_histories', to='games.match')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='tic_tac_toe_histories', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
