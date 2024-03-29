import { useContext, useEffect, useState } from "react";
import { axiosInstance } from "../../utilities/axios";
import "./Friend.css";
import { UserContext } from "../../contexts/UserContext";

function Friend({ friend, friendListPackage }) {
  const { userFriendOnlineStatus, unreadMessages } = useContext(UserContext);

  const { setChatId, setShowFriends, setShowChats, setShowMessages } =
    friendListPackage;

  const Img = friend.profile_img
    ? friend.profile_img
    : "https://wellbeingchirony.com/wp-content/uploads/2021/03/Deafult-Profile-Pitcher.png";
  const online = userFriendOnlineStatus[friend.username]
    ? { backgroundColor: "green" }
    : { backgroundColor: "red" };

  function findMessages() {
    axiosInstance.post(`chats/`, { friend: friend.id }).then((res) => {
      setChatId(res.data.id);
      setShowFriends(false);
      setShowChats(false);
      setShowMessages(true);
    });
  }

  const showUnreadMessages = unreadMessages.filter(
    (message) => message.user.id === friend.id
  );

  return (
    <div className="friend">
      <div className="profile-img-holder">
        <img className="profile-img" src={Img} alt={friend.username} />
        <div className="online-status" style={online}></div>
      </div>
      <div className="friend-name">
        <p>
          {friend.username.slice(0, 1).toUpperCase()}
          {friend.username.slice(1)}
        </p>
      </div>
      <div>
        <img
          className="start-message"
          src="https://img.icons8.com/cotton/64/000000/chat.png"
          onClick={findMessages}
        />
      </div>
      {showUnreadMessages.length > 0 ? (
        <div className="unread-messages">
          {showUnreadMessages.length > 9 ? "9+" : showUnreadMessages.length}
        </div>
      ) : null}
    </div>
  );
}

export default Friend;
