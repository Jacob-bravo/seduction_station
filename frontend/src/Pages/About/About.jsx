import React from "react";
import css from "./About.module.css";
import Logo from "../../Images/apple-touch-icon.png";

const About = () => {
  return (
    <div className={css.Frame}>
      <div className={css.RowOne}>
        <img src={Logo} alt="Logo" />
        <div className={css.Circle}>
          <i class="uil uil-info"></i>
        </div>
      </div>
      <h2>About Us</h2>
      <div className={css.Contentbox}>
        <p>
          Welcome to Secret Seduction, a premium platform where creativity meets
          connection. We bring together a community of talented models who share
          their world with you through personalized experiences, exclusive
          content, and unique subscription packages.
        </p>
        <p>
          Our goal is to create more than just a platform it’s an experience
          tailored to you. Whether you’re looking for one on one interactions or
          want to unlock curated collections through our monthly deals, Secret
          Seduction offers privacy, exclusivity, and unmatched value.
        </p>
        <p>
          Here, every connection is authentic, every package is crafted with
          care, and every member gets access to something truly special.
        </p>
      </div>
    </div>
  );
};

export default About;
