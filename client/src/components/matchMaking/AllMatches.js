import React, { useContext } from "react";
import "./AllMatches.css";
import { useEffect, useState } from "react";
import { axiosInstance } from "../../utilities/axios";
import Match from "./Match";
import { UserContext } from "../../contexts/UserContext";

export default function AllMatches({ gameId }) {
  const { currentUser, matchListRefresh } = useContext(UserContext);
  const [allMatches, setAllMatches] = useState([]);

  useEffect(() => {
    getMatches();
  }, [matchListRefresh]);

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
    const gameStatus = obj.game_status
      ? JSON.parse(obj.game_status).board
      : [" "];
    const friend = obj.users.filter((u) => u.id !== currentUser.id);
    return (
      <Match
        key={usermatch[0].id}
        gameId={gameId}
        usermatch={usermatch[0]}
        friend={friend[0]}
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
