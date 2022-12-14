from rest_framework import serializers
from users.models import MyUser

class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = MyUser
        fields = ("id", "email", "username", "password", "is_login", "profile_img")
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        password = validated_data.pop("password", None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance