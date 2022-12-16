import "./MessageList.css";
import { useEffect, useRef, useState } from "react";
import { fetchUrl } from "../../utilities/GlobalVariables";
import Message from "./Message";
import { axiosInstance } from "../../utilities/axios";

function MessageList({ messageListPackage }) {
  const { currentUser, chatId, setShowMessages, userFriendOnlineStatus } =
    messageListPackage;
  const [formInput, setFormInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [usersStatus, setUsersStatus] = useState({});
  const [refresh, setRefresh] = useState(false);
  const [chatWebSocket, setChatWebSocket] = useState({});

  useEffect(() => {
    axiosInstance
      .get(`chats/messages/${chatId}`)
      .then((res) => setMessages(res.data));
  }, [refresh]);

  // TODO add message websocket
  useEffect(() => {
    // local Websocket
    // const socket = new WebSocket(
    //   "ws://localhost:8021/ws/chats/" +
    //     chatId +
    //     "/" +
    //     currentUser.username +
    //     "/"
    // );
    // setChatWebSocket(socket);

    // deployment Websocket
    const socket = new WebSocket(
      "ws://54.210.20.214:8021/ws/chats/" +
        chatId +
        "/" +
        currentUser.username +
        "/"
    );
    setChatWebSocket(socket);

    return () => {
      socket.close();
    };
  }, []);

  const showMessages = messages.map((message) => {
    return (
      <Message
        key={message.id}
        currentUser={currentUser}
        message={message}
        userFriendOnlineStatus={userFriendOnlineStatus}
        setRefresh={setRefresh}
      />
    );
  });

  // keep the scroll on the bottom when there is new message
  const messageListRef = useRef();
  const messageLengthRef = useRef(messages.length);

  if (messageListRef.current) {
    if (messages.length > messageLengthRef.current) {
      setTimeout(() => {
        messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
      }, 100);
      messageLengthRef.current = messages.length;
    }
  }

  function sendMessage(e) {
    e.preventDefault();
    // chatWebSocket.send(
    //   JSON.stringify({ sender: currentUser.username, message: formInput })
    // );

    axiosInstance
      .post(`chats/messages/${chatId}`, {
        user: currentUser.id,
        chat: chatId,
        message: formInput,
      })
      .then((res) => {
        // TODO set to channel
        // setMessages([...messages, res.data]);
        setFormInput("");
      });
  }

  // when receive update from chatWebSocket
  chatWebSocket.onmessage = function (e) {
    const res = JSON.parse(e.data);
    if (res.method === "POST") {
      setMessages([...messages, res.data]);
    } else if (res.method === "DELETE") {
      const newMessages = messages.filter((m) => m.id != res.data.id);
      setMessages(newMessages);
    } else if (res.method === "PATCH") {
      const newMessages = messages.map((m) => {
        if (m.id === res.data.id) {
          return res.data;
        }
        return m;
      });
      setMessages(newMessages);
    }
  };

  return (
    <div id="message-window">
      <div className="list-header">
        <p>
          {currentUser.username.slice(0, 1).toUpperCase()}
          {currentUser.username.slice(1)}'s Messages
        </p>
        <div className="exit-button" onClick={() => setShowMessages(false)}>
          <p>x</p>
        </div>
      </div>
      <div id="message-list" ref={messageListRef}>
        {showMessages}
      </div>
      <div id="new-message">
        <img src="https://img.icons8.com/dusk/64/000000/add-user-group-man-man.png" />
        <form onSubmit={sendMessage}>
          <input
            type="text"
            name="message"
            value={formInput}
            onChange={(e) => setFormInput(e.target.value)}
            maxLength="225"
            required
          />
          <button type="submit">
            <img src="https://img.icons8.com/ios-glyphs/30/000000/sent.png" />
          </button>
        </form>
      </div>
    </div>
  );
}

export default MessageList;
