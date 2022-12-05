import React from "react";
import { useEffect, useState } from "react";
import { axiosInstance } from "../../utilities/axios";
import "./MatchInviteFriend.css";
import MatchFriend from "./MatchFriend";

export default function MatchInviteFriend({
  currentUser,
  setShowInvite,
  gameId,
  userFriendOnlineStatus,
}) {
  const [userFriends, setUserFriends] = useState([]);

  useEffect(() => {
    axiosInstance.get(`friends`).then((res) => {
      setUserFriends(res.data.friends);
    });
  }, []);

  const showFriends = userFriends.map((friend) => {
    return (
      <MatchFriend
        key={friend.id}
        friend={friend}
        currentUser={currentUser}
        gameId={gameId}
        userFriendOnlineStatus={userFriendOnlineStatus}
      />
    );
  });

  return (
    <>
      <div id="invite-list">
        <div className="list-header">
          <p>
            {currentUser.username.slice(0, 1).toUpperCase()}
            {currentUser.username.slice(1)}'s friend list
          </p>
          <div
            className="match-exit-button"
            onClick={() => setShowInvite(false)}
          >
            <p>x</p>
          </div>
        </div>
        {showFriends}
      </div>
    </>
  );
}
