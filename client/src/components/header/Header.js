import { NavLink } from "react-router-dom";
import "./Header.css";
import UserStatus from "./UserStatus";

function Header({ loginFormPackage }) {
  return (
    <div id="header">
      <div>
        <NavLink to="/">
          <h1 id="title">TD GAMES</h1>
        </NavLink>
      </div>
      <div>
        <UserStatus loginFormPackage={loginFormPackage} />
      </div>
    </div>
  );
}

export default Header;
