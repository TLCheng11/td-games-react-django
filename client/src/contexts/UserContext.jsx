import { createContext, useEffect, useState } from "react";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState({});
  const [userSocket, setUserSocket] = useState({});
  const [userFriendOnlineStatus, setUserFriendOnlineStatus] = useState({});
  const [unreadMessages, setUnreadMessages] = useState([]);
  const [friendListRefresh, setFriendListRefresh] = useState(true);

  // create a websocket when user login
  // update user status to logout when websocket disconnect
  useEffect(() => {
    if (currentUser.id) {
      // for reference
      // deployed: ws://54.210.20.214:8021/ws/users/
      // dev: ws://localhost:8021/ws/users/

      const socket = new WebSocket(
        `${process.env.REACT_APP_WEBSOCKET}` +
          "users/" +
          currentUser.username +
          "/"
      );

      // setup responds for different userSocket action
      socket.onmessage = function (e) {
        const data = JSON.parse(e.data);
        if (data.action === "friend_login_or_logout") {
          setUserFriendOnlineStatus({
            ...userFriendOnlineStatus,
            [data.username]: data.is_login,
          });
        } else if (data.action === "friend_invite") {
          // TODO
          // can update the friendlist and friend invite list base on data instead of refresh the fetch
          if (data.update) {
            setFriendListRefresh((state) => !state);
          }
        } else if (data.action === "update_read_message") {
          setUnreadMessages((m) => m.filter((m) => m.id !== data.message_id));
        } else if (data.action === "add_unread_message") {
          setUnreadMessages((m) => [...m, data.message]);
        }
      };

      setUserSocket(socket);

      return () => {
        socket.close();
      };
    }
  }, [currentUser]);

  return (
    <UserContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        userSocket,
        setUserSocket,
        userFriendOnlineStatus,
        setUserFriendOnlineStatus,
        unreadMessages,
        setUnreadMessages,
        friendListRefresh,
        setFriendListRefresh,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
