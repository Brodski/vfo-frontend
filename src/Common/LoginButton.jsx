import React, { useContext } from 'react';

import { mdiGoogle } from '@mdi/js';
import Icon from '@mdi/react'

import { Button } from 'react-materialize';
import * as GApiAuth from '../HttpRequests/GApiAuth';
import { IsLoggedContext } from '../Contexts/UserContext.js';


const LoginButton = (isSideNav) => {
  const { isLogged2 } = useContext(IsLoggedContext);
  console.log("hi login")
  console.log(isSideNav)
  return (
    
    <Button 
      node="button"
      onClick={() => { isLogged2 ? GApiAuth.logout() : GApiAuth.login() }}
      className={isSideNav ? "side-nav" : null}
    >
      <Icon
        path={mdiGoogle}
        className="svg-mygoogle2"
        size={1}
      />
      {isLogged2 ? "Logout" : "Login"}
    </Button>
  //   <a
  //   className=" btn "
  //   onClick={() => { isLogged2 ? GApiAuth.logout() : GApiAuth.login() }}
  // >
  //   <Icon
  //     path={mdiGoogle}
  //     className="svg-mygoogle2"
  //     size={1}
  //   />
  //   {isLogged2 ? "Logout" : "Login"}
  // </a>
  )
}
export default LoginButton