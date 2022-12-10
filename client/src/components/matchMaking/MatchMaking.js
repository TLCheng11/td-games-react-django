import React from "react";
import "./MatchMaking.css";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { axiosInstance } from "../../utilities/axios";
import MatchInviteFriend from "./MatchInviteFriend";
import AllMatches from "./AllMatches";

export default function MatchMaking({
  userSocket,
  currentUser,
  userFriendOnlineStatus,
}) {
  let location = useLocation();

  const gameId = location.pathname.substring(
    location.pathname.lastIndexOf("/") + 1
  );

  const [showInvite, setShowInvite] = useState(false);
  const [game, setGame] = useState({});

  useEffect(() => {
    axiosInstance.get(`games/${gameId}/`).then((res) => setGame(res.data));
  }, []);

  return (
    <div className="matchmaking-container">
      <AllMatches
        userSocket={userSocket}
        currentUser={currentUser}
        gameId={gameId}
        userFriendOnlineStatus={userFriendOnlineStatus}
      />
      <div className="friend-invite-container">
        <button
          className="button-49"
          role="button"
          onClick={() => {
            if (gameId == "1") {
              setShowInvite(true);
            }
          }}
        >
          {gameId == 1 ? "Invite Friend to Match" : "Coming Soon!"}
        </button>

        {showInvite ? (
          <MatchInviteFriend
            currentUser={currentUser}
            gameId={gameId}
            userFriendOnlineStatus={userFriendOnlineStatus}
            setShowInvite={setShowInvite}
          />
        ) : (
          <></>
        )}
      </div>
      <div className="game-container">
        <h1>{game.title}</h1>
        <img className="game-match-img" src={game.image_url} />
      </div>
    </div>
  );
}
