import React, { useContext, useEffect, useState } from "react";
import "./Match.css";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../utilities/axios";
import { UserContext } from "../../contexts/UserContext";

export default function Match({ gameId, usermatch, friend, gameStatus }) {
  const { currentUser, userFriendOnlineStatus } = useContext(UserContext);
  const [gameUrl, setGameUrl] = useState("/tictactoe/");
  const [currentMove, setCurrentMove] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (usermatch.diffculty === "normal") {
      setGameUrl("/tictactoe/");
    } else if (usermatch.diffculty === "medium") {
      setGameUrl("/tictactoemid/");
    }

    // determine whose turn the game is on
    const side = currentUser.id === usermatch.invited_by ? 0 : 1;

    if (gameStatus.filter((empty) => empty === " ").length % 2 === side) {
      setCurrentMove("Waiting for Opponent");
    } else {
      setCurrentMove("Your turn");
    }

    // TODO: auto update game status on matches list
    //   const intervalId = setInterval(() => {
    //     fetch(`${fetchUrl}/tic_tac_toe_match_last_history/${usermatch.match_id}`)
    //     .then(res => res.json())
    //     .then(history => {
    //       if (history) {
    //         if (history.user_id !== currentUser.id) {
    //           setCurrentMove("Your turn!")
    //         } else {
    //           setCurrentMove("Waiting for opponent move...")
    //         }
    //       } else {
    //         if (usermatch.invited_by === currentUser.id) {
    //           setCurrentMove("Your turn!")
    //         } else {
    //           setCurrentMove("Waiting for opponent move...")
    //         }
    //       }
    //     })
    //   }, 1000)

    //   return (() => clearInterval(intervalId))
  }, [usermatch]);

  function handleAccept() {
    axiosInstance
      .patch(`games/${gameId}/${usermatch.match}/user_matches/`, {
        status: "accepted",
      })
      .then((res) => {});
  }

  function handleReject() {
    axiosInstance
      .patch(`games/${gameId}/${usermatch.match}/user_matches/`, {
        status: "declined",
      })
      .then((res) => {});
  }

  const Img = friend.profile_img
    ? friend.profile_img
    : "https://wellbeingchirony.com/wp-content/uploads/2021/03/Deafult-Profile-Pitcher.png";
  const online = userFriendOnlineStatus[friend.username]
    ? { backgroundColor: "green" }
    : { backgroundColor: "red" };

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
        <div className="match-info">
          <i>#{usermatch.id} :</i>
          <i>
            {usermatch.diffculty.slice(0, 1).toUpperCase()}
            {usermatch.diffculty.slice(1)}
          </i>
        </div>
      </div>

      {}

      <div className="match-row">
        {usermatch.status === "pending" ? (
          <>
            {usermatch.invited_by === currentUser.id ? (
              <p>
                <i>
                  {usermatch.status.slice(0, 1).toUpperCase()}
                  {usermatch.status.slice(1)}
                </i>
              </p>
            ) : (
              <div className="button-group-ar">
                <button className="button-68" onClick={handleAccept}>
                  accept
                </button>
                <button className="button-69" onClick={handleReject}>
                  reject
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            {usermatch.status === "accepted" ? (
              <div>
                <button
                  className="button-70"
                  onClick={() => navigate(gameUrl + usermatch.match)}
                >
                  Go to Match
                </button>
                <div>{currentMove}</div>
              </div>
            ) : (
              <>
                {usermatch.status === "finished" ? (
                  <>
                    <p>
                      <i>
                        {usermatch.status.slice(0, 1).toUpperCase()}
                        {usermatch.status.slice(1)}
                      </i>
                    </p>
                    <button
                      className="button-71"
                      onClick={() => navigate(gameUrl + usermatch.match)}
                    >
                      See Results
                    </button>
                  </>
                ) : (
                  <p>
                    <i
                      className={
                        usermatch.status === "declined" ? "rejected-text" : ""
                      }
                    >
                      {usermatch.status.slice(0, 1).toUpperCase()}
                      {usermatch.status.slice(1)}
                    </i>
                  </p>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
