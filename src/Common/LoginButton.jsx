import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import { Button } from 'react-materialize';
import { mdiGoogle } from '@mdi/js';
import Icon from '@mdi/react'

import * as GApiAuth from '../HttpRequests/GApiAuth';
import { IsLoggedContext } from '../Contexts/UserContext.js';
import Logo from '../Images/MainLogo-inv.jsx'
import { Modal } from 'react-materialize';
import DevWithYT from "../Images/DevWithYT-black.png"

const LoginButton = (isSideNav) => {
  const { isLogged2 } = useContext(IsLoggedContext);
  
  return (
    <Modal    
      // actions={[
      // ]}
      id="Modal-0"
      open={false}
      trigger={(
        <Button className={isSideNav ? "side-nav" : null} modal="close" node="button" waves="green">{isLogged2 ? "Logout" : "Login"}</Button>       
      )}
    >
      <div className="container center-align">
        <Logo />
        <h5>Login through your Youtube account to get started </h5>
        <img className="dev-with-yt" src={DevWithYT} />
        <Button 
          node="button"
          // onClick={() => { isLogged2 ? GApiAuth.logout() : GApiAuth.login() }}
          onClick={() => { isLogged2 ? GApiAuth.logout() : GApiAuth.login() }}
          className={isSideNav ? "side-nav" : null}
        >
          <Icon
            path={mdiGoogle}
            className="logo-nav"
            size={1}
          />
          {isLogged2 ? "Logout" : "Login"}
        </Button>
        <div>
          By continuing, you agree to Video Feed Organizer's 
          <Link to="/terms"> Terms of Service, </Link> 
          <Link to="/privacy"> Privacy Policy </Link>
        </div>
      </div>

    </Modal>
  )
}
export default LoginButton