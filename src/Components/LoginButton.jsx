import { Link } from 'react-router-dom';
import React, { useContext, Fragment } from 'react';

import { Button } from 'react-materialize';
import { Divider, Modal } from 'react-materialize';
import { mdiGoogle } from '@mdi/js';
import Icon from '@mdi/react'

import * as GApiAuth from '../HttpRequests/GApiAuth';
import { IsLoggedContext } from '../Contexts/UserContext.js';
// import DevWithYT from "../Images/DevWithYT-black.png"
import Logo from '../Images/MainLogo-inv.jsx'
import GoogleNEWIcon from '../Images/GoogleIcon.svg'
import DevWithYt from './DevWithYt.jsx';


const LoginButton = () => {

  const { isLogged } = useContext(IsLoggedContext);

  const Login = () => {
    return (
      <Modal 
        id="Modal-0"
        trigger={( 
          <Button className="side-nav" modal="close" node="button" waves="green">
            {isLogged ? "Logout" : "Login"}
          </Button> 
           )}
      >
        <div className=" center-align">
          <div className="center-align modal-logo">
            <Logo />
          </div>
          <div className='div-aux' />
          <h5 className="flow-text"> Login through your Youtube account to begin. </h5>
          <DevWithYt isLoginModal={true}/>
          <div class="my-signin2" />
          {/* <img className="dev-with-yt" src={DevWithYT} /> */}
          <div className='div-aux' />
          <Logout />
          <div>
            By continuing you agree to Video Feed Organizer's 
            <Link to="/terms"> Terms of Service, </Link>
            <Link to="/privacy"> Privacy Policy </Link>
          </div>
        </div>
      </Modal>
    )
  }

  const GoogleBtn = () =>  {
    return(
      <div className="ggl-log-btn-wrap">
      <div className=" ggl-log-btn" 
        onClick={() => { isLogged ? GApiAuth.logout() : GApiAuth.login() }}
        >
        <div className="ggl-tile-wrap">
          <div className="ggl-log-icon-wrap">
            <img className="ggl-svg-icon " src={GoogleNEWIcon}/>
          </div>
        </div>
        <div className="ggl-log-btn-text"> Sign in with Google</div>
      </div>
      </div>
    )
  }

  const Logout = () => {

    return (
      <Fragment>
        {isLogged 
        ? <Button 
            node="button"
            onClick={() => { isLogged ? GApiAuth.logout() : GApiAuth.login() }}
            className="side-nav"
          >
          {/* <Icon className="logo-nav" path={mdiGoogle} size={1} />   */}
          {isLogged ? "Logout" : "Login"}
          </Button>
        : <GoogleBtn/>}
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