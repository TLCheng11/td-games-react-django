from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter

import friends.routings, users.routings, chats.routings, match_history_tic_tac_toe.routings

urlpatterns = friends.routings.websocket_urlpatterns + users.routings.websocket_urlpatterns + chats.routings.websocket_urlpatterns + match_history_tic_tac_toe.routings.websocket_urlpatterns

application = ProtocolTypeRouter({
  'websocket': AuthMiddlewareStack(
    URLRouter(
      urlpatterns
    )
  )
})