import React, { Fragment } from "react";

import Footer from "./Footer.jsx";

function About() {
  return (
    <Fragment>
      <div className="container">
        <h1>About</h1>
        <p className="flow-text">
          This website lets you organize your YouTube subscriptions!
          <br />
          <br />
          Organize your subscriptions into groups. And optionally control the
          minimun/maximun duration required for a video.
          <br />
          <br /> 
          By loging in you will authorize this website to see who you're subscribed to. 
          This will only view your subscriptions and will not remove any 
          of your subscriptions, nor add any new subscriptions, nor make any 
          modifications to your account ^.^
          <br />
          <br /> 
          This is a third-party web app, it is not owned by YouTube
        </p>
        <div className="about-div-padding" />
      </div>
      <Footer />
    </Fragment>
  );
}

export default About;
