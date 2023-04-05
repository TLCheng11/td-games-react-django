import { useContext, useEffect, useState } from "react";
import { fetchUrl } from "../../utilities/GlobalVariables";
import "./ChatList.css";
import Chat from "./Chat";
import { axiosInstance } from "../../utilities/axios";
import { UserContext } from "../../contexts/UserContext";

function ChatList({ chatListPackage }) {
  const { currentUser } = useContext(UserContext);

  const { setShowChats } = chatListPackage;
  const [userChats, setUserChats] = useState([]);

  // TODO: track unread message
  // useEffect(() => {
  //   fetch(`${fetchUrl}/chats/${currentUser.id}`)
  //     .then(res => res.json())
  //     .then(setUserChats)

  //   // keep checking friends online status
  //   const intervalId = setInterval(() => {
  //     fetch(`${fetchUrl}/chats/${currentUser.id}`)
  //     .then(res => res.json())
  //     .then(setUserChats)
  //   }, 2000)

  //   return (() => {
  //     clearInterval(intervalId)
  //   })
  // }, [])

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
