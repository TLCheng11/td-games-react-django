import React, { useContext } from "react";
import "./Settings.css";
import { useState } from "react";
import ProfPicForm from "./ProfPicForm";
import { UserContext } from "../../contexts/UserContext";

export default function Settings({ showSettingsPackage }) {
  const { currentUser } = useContext(UserContext);
  const { setShowSettings, showAlert } = showSettingsPackage;
  // console.log(currentUser);

  const [showProfPicButton, setShowProfPicButton] = useState(true);

  const Img = currentUser.profile_img
    ? currentUser.profile_img
    : "https://wellbeingchirony.com/wp-content/uploads/2021/03/Deafult-Profile-Pitcher.png";

  return (
    <div className="all-settings-container">
      <div className="list-header">
        <p>Settings</p>
        <div className="exit-button" onClick={() => setShowSettings(false)}>
          <p>x</p>
        </div>
      </div>
      <div className="settings-container">
        <div className="profile-img-holder">
          <img className="profile-img" src={Img} alt={currentUser.username} />
        </div>
        {showProfPicButton ? (
          <button
            className="button-70"
            onClick={() => setShowProfPicButton(false)}
          >
            Change Profile Picture
          </button>
        ) : (
          <ProfPicForm setShowProfPicButton={setShowProfPicButton} />
        )}
      </div>
    </div>
  );
}
