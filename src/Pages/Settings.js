import React, { useState, useContext } from 'react';
import { UserContext } from '../Contexts/UserContext.js'
import { ButtonsAuthDebug } from '../Components/ButtonsAuthDebug';
import { LoginLogout } from '../Components/LoginLogout'
import * as GApiAuth from '../HttpRequests/GApiAuth'

export const Settings = () => {
  const [isSigned, setIsSigned] = useState()
  const { user, setUser } = useContext(UserContext);
   
  const SettingsIn = () => {

    return(
      <h1> Grats, youre in </h1>
    )
  }

  const SettingsOut = () => {

    return(
      <h1> Fool! Log in! </h1>
    )
  }


  return (
    <div> 
      {/*!user ? <h1> You need to be logged in </h1> : <h1> YOUR IN! </h1> */}
      {!user ? <SettingsOut /> : <SettingsIn /> }
      <h1>This is the settings</h1>
      <h3> user message: {user} </h3>
      
      <div/>
      
        <button onClick={() => setIsSigned(!isSigned)} > Toggle Sign in </button>
        <button onClick={() => setUser('man this is it')} > change </button>
      <div/>
      <LoginLogout user={user}/>
      <div/>
      <div/>
      <ButtonsAuthDebug/>
    </div>
  );
}

