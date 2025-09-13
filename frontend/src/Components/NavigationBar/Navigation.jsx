import React from "react";
import css from "./Navigation.module.css";
import { useNavigate } from "react-router-dom";
import { Links } from "../../Data";
import { Logout } from "../../ReactQuery/api";
import { useMenu } from "./Menucontext";

const Navigation = () => {
  const navigate = useNavigate();
  const { setActiveIndex } = useMenu();
  const handleNavigation = (link) => {
    const newlink = link.toLowerCase();
    if (newlink === "logout") {
      Logout();
      navigate("/");
    } else {
      navigate(`/${newlink}`);
    }
  };
  return (
    <div className={css.Frame}>
      <div className={css.Rows}>
        {Links.map((Navigationlink, index) => {
          return (
            <div
              className={css.RowInfo}
              key={index}
              onClick={() => {
                setActiveIndex(index);
                handleNavigation(Navigationlink.navigation);
              }}
            >
              {Navigationlink.icon}
              <span>{Navigationlink.link}</span>
            </div>
          );
        })}
      </div>
      <div
        className={css.About}
        onClick={() => {
          navigate("/about");
        }}
      >
        <i class="uil uil-info"></i>
      </div>
    </div>
  );
};

export default Navigation;
