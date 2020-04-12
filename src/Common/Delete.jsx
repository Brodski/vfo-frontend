import React, { Fragment, useContext, useState } from "react";

import * as GApiAuth from '../HttpRequests/GApiAuth'
import * as ServerEndpoints from "../HttpRequests/ServerEndpoints";
import { IsLoggedContext, UserContext } from '../Contexts/UserContext.js';
import Footer from "./Footer.jsx";

function Delete() {

  const [youSure, setYouSure] = useState(false)
  const [isProcessing, setProcessing] = useState(false)
  const { user } = useContext(UserContext);
  const { isLogged2 } = useContext(IsLoggedContext);

  async function deleteProfile() {
    setProcessing(true)
    await ServerEndpoints.deleteUser(user)
    GApiAuth.logout()
  }

  const Verify = () => (
    <Fragment>
      { isProcessing
      ? <h5> Thank you. Processing request</h5>
      : (
        <Fragment>
          <h5> Continue? <a className="waves-effect waves-light btn" onClick={deleteProfile}> Yes </a> </h5> 
        </Fragment>
        )}
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
