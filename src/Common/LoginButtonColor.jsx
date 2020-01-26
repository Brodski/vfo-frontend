import React,  { useContext }  from 'react';

import * as GApiAuth        from '../HttpRequests/GApiAuth'
import { IsLoggedContext } from '../Contexts/UserContext.js';
import GoogleIconColor from '../Images/GoogleIconColor'

const LoginButtonColor = () => {
  const { isLogged2 } = useContext(IsLoggedContext);
  
  return(    
    <a
      className=" btn "
      onClick={()=> { isLogged2 ? GApiAuth.logout() : GApiAuth.login() }}
    > 
      <GoogleIconColor />
      {isLogged2 ? "Logout": "Login"}
    </a>
  ) 
}
export default LoginButtonColor