import { useContext, useEffect, useState } from "react";
import "./ChatList.css";
import Chat from "./Chat";
import { axiosInstance } from "../../utilities/axios";
import { UserContext } from "../../contexts/UserContext";

function ChatList({ chatListPackage }) {
  const { currentUser } = useContext(UserContext);

  const { setShowChats } = chatListPackage;
  const [userChats, setUserChats] = useState([]);

  useEffect(() => {
    axiosInstance.get(`chats/`).then((res) => {
      setUserChats(res.data);
    });
  }, []);

  const showChats = userChats.map((chat) => (
    <Chat key={chat.id} chat={chat} chatListPackage={chatListPackage} />
  ));

  return (
    <div id="chat-list">
      <div className="list-header">
        <p>
          {currentUser.username.slice(0, 1).toUpperCase()}
          {currentUser.username.slice(1)}'s chat list
        </p>
        <div className="exit-button" onClick={() => setShowChats(false)}>
          <p>x</p>
        </div>
      </div>
      {showChats}
    </div>
  );
}

export default ChatList;
