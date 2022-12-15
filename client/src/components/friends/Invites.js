import { useEffect, useState } from "react";
import { fetchUrl } from "../../utilities/GlobalVariables";
import { axiosInstance } from "../../utilities/axios";
import "./Invites.css";

function Invites({ currentUser, friend, refresh, setRefresh, showAlert }) {
  const [invite, setInvite] = useState({});

  // the get invition status
  useEffect(() => {
    axiosInstance
      .get(`friends/${friend.id}/`)
      .then((res) => setInvite(res.data))
      .catch(console.error);
  }, [refresh]);

  function cancelInvite(e) {
    e.target.style.pointerEvents = "none";
    axiosInstance
      .delete(`friends/${invite.id}/`)
      .then((res) => showAlert({ type: "alert", message: res.data.message }))
      .then(() => {
        setRefresh((state) => !state);
      })
      .catch((res) =>
        showAlert({ type: "alert", message: res.response.data.errors })
      );
  }

  function declineInvite(e) {
    e.target.style.pointerEvents = "none";
    axiosInstance
      .patch(`friends/${invite.id}/`, { method: "declined" })
      .then((res) => showAlert({ type: "alert", message: res.data.message }))
      .then(() => {
        setRefresh((state) => !state);
      })
      .catch((res) =>
        showAlert({ type: "alert", message: res.response.data.errors })
      );
  }

  function acceptInvite(e) {
    e.target.style.pointerEvents = "none";
    axiosInstance
      .patch(`friends/${invite.id}/`, { method: "accepted" })
      .then((res) => showAlert({ type: "winner", message: res.data.message }))
      .then(() => {
        setRefresh((state) => !state);
      })
      .catch((res) =>
        showAlert({ type: "alert", message: res.response.data.errors })
      );
  }

  const Img = friend.profile_img
    ? friend.profile_img
    : "https://wellbeingchirony.com/wp-content/uploads/2021/03/Deafult-Profile-Pitcher.png";
  const online = { backgroundColor: "gray" };

  return (
    <div className="invite">
      <div className="profile-img-holder">
        <img className="profile-img" src={Img} alt={friend.username} />
        <div className="online-status" style={online}></div>
      </div>
      {invite.id && (
        <>
          {invite.invited_by === currentUser.id ? (
            // show Pending Invites
            <div className="invite-sender">
              <div>
                {invite.status === "pending" ? (
                  <p className="invite-message" style={{ color: "green" }}>
                    Pending invite for
                  </p>
                ) : null}
                <p>
                  {friend.username.slice(0, 1).toUpperCase()}
                  {friend.username.slice(1)}
                </p>
                {invite.status === "declined" ? (
                  <p className="invite-message" style={{ color: "red" }}>
                    Declined your invitation!
                  </p>
                ) : null}
              </div>
              <img
                src="https://img.icons8.com/external-happy-man-bomsymbols-/91/000000/external-cancel-happy-man-human-resource-and-life-style-set-1-happy-man-bomsymbols-.png"
                onClick={cancelInvite}
              />
            </div>
          ) : (
            // show invite from others
            <div className="invite-receiver">
              <div>
                <p>
                  {friend.username.slice(0, 1).toUpperCase()}
                  {friend.username.slice(1)}
                </p>
                <p className="invite-message">wanted to be friend with you</p>
              </div>
              <img
                className="accept-invite"
                src="https://img.icons8.com/external-others-inmotus-design/67/000000/external-Accept-round-icons-others-inmotus-design-3.png"
                onClick={acceptInvite}
              />
              <img
                className="decline-invite"
                src="https://img.icons8.com/external-others-inmotus-design/67/000000/external-Cancel-round-icons-others-inmotus-design-8.png"
                onClick={declineInvite}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Invites;
