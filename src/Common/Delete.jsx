import React, { Fragment, useContext, useState } from "react";

import { UserContext, IsLoggedContext } from '../Contexts/UserContext.js';

import * as GApiAuth from '../HttpRequests/GApiAuth'
import * as ServerEndpoints from "../HttpRequests/ServerEndpoints";
import Footer from "./Footer.jsx";

function Delete() {

  const [youSure, setYouSure] = useState(false)
  const [processing, setProcessing] = useState(false)
  const { user } = useContext(UserContext);
  const { isLogged2 } = useContext(IsLoggedContext);

  function deleteProfile() {
    setProcessing(true)
    ServerEndpoints.deleteUser(user)
    GApiAuth.logout()
  }

  const Verify = () => (
    <Fragment>
      { processing
      // ? <LoadingMain />
      ? <h5> Thank you! Processing request might take a couple minutes. </h5> 
      : <h5> Continue? <a className="waves-effect waves-light btn" onClick={deleteProfile}> Yes </a> </h5>  } 
    </Fragment>
  )

  const DeleteSteps = () => (
    <Fragment>
      { youSure 
        ? <Verify />
        : <h5> Delete profile? <a className="waves-effect waves-light btn" onClick={()=> setYouSure(true)}> Delete </a> </h5> }
      <h6> 
        This will delete all data that this app has stored about you.
        <br /> 
        <br />
        This will not alter nor delete anything from your real YouTube profile.
      </h6>
    </Fragment>
  )


  return (
    <Fragment>
      <div className="container">
        <h1>Your Data</h1>
        { isLogged2
        ? <DeleteSteps />
        : <h5> You need to be logged in </h5> }
        
        <div className="about-div-padding" />
      </div>
      <Footer />
    </Fragment>
  );
}

export default Delete;
