import { useEffect, useState } from "react";
import { axiosInstance } from "../../utilities/axios";
import Friend from "./Friend";
import "./FriendList.css";
import Invites from "./Invites";

function FriendList({ friendListPackage }) {
  const {
    currentUser,
    userFriends,
    friendInvites,
    refresh,
    setRefresh,
    inviteSocket,
    setShowFriends,
    showAlert,
  } = friendListPackage;

  const [inviteMode, setInviteMode] = useState(false);
  const [formInput, setFormInput] = useState("");

  // to update friend list
  useEffect(() => {
    setRefresh((state) => !state);
  }, []);

  function addFriend(e) {
    e.preventDefault();
    if (inviteMode) {
      axiosInstance
        .post(`friends/`, {
          friend: formInput.toLocaleLowerCase(),
        })
        .then((res) => {
          console.log(res);
          showAlert({ type: "winner", message: "invite sent" });
        })
        .then(() => {
          setRefresh((state) => !state);
          inviteSocket.send(
            JSON.stringify({ payload: formInput.toLocaleLowerCase() })
          );
          setFormInput("");
        })
        .catch((res) => {
          showAlert({ type: "alert", message: res.response.data.errors });
        });
      setInviteMode(!inviteMode);
    } else {
      setInviteMode(!inviteMode);
    }
  }

  const showFriends = userFriends.map((friend) => (
    <Friend
      key={friend.id}
      friend={friend}
      friendListPackage={friendListPackage}
    />
  ));

  const showInvites = friendInvites.map((friend) => (
    <Invites
      key={friend.id}
      currentUser={currentUser}
      friend={friend}
      refresh={refresh}
      setRefresh={setRefresh}
      inviteSocket={inviteSocket}
      showAlert={showAlert}
    />
  ));

  return (
    <div id="friend-list">
      <div className="list-header">
        <p>
          {currentUser.username.slice(0, 1).toUpperCase()}
          {currentUser.username.slice(1)}'s friend list
        </p>
        <div className="exit-button" onClick={() => setShowFriends(false)}>
          <p>x</p>
        </div>
      </div>
      {showFriends}
      {showInvites.length > 0 ? (
        <div id="pending-invite-list">
          <p>------------ Pending invities -----------</p>
          {showInvites}
        </div>
      ) : null}
      <div id="add-friend">
        <form>
          {inviteMode ? (
            <input
              type="text"
              placeholder="Enter user name"
              value={formInput}
              onChange={(e) => setFormInput(e.target.value)}
              required
            />
          ) : null}
          <button type="submit" onClick={addFriend}>
            <img
              id="add-friend-img"
              src="https://img.icons8.com/external-wanicon-two-tone-wanicon/64/000000/external-add-friend-friendship-wanicon-two-tone-wanicon.png"
              alt="add-friend-img"
            />
          </button>
        </form>
      </div>
    </div>
  );
}

export default FriendList;
