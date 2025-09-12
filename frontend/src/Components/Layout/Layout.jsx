import React, { useState } from "react";
import css from "./Layout.module.css";
import { Outlet } from "react-router-dom";
import Navigation from "../../Components/NavigationBar/Navigation";
import { useMenu } from "../NavigationBar/Menucontext";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { activeIndex } = useMenu();

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <div className={css.Frame}>
      <button
        className={
          activeIndex === 10 ? css.MobileChatMode : css.MenuToggleButton
        }
        onClick={toggleSidebar}
      >
        {sidebarOpen ? (
          <i class="uil uil-multiply"></i>
        ) : (
          <i class="uil uil-bars"></i>
        )}
      </button>

      <div
        className={`${css.BottomNavigation} ${
          sidebarOpen ? css.ShowSidebar : ""
        }`}
      >
        <Navigation />
      </div>

      <div className={css.outlet}>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
