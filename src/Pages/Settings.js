import React, { useState, useContext, useEffect } from 'react';
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
import * as SettingsLogic from '../BusinessLogic/SettingsLogic'
//
//  https://github.com/SortableJS/react-sortablejs

//var Sortable = require('react-sortablejs');

/*
export const Settings2 = (props) => {

  console.log('Settings 2 props.mockUser')
  console.log(props.mockUser)
  const [subs, setSubs] = useState(props.mockUser)
  const [availableSubs, setAvailableSubs] = useState([''])

  useEffect(() => {
    setStuff()
  }, []);

  const setStuff = async () => {

    setSubs(props.mockUser) 
    setAvailableSubs(subs.map(s => s.channelName))
  }

  function changeShit(order, sortable, evt) {  }

  function logSubzButton() {
      console.log('subs');
      console.log(subs);
      console.log( subs.map(s => s.channelName))
      //setAvailableSubs(subs.map(s => s.channelName))
}


    return (
    
      <div>
        <h1> Settings2 </h1>
        
        <button onClick={logSubzButton}> log subs & subList </button>

        <Sortable
          className="block-list"
          options={{
            group: 'shared',
          }}
          chosenClass="sortable-chosen"
          onChange={(order, sortable, evt) => { changeShit(order, sortable, evt) }} >
          {availableSubs.map(s => (<div className="block" data-id={s} key={s} > {s} </div> ))}
        </Sortable>
      </div>
    )


}
*/

const UnsortedSubsShelf = (props) => {
  console.log("Unsorted Subs Shelf")
  const [subList, setSubsList] = useState(props.mockUser.map( s => s.channelName))
  
  return (
    <div>
      <h1> Unsorted Sub Shelf </h1>
        
      <button onClick={() => { console.log('subsList: '); console.log(subList); }}> log subs & subList </button>

      <Sortable
        className="block-list"
        options={{
          group: 'shared',
          animation: 100,
          swapThreshold: .1,     
        }}
        chosenClass="sortable-chosen"
        onChange={(order, sortable, evt) => { setSubsList(order) }} >
        {subList.map(s => (<div className="block" data-id={s} key={s} > {s} </div> ))}
      </Sortable>
    </div>
    )



}


const SettingsOut = () => {

  return(
    <h1> Fool! Log in! </h1>
  )
}
export const Settings = () => {

  let mockUser;
  const { user, setUser } = useContext(UserContext);
  const [subs, setSubs] = useState([ ])

  
  useEffect(() => {
    getShit()
  }, []);
    
  async function getShit() {
    mockUser = await ServerEndpoints.getMockUser() //Probably will "setSubs(actualUser)" in future
    await setSubs(mockUser.subscriptions) 

  }
    return (
    <div>  
        <LoginLogout user={user}/>
        <h3> user message: {user} </h3>
        <button onClick={() => setUser('man this is it')} > change user message </button>
      <h1> ```````````````````````` </h1>
        {!user ? <SettingsOut /> : <UnsortedSubsShelf  mockUser={subs}/> }


      <MySortables.AllThisSortableStuff/>
      <ButtonsAuthDebug/>
    </div>
  );
}

