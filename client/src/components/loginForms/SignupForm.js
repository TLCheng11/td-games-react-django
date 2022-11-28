import { useState } from "react";
import { axiosInstance } from "../../utilities/axios";

function SignupForm({ setCurrentUser, showAlert }) {
  const [formInput, setFormInput] = useState({
    username: "",
    email: "",
    password: "",
  });

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

  return <div></div>;
}

export default SignupForm;
