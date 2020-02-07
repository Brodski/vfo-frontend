import React, { Fragment } from "react";

import Footer from "./Footer.jsx";

function About() {
  return (
    <Fragment>
      <div className="container">
        <h1>About</h1>
        <p className="flow-text">
          It's a cool webiste that lets you organized your YouTube subscriptions!
          You could also define the min or max duration the videos must be, for 
          those annoying channles that upload 30 second trailer vids when you only 
          care about the full length video
          {/* <br />
          <br />
          Tired of Youtube being a disorganized mess? Tired of channels that
          upload 30 second trailer vids when you only care about the full length
          video?  */}
          <br />
          <br /> Custom Youtube solves that and lets you control your feed.
          <br />
          <br /> Organize your subscriptions into groups and control the
          minimun/maximun duration required for a video to show up in your feed
        </p>
        <div className="divider" />
        <h5 className="text-flow">
          This environment is for: {" "}
          {process.env.REACT_APP_ENV_NAME}
        </h5>
        {/* <h5 className="text-flow">
          DB, HTTP Server, and server at: {" "}
          {process.env.REACT_APP_SPRINGB_ADDRESS.slice(0, -5)}
        </h5> */}
        <div className="about-div-padding" />
      </div>
      <Footer />
    </Fragment>
  );
}

export default About;
