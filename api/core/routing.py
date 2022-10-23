from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter

import chats.routings

application = ProtocolTypeRouter({
  'websocket': AuthMiddlewareStack(
    URLRouter(
      chats.routings.websocket_urlpatterns
    )
  )
})