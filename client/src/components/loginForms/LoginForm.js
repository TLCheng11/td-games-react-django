import { useContext, useState } from "react";
import { axiosInstance } from "../../utilities/axios";
import "./LoginForm.css";
import { UserContext } from "../../contexts/UserContext";

function LoginForm({ showAlert, setLoginMode, setSignupMode }) {
  const { setCurrentUser } = useContext(UserContext);

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
        // console.log(res);
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
      .catch((error) => {
        // console.log(error);
        showAlert({
          type: "alert",
          message: "Wrong username or password",
        });
      });
  }

  return (
    <div id="login-form-container">
      <div id="form-background">
        <div className="form-title">
          <h1>LOGIN: </h1>
          <h1 className="exit-btn" onClick={() => setLoginMode(false)}>
            X
          </h1>
        </div>
        <form id="login-form" onSubmit={onLogin}>
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
            <input
              id="login-btn"
              className="submit-btn"
              type="submit"
              value="Login"
            />
            <input
              id="signup-btn"
              className="switch-btn"
              type="button"
              value="Sign up"
              onClick={() => {
                setLoginMode(false);
                setSignupMode(true);
              }}
            />
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
