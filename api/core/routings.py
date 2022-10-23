from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter

import friends.routings

application = ProtocolTypeRouter({
  'websocket': AuthMiddlewareStack(
    URLRouter(
      friends.routings.websocket_urlpatterns,
    )
  )
})