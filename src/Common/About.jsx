import React, { Fragment } from "react";

import Footer from "./Footer.jsx";

function About() {
  return (
    <Fragment>
      <div className="container">
        <h1>About</h1>
        <p className="flow-text">
          This is a third-party website that lets you organize your YouTube subscriptions!
          <br />
          <br />
          Organize your subscriptions into groups. And optionally control the
          minimun/maximun duration required for a video.
          <br />
          <br />
          This will only read who you're subscribed to. This will not remove any 
          of your subscriptions, nor add any new subscriptions, nor make any 
          modifications to your account ^.^
        </p>
        <div className="about-div-padding" />
      </div>
      <Footer />
    </Fragment>
  );
}

export default About;
