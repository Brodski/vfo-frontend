import React, { Fragment, useContext, useState } from "react";

import { UserContext, UserSettingsContext } from '../Contexts/UserContext.js';

import * as GApiAuth from '../HttpRequests/GApiAuth'
import * as ServerEndpoints from "../HttpRequests/ServerEndpoints";
import Footer from "./Footer.jsx";
import LoadingMain from "./LoadingMain"

function Delete() {

  const [youSure, setYouSure] = useState(false)
  const [processing, setProcessing] = useState(false)
  const { user, setUser } = useContext(UserContext);
  const { setUserSettings } = useContext(UserSettingsContext);

  function deleteProfile() {
    setProcessing(true)
    ServerEndpoints.deleteUser(user)
    //GApiAuth.logout()
  }

  const Verify = () => (
    <Fragment>
      { processing
      // ? <LoadingMain />
      ? <h5> Thank you! Processing request might take a couple minutes. </h5> 
      : <h5> Continue? <a className="waves-effect waves-light btn" onClick={deleteProfile}> Yes </a> </h5>  } 
    </Fragment>
  )


  return (
    <Fragment>
      <div className="container">
        <h1>Privacy</h1>
        {/* <h4 className="flow-text"> */}        
        { youSure 
        ? <Verify />
        : <h5> Delete profile? <a className="waves-effect waves-light btn" onClick={()=> setYouSure(true)}> Delete </a> </h5> }
        
        
        <h6> 
          This will delete all data that this app has stored about you.
          <br /> 
          <br />
          This will not alter nor delete anything from your real YouTube profile.
        </h6>
        <div className="about-div-padding" />
      </div>
      <Footer />
    </Fragment>
  );
}

export default Delete;
