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
        <div className="container center-align">
          <Logo />
          <div className='div-aux' />
          <h5 className="flow-text">Login through your Youtube account to get started </h5>
          <img className="dev-with-yt-main" src={DevWithYT} />
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

  const Logout = () => {
    return (
      <Button 
        node="button"
        onClick={() => { isLogged ? GApiAuth.logout() : GApiAuth.login() }}
        className="side-nav"
      >
        <Icon className="logo-nav" path={mdiGoogle} size={1} />
        {isLogged ? "Logout" : "Login"}
      </Button>
    )
  }
    
  return (
    <Fragment>
      {isLogged ? <Logout /> : <Login />}
    </Fragment>
  )
}
export default LoginButton