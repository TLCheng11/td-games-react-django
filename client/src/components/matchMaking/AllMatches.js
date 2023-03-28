import React from "react";
import "./AllMatches.css";
import { useEffect, useState } from "react";
import { axiosInstance } from "../../utilities/axios";
import Match from "./Match";

export default function AllMatches({
  userSocket,
  currentUser,
  gameId,
  userFriendOnlineStatus,
}) {
  const [allMatches, setAllMatches] = useState([]);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    getMatches();
  }, [refresh]);

  userSocket.onmessage = function (e) {
    const data = JSON.parse(e.data);
    if (data.action === "match_status_update") {
      setRefresh((state) => !state);
    }
  };

  function getMatches() {
    axiosInstance.get(`games/${gameId}/matches/`).then((res) => {
      // console.log(res);
      // console.log(res.data[0].user_matches[0].status);
      const obj = { accepted: 1, pending: 2, finished: 3, declined: 4 };
      const data = res.data
        .filter(
          (d) =>
            !(
              d.user_matches[0].status === "declined" &&
              d.user_matches[0].invited_by !== currentUser.id
            )
        )
        .sort(function (a, b) {
          if (obj[a.user_matches[0].status] < obj[b.user_matches[0].status]) {
            return -1;
          }

          if (obj[a.user_matches[0].status] > obj[b.user_matches[0].status]) {
            return 1;
          }

          return 0;
        });

      setAllMatches(data);
    });
  }

  const MatchesToInclude = allMatches.map((obj) => {
    const usermatch = obj.user_matches.filter(
      (um) => um.user === currentUser.id
    );
    const gameStatus = obj.game_status ? JSON.parse(obj.game_status).board : [];
    const friend = obj.users.filter((u) => u.id !== currentUser.id);
    return (
      <Match
        key={usermatch[0].id}
        gameId={gameId}
        usermatch={usermatch[0]}
        friend={friend[0]}
        currentUser={currentUser}
        userFriendOnlineStatus={userFriendOnlineStatus}
        gameStatus={gameStatus}
      />
    );
  });

  // console.log(allMatches);
  // console.log(MatchesToInclude);

  return (
    <div id="match-list">
      {" "}
      <div className="list-header">
        <p>All Matches</p>
      </div>
      {MatchesToInclude}
    </div>
  );
}
