import React, { Fragment } from "react";

import Footer from "./Footer.jsx";

function About() {
  return (
    <Fragment>
      <div className="container">
        <h1>About</h1>
        <p className="flow-text">
          This website lets you organize your YouTube subscriptions! It's great!
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
        {/* <div className="divider" />
        <h5 className="text-flow">
          This environment is for: {" "}
          {process.env.REACT_APP_ENV_NAME}
        </h5> */}
        <div className="about-div-padding" />
      </div>
      <Footer />
    </Fragment>
  );
}

export default About;
