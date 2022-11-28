import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../utilities/axios";
import "./UserStatus.css";

function UserStatus({ loginFormPackage }) {
  const {
    currentUser,
    unreadMessages,
    setCurrentUser,
    setLoginMode,
    setSignupMode,
    setShowFriends,
    setShowChats,
    setShowMessages,
    setShowSettings,
  } = loginFormPackage;

  let navigate = useNavigate();

  // function for logout

  function onLogout() {
    axiosInstance
      .patch(`users/login/${currentUser.email}`, { is_login: false })
      .then(() => {
        axiosInstance
          .post("users/logout/blacklist/", {
            refresh_token: sessionStorage.getItem("refresh_token"),
          })
          .then(() => {
            sessionStorage.removeItem("access_token");
            sessionStorage.removeItem("refresh_token");
            sessionStorage.removeItem("user");
            axiosInstance.defaults.headers["Authorization"] = null;
            // console.log(res);
            setCurrentUser({});
            setShowFriends(false);
            setShowChats(false);
            setShowMessages(false);
            setShowSettings(false);
            navigate("/");
            console.log("user logged out");
          })
          .catch(console.error);
      })
      .catch(console.error);
  }

  // ----------------------------------------------------------------------------------------------------------------------------------

  function showFriendList() {
    setShowFriends((show) => !show);
    setShowChats(false);
    setShowMessages(false);
    setShowSettings(false);
  }

  function showChatList() {
    setShowChats((show) => !show);
    setShowFriends(false);
    setShowMessages(false);
    setShowSettings(false);
  }

  function showSettings() {
    setShowSettings((show) => !show);
    setShowFriends(false);
    setShowMessages(false);
    setShowChats(false);
  }

  return (
    <div id="login-status">
      {currentUser.username ? (
        <div id="user-menu">
          <div id="logout">
            <h3>
              Hi {currentUser.username.slice(0, 1).toUpperCase()}
              {currentUser.username.slice(1)}
            </h3>
            <button id="logout-btn" onClick={onLogout}>
              Logout
            </button>
          </div>
          <div id="user-options">
            <div id="show-friends" onClick={showFriendList}>
              <p>Friends</p>
            </div>
            <div id="show-chats" onClick={showChatList}>
              <p>Chats</p>
              {unreadMessages.length > 0 ? (
                <div id="all-unread-messages">
                  {unreadMessages.length > 9 ? "9+" : unreadMessages.length}
                </div>
              ) : null}
            </div>
            <div id="show-chats" onClick={showSettings}>
              <p>Settings</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="header-buttons-holder">
          <button
            id="login-btn"
            className="submit-btn"
            type="button"
            value="Login"
            onClick={() => setLoginMode((state) => !state)}
          >
            Login
          </button>
          <button
            id="signup-btn"
            className="submit-btn"
            type="button"
            value="Sign up"
            onClick={() => setSignupMode((state) => !state)}
          >
            Signup
          </button>
        </div>
      )}
    </div>
  );
}

export default UserStatus;
