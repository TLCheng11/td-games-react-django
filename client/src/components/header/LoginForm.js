import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUrl } from "../../utilities/GlobalVariables";
import { axiosInstance } from "../../utilities/axios";
import "./LoginForm.css";

function LoginForm({ loginFormPackage }) {
  const {
    currentUser,
    unreadMessages,
    setCurrentUser,
    setShowFriends,
    setShowChats,
    setShowMessages,
    showAlert,
    setShowSettings,
  } = loginFormPackage;

  const [formInput, setFormInput] = useState({
    username: "",
    email: "",
    password: "",
  });

  let navigate = useNavigate();

  function controlFormInput(e) {
    const { name, value } = e.target;
    setFormInput({
      ...formInput,
      [name]: value,
    });
  }

  // ------------------------------------------------- logic for login / logout ------------------------------------------------

  function onLogin(e) {
    e.preventDefault();
    axiosInstance
      .post(`token/`, formInput)
      .then((res) => {
        console.log(res);
        sessionStorage.setItem("access_token", res.data.access);
        sessionStorage.setItem("refresh_token", res.data.refresh);
        axiosInstance.defaults.headers["Authorization"] =
          "JWT " + sessionStorage.getItem("access_token");
        axiosInstance
          .patch(`users/login/${formInput.email}`, { is_login: true })
          .then((res) => {
            sessionStorage.setItem("user", JSON.stringify(res.data));
            setCurrentUser(res.data);
          })
          .catch(console.error);
      })
      .catch(console.error);
  }

  function onLogout() {
    axiosInstance
      .patch(`users/login/${currentUser.email}`, { is_login: false })
      .then(() => {
        axiosInstance
          .post("users/logout/blacklist/", {
            refresh_token: localStorage.getItem("refresh_token"),
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

  // ----------------------------------------------------------- logic for sign up ---------------------------------------------------------
  function onSignUp() {
    if (formInput.username.match(/^[\w]*$/g)) {
      if (formInput.username.match(/^[A-Za-z]/g)) {
        if (formInput.username.match(/^.{3,18}$/g)) {
          console.log("username ok");

          //check if password meet all requirement
          if (formInput.password.match(/^[\w\d~!@#$%^&*-=+?]+$/g)) {
            if (formInput.password.match(/^.{6,18}$/g)) {
              console.log("password ok");
              // console.log(password)
              axiosInstance
                .post("users/register/", formInput)
                .then((res) => {
                  console.log(res);
                  setCurrentUser(res.data);
                  sessionStorage.setItem("user", JSON.stringify(res.data));
                  axiosInstance
                    .post("token/", {
                      email: formInput.email,
                      password: formInput.password,
                    })
                    .then((res) => {
                      sessionStorage.setItem("access_token", res.data.access);
                      sessionStorage.setItem("refresh_token", res.data.refresh);
                      axiosInstance.defaults.headers["Authorization"] =
                        "JWT " + sessionStorage.getItem("access_token");
                      setFormInput({
                        username: "",
                        password: "",
                      });
                    })
                    .catch(console.log);
                })
                .catch((error) => {
                  console.log(error);
                  const message =
                    error.response.data.email[0] ||
                    error.response.data.username[0];
                  showAlert({
                    type: "alert",
                    message: message.slice(3, -1),
                  });
                });
            } else {
              showAlert({
                type: "alert",
                message: "password need to be between 6 - 18 charaters",
              });
            }
          } else {
            showAlert({
              type: "alert",
              message:
                "password can only include alphabet letters, numbers and _~!@#$%^&*-=+?, cannot have space",
            });
          }
        } else {
          showAlert({
            type: "alert",
            message: "username need to be between 3 - 18 charaters",
          });
        }
      } else {
        showAlert({
          type: "alert",
          message: "username must start with letter",
        });
      }
    } else {
      showAlert({
        type: "alert",
        message:
          "username can only include alphabet letters, numbers and '_', cannot have space",
      });
    }
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
        <form id="login-form" onSubmit={onLogin}>
          <div className="input-holder">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Username"
              value={formInput.username}
              onChange={controlFormInput}
              required
            />
          </div>
          <div className="input-holder">
            <label htmlFor="email">Email:</label>
            <input
              type="text"
              id="email"
              name="email"
              placeholder="email"
              value={formInput.email}
              onChange={controlFormInput}
              required
            />
          </div>
          <div className="input-holder">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              value={formInput.password}
              onChange={controlFormInput}
              required
            />
          </div>
          <div className="form-buttons-holder">
            <input id="login-btn" type="submit" value="Login" />
            <input
              id="signup-btn"
              type="button"
              value="Sign up"
              onClick={onSignUp}
            />
          </div>
        </form>
      )}
    </div>
  );
}

export default LoginForm;
