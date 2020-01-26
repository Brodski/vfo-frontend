import React, { Fragment } from "react";

import Footer from "./Footer.jsx";

function About() {
  return (
    <Fragment>
      <div className="container">
        <h1>About</h1>
        <p className="flow-text">
          Tired of Youtube being a disorganized mess? Tired of channels that
          upload 30 second trailer vids when you only care about the full length
          video?
          <br />
          <br /> Better Youtube solves that and lets you control your feed.
          <br />
          <br /> Organize your subscriptions into groups and control the
          minimun/maximun duration required for a video to show up in your feed
        </p>
        <div className="divider" />
        <h5 className="text-flow">
          This environment is for: {" "}
          {process.env.REACT_APP_ENV_NAME}
        </h5>
        <h5 className="text-flow">
          DB, HTTP Server, and server at: {" "}
          {process.env.REACT_APP_SPRINGB_DOMAIN.slice(0, -5)}
        </h5>
        <div className="about-div-padding" />
      </div>
      <Footer />
    </Fragment>
  );
}

export default About;
