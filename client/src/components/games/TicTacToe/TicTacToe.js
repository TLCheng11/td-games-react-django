import React, { useContext } from "react";
import { useState, useEffect, useRef } from "react";
import styles from "./TicTacToe.module.css";
import { fetchUrl } from "../../../utilities/GlobalVariables";
import { useLocation, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../../utilities/axios";
import { UserContext } from "../../../contexts/UserContext";

function TicTacToe({ ticTacToePackage }) {
  const { currentUser } = useContext(UserContext);
  const { showWinLose } = ticTacToePackage;
  const [board, setBoard] = useState(Array(9).fill(" "));
  const [gameSettings, setGameSettings] = useState({ X: [0, ""], O: [0, ""] });
  const [currentSide, setCurrentSide] = useState("");
  const [gameFinished, setGameFinished] = useState(false);
  const [gameContinue, setGameContinue] = useState(false);
  const [replay, setReplay] = useState(false);
  const [ticTacToeSocket, setTicTacToeSocket] = useState({});

  const navigate = useNavigate();

  const location = useLocation();
  const matchId = location.pathname.substring(
    location.pathname.lastIndexOf("/") + 1
  );

  const boardRef = useRef();
  const fieldRef0 = useRef();
  const fieldRef1 = useRef();
  const fieldRef2 = useRef();
  const fieldRef3 = useRef();
  const fieldRef4 = useRef();
  const fieldRef5 = useRef();
  const fieldRef6 = useRef();
  const fieldRef7 = useRef();
  const fieldRef8 = useRef();
  const fieldRefs = [
    fieldRef0,
    fieldRef1,
    fieldRef2,
    fieldRef3,
    fieldRef4,
    fieldRef5,
    fieldRef6,
    fieldRef7,
    fieldRef8,
  ];

  useEffect(() => {
    axiosInstance.get(`tictactoe/${matchId}/`).then((res) => {
      // console.log(res.data);
      const data = res.data;
      const fetchBoard = JSON.parse(data.match.game_status).board;
      if (turn_count(fetchBoard) === 0) {
        setCurrentSide("X");
        setBoard(fetchBoard);
      } else {
        fetchBoard.forEach((v, i) => {
          // console.log(i, v)
          if (v !== " ") {
            fieldRefs[i].current.textContent = v;
            v === "X"
              ? (fieldRefs[i].current.style.color = "red")
              : (fieldRefs[i].current.style.color = "blue");
            fieldRefs[i].current.parentNode.style.transform = "rotateY(180deg)";
            fieldRefs[i].current.parentNode.style.pointerEvents = "none";
          }
        });
        setCurrentSide(data.history.player === "X" ? "O" : "X");
        // console.log(fetchBoard)
        setBoard(fetchBoard);
      }
      // console.log(data);
      // console.log(JSON.parse(data.match.game_settings));
      setGameSettings(JSON.parse(data.match.game_settings));
      if (data.match.finished) {
        setGameFinished(true);
      } else {
        setGameContinue(true);
      }
    });

    const socket = new WebSocket(
      `${process.env.REACT_APP_WEBSOCKET}` +
        "tictactoe/" +
        matchId +
        "/" +
        currentUser.username +
        "/"
    );
    setTicTacToeSocket(socket);

    return () => {
      socket.close();
    };
  }, []);

  // to disable board if not current player
  useEffect(() => {
    if (gameSettings[currentSide]) {
      if (gameSettings[currentSide][0] === currentUser.id) {
        boardRef.current.style.pointerEvents = "auto";
      } else {
        boardRef.current.style.pointerEvents = "none";
      }
    }
  }, [currentSide]);

  // replay function
  useEffect(() => {
    let intervalIds = [];
    if (replay && boardRef.current) {
      boardRef.current.style.pointerEvents = "none";
      fieldRefs.forEach((field) => {
        field.current.parentNode.style.transform = "rotateY(0deg)";
      });

      axiosInstance.get(`tictactoe/${matchId}/histories/`).then((res) => {
        // console.log(res.data);
        const histories = res.data;
        let timer = 1000;
        const replayBoard = Array(9).fill(" ");
        histories.forEach((history) => {
          intervalIds.push(
            setTimeout(() => {
              fieldRefs[history.position].current.textContent = history.player;
              history.player === "X"
                ? (fieldRefs[history.position].current.style.color = "red")
                : (fieldRefs[history.position].current.style.color = "blue");
              fieldRefs[history.position].current.parentNode.style.transform =
                "rotateY(180deg)";
              fieldRefs[
                history.position
              ].current.parentNode.style.pointerEvents = "none";
              replayBoard[history.position] = history.player;
              setCurrentSide(history.player === "X" ? "X" : "O");
            }, timer)
          );
          timer += 2000;
        });
        intervalIds.push(
          setTimeout(() => {
            // console.log(replayBoard);
            if (checkWinner(replayBoard)) {
              setGameFinished(true);
              setReplay(false);
              // console.log("finished");
            }
          }, (timer -= 500))
        );
      });
    }

    return () => intervalIds.forEach((id) => clearInterval(id));
  }, [replay, gameFinished]);

  // --------------------------- using websocket to update moves -----------------------------
  ticTacToeSocket.onmessage = (e) => {
    const res = JSON.parse(e.data);

    // console.log(res);
    const i = res.position;
    const newboard = [...board];
    newboard[res.position] = res.player;
    setBoard(newboard);

    fieldRefs[i].current.textContent = res.player;
    res.player === "X"
      ? (fieldRefs[i].current.style.color = "red")
      : (fieldRefs[i].current.style.color = "blue");
    fieldRefs[i].current.parentNode.style.transform = "rotateY(180deg)";
    fieldRefs[i].current.parentNode.style.pointerEvents = "none";

    if (checkWinner(newboard)) {
      setGameFinished(true);
    } else {
      setCurrentSide(res.player === "X" ? "O" : "X");
    }
  };

  // --------------------------- tic tac toe logics -----------------------------
  const winCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  function move(index, currentSide) {
    board[index] = currentSide;
  }

  function turn_count(board) {
    return board.filter((index) => index !== " ").length;
  }

  function won(board) {
    let win = false;
    winCombinations.forEach((combo) => {
      if (
        board[combo[0]] !== " " &&
        board[combo[0]] === board[combo[1]] &&
        board[combo[1]] === board[combo[2]]
      ) {
        win = board[combo[0]];
        if (gameSettings[win][0] === currentUser.id) {
          if (!gameFinished) {
            setTimeout(() => {
              showWinLose({ type: "win", message: "You Win!" });
            }, 1000);
          }
        } else {
          if (!gameFinished) {
            setTimeout(() => {
              showWinLose({ type: "lose", message: "You Lose!" });
            }, 1000);
          }
        }
      }
    });
    return win;
  }

  function full(board) {
    return board.filter((index) => index === " ").length === 0
      ? !won(board)
      : false;
  }

  function draw(board) {
    return full(board) && !won(board);
  }

  function over(board) {
    return draw(board) || won(board);
  }

  function checkWinner(board) {
    let winner = false;
    if (over(board)) {
      if (draw(board)) {
        winner = "Draw";
        if (!gameFinished) {
          setTimeout(() => {
            showWinLose({ type: "draw", message: "Draw!" });
          }, 1000);
        }
      } else if (won(board)) {
        winner = won(board);
        boardRef.current.style.pointerEvents = "none";
      }
      return true;
    } else {
      // console.log("continue");
      return false;
    }
  }

  // ---------------------------------------------------------------------------------

  function play(e, index, currentSide) {
    move(index, currentSide);
    let playObj = {
      player: currentSide,
      position: index,
      user_id: currentUser.id,
      match_id: matchId,
      game_status: JSON.stringify({ board: board }),
    };

    // post data on player move
    axiosInstance.post(`tictactoe/${matchId}/`, playObj).then((res) => {
      // console.log(res.data);
    });

    e.target.textContent = currentSide;
    currentSide === "X"
      ? (e.target.style.color = "red")
      : (e.target.style.color = "blue");
    e.target.parentNode.style.transform = "rotateY(180deg)";
    e.target.parentNode.style.pointerEvents = "none";
    if (checkWinner(board)) {
      axiosInstance
        .patch(`tictactoe/${matchId}/`, { finished: true })
        .then((res) => {
          // console.log(res.data);
        });

      setGameFinished(true);
    } else {
      setCurrentSide((currentSide) => (currentSide === "X" ? "O" : "X"));
    }
  }

  const arr = [...Array(9).keys()];
  const boardFields = arr.map((i) => {
    return (
      <div key={i} className={styles.item}>
        <div className={styles.front} onClick={(e) => play(e, i, currentSide)}>
          <div className={styles.back} ref={fieldRefs[i]}></div>
        </div>
      </div>
    );
  });

  let winner;
  if (!replay) {
    winner = won(board);
  }

  return (
    <div className={styles.mainPageContainer}>
      <div id={styles.backBtn} onClick={() => navigate("/match-making/1")}>
        <img
          src="https://img.icons8.com/officel/80/000000/return.png"
          alt="return button"
        />
      </div>
      <div className={styles.currentPlayer}>
        {gameFinished ? (
          <div className={styles.gameResult} onClick={() => navigate("/")}>
            <div>Game Finished</div>
            {gameSettings[currentSide] ? (
              <div>
                {draw(board) ? (
                  "Draw"
                ) : (
                  <div className={styles.winnerInfo}>
                    <div>{gameSettings[winner][1]}</div>
                    <div
                      className={styles.winnerSide}
                      style={
                        winner === "X" ? { color: "red" } : { color: "blue" }
                      }
                    >
                      {winner}
                    </div>
                    <div>Won!</div>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        ) : (
          <>
            <div className={styles.currentPlayerName}>
              {gameSettings[currentSide] ? (
                gameSettings[currentSide][0] === currentUser.id ? (
                  <div>Your Turn</div>
                ) : (
                  <div>
                    {gameSettings[currentSide === "X" ? "X" : "O"][1]}'s Turn
                  </div>
                )
              ) : null}
            </div>
            <div className={styles.currentPlayerSide}>
              {currentSide === "X" ? (
                <div style={{ color: "red" }}>{currentSide}</div>
              ) : (
                <div style={{ color: "blue" }}>{currentSide}</div>
              )}
            </div>
          </>
        )}
      </div>
      <div className={styles.gamePlayground}>
        <div className={styles.tttContainer} ref={boardRef}>
          {boardFields}
        </div>
      </div>
      {!gameFinished ? (
        gameSettings[currentSide] ? (
          !replay ? (
            <div className={styles.instruction}>
              Connect 3{" "}
              <div
                style={
                  gameSettings["X"][0] === currentUser.id
                    ? { color: "red" }
                    : { color: "blue" }
                }
              >
                {gameSettings["X"][0] === currentUser.id ? "X" : "O"}
              </div>{" "}
              to win.
            </div>
          ) : (
            <div className={styles.replay}>
              <h1>Replaying...</h1>
            </div>
          )
        ) : null
      ) : !replay ? (
        <div
          className={styles.replay}
          onClick={() => {
            setReplay(true);
            setGameFinished(false);
          }}
          style={{ cursor: "pointer" }}
        >
          <img src="https://img.icons8.com/color/96/000000/replay--v1.png" />
          <h1>Replay</h1>
        </div>
      ) : null}
    </div>
  );
}

export default TicTacToe;
