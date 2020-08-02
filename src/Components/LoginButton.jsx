import { Link } from 'react-router-dom';
import React, { useContext, Fragment } from 'react';

import { Button } from 'react-materialize';
import { Divider, Modal } from 'react-materialize';
import { mdiGoogle } from '@mdi/js';
import Icon from '@mdi/react'

import * as GApiAuth from '../HttpRequests/GApiAuth';
import { IsLoggedContext } from '../Contexts/UserContext.js';
import DevWithYT from "../Images/DevWithYT-black.png"
import Logo from '../Images/MainLogo-inv.jsx'
// import { googleBtn } from '../HttpRequests/YoutubeApi.js'
import GoogleLogin from 'react-google-login';
import GoogleIconColor from '../Images/GoogleIconColor.jsx';


const LoginButton = () => {

  const { isLogged } = useContext(IsLoggedContext);

  const Login = () => {
    // googleBtn()
    return (
      <Modal 
        id="Modal-0"
        trigger={( 
          <Button className="side-nav" modal="close" node="button" waves="green">
            {isLogged ? "Logout" : "Login"}
          </Button> 
           )}
      >
        <div className="container center-align">
          <Logo />
          <div className='div-aux' />
          <h5 className="flow-text"> Login through your Youtube account to get started </h5>
          <div class="my-signin2" />
          <img className="dev-with-yt" src={DevWithYT} />
          {/* <img className="dev-with-yt-main" src={DevWithYT} /> */}
          <div className='div-aux' />
          <Logout />
          <div>
            By continuing, you agree to Video Feed Organizer's 
            <Link to="/terms"> Terms of Service, </Link>
            <Link to="/privacy"> Privacy Policy </Link>
          </div>
        </div>
      </Modal>
    )
  }

  const GoogleBtn = () =>  {
    return(
    <div className="ggl-log-btn" >
      <div className="ggl-log-icon-wrap">
        <GoogleIconColor />
      </div>
      <div className="ggl-log-btn-text"> Sign in with Google</div>
    </div>
    )
  }

  const Logout = () => {

    return (
      <Fragment>
        {/* <GoogleBtn/> */}
        <Button 
          node="button"
          onClick={() => { isLogged ? GApiAuth.logout() : GApiAuth.login() }}
          className="side-nav"
        >

        <div className="ggl-log-btn" >
          <div className="ggl-log-icon-wrap">
            <GoogleIconColor />
          </div>
            {/* <Icon className="logo-nav" path={mdiGoogle} size={1} /> */}  
          <div className="ggl-log-btn-text"> Sign in with Google</div>
          {/* {isLogged ? "Logout" : "Login"} */}
        </div>

        </Button>
      </Fragment>
    )
  }
    
  return (
    <Fragment>
      {isLogged ? <Logout /> : <Login />}
    </Fragment>
  )
}
export default LoginButton