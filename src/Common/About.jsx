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
          {/* Tired of Youtube being a disorganized mess? Tired of channels that
          upload 30 second trailer vids when you only care about the full length
          video?  
          <br />
          <br /> Custom Youtube solves that and lets you control your feed.
          <br /> 
          You could also define the min or max duration the videos must be, for 
          those annoying channles that upload 30 second trailer vids when you only 
          care about the full length video 
          <br />
          <br /> */}
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
