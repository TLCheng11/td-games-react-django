import "./MessageList.css";
import { useContext, useEffect, useRef, useState } from "react";
import Message from "./Message";
import { axiosInstance } from "../../utilities/axios";
import { UserContext } from "../../contexts/UserContext";

function MessageList({ messageListPackage }) {
  const { currentUser } = useContext(UserContext);
  const { chatId, setShowMessages } = messageListPackage;
  const [formInput, setFormInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [messageListRefresh, setMessageListRefresh] = useState(false);
  const [chatWebSocket, setChatWebSocket] = useState({});

  useEffect(() => {
    axiosInstance.get(`chats/messages/${chatId}`).then((res) => {
      const messages = res.data.sort((a, b) => a.id - b.id);
      setMessages(messages);
    });
  }, [messageListRefresh]);

  // TODO add message websocket
  useEffect(() => {
    const socket = new WebSocket(
      `${process.env.REACT_APP_WEBSOCKET}` +
        "chats/" +
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
        message={message}
        setMessageListRefresh={setMessageListRefresh}
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
