import React, { useContext, useState } from "react";
import { axiosInstance } from "../../utilities/axios";
import { fetchUrl } from "../../utilities/GlobalVariables";
import "./ProfPicForm.css";
import { UserContext } from "../../contexts/UserContext";

export default function ProfPicForm({ setShowProfPicButton }) {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const [picURL, setPicURL] = useState("");

  const handleSubmit = (evt) => {
    evt.preventDefault();

    let obj = { profile_img: picURL };

    axiosInstance.patch(`users/update/${currentUser.id}`, obj).then((res) => {
      setShowProfPicButton(true);
      setCurrentUser(res.data);
      sessionStorage.setItem("user", JSON.stringify(res.data));
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="profile-pic-form">
        <input
          type="text"
          value={picURL}
          placeholder="Enter Photo URL"
          onChange={(e) => setPicURL(e.target.value)}
          className="profile-pic-input"
        ></input>
        <input type="submit" value="Submit" className="button-68" />
        <button
          className="button-69"
          onClick={() => setShowProfPicButton(true)}
        >
          Cancel
        </button>
      </form>
    </>
  );
}
