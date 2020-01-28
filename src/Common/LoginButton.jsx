import React, { useContext } from 'react';

import { mdiGoogle } from '@mdi/js';
import Icon from '@mdi/react'

import * as GApiAuth from '../HttpRequests/GApiAuth'
import { IsLoggedContext } from '../Contexts/UserContext.js';


const LoginButton = () => {
  const { isLogged2 } = useContext(IsLoggedContext);

  return (
    <a
      className=" btn "
      onClick={() => { isLogged2 ? GApiAuth.logout() : GApiAuth.login() }}
    >
      <Icon
        path={mdiGoogle}
        className="svg-mygoogle2"
        size={1}
      />
      {isLogged2 ? "Logout" : "Login"}
    </a>
  )
}
export default LoginButton