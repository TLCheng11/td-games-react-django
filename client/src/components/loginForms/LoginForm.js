import { useState } from "react";
import { axiosInstance } from "../../utilities/axios";
import "./LoginForm.css";

function LoginForm({ setCurrentUser, setLoginMode }) {
  const [formInput, setFormInput] = useState({
    username: "",
    email: "",
    password: "",
  });

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
            setLoginMode(false);
          })
          .catch(console.error);
      })
      .catch(console.error);
  }

  return (
    <div id="login-form-container">
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
          <input id="signup-btn" type="button" value="Sign up" />
        </div>
      </form>
    </div>
  );
}

export default LoginForm;
