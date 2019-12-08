import React, { useState, useContext } from 'react';
import { UserContext } from '../Contexts/UserContext.js'
import { ButtonsAuthDebug } from '../Components/ButtonsAuthDebug';
import { LoginLogout } from '../Components/LoginLogout'
import * as GApiAuth from '../HttpRequests/GApiAuth'
import { User } from '../Classes/User'
import { Subscription } from '../Classes/Subscription'
import * as ServerEndpoints from '../HttpRequests/ServerEndpoints';

import Sortable from 'react-sortablejs';
import PropTypes from 'prop-types';
import * as MySortables from '../Components/MySortables'

//
//  https://github.com/SortableJS/react-sortablejs

export const Settings = () => {
  const [isSigned, setIsSigned] = useState()
  const { user, setUser } = useContext(UserContext);


  const SettingsIn =() => {
    let mockUser = ServerEndpoints.getMockUser()
    console.log('mockUser')
    console.log(mockUser)

   
    return(
    <div>
      <h1> Grats, youre in </h1>
    </div>
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
      <h3>====================================</h3>
      <MySortables.GeneralList />
      <MySortables.Fruits />

      <h3>====================================</h3>
      <div/>
      <ButtonsAuthDebug/>
    </div>
  );
}

