import React,  { useState, useContext, useEffect }  from 'react';
import * as GApiAuth        from '../HttpRequests/GApiAuth'
import { IsLoggedContext } from '../Contexts/UserContext.js';
import GoogleColor from './GoogleColor'

const LoginButton2 = () => {
  const { isLogged2, setIsLogged2 } = useContext(IsLoggedContext);
  
  return(    
    <a className="waves-effect waves-light btn "
      onClick={()=> {  isLogged2 ? GApiAuth.logout() : GApiAuth.login() }} 
      > 
      <GoogleColor />
      {isLogged2 ? "Logout": "Login"}
    </a>
  ) 
}
export default LoginButton2