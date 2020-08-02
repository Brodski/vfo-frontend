import React, { Component } from 'react'
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import * as GApiAuth from '../HttpRequests/GApiAuth';
import GoogleIconColor from '../Images/GoogleIconColor';


const GoogleBtn = () =>  {
  <div>
    <GoogleIconColor />
    <div> Sign in with Google</div>
  </div>
}

export default GoogleBtn;