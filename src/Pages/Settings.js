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

export const Settings2 = (props) => {

    console.log('Settings 2 props.mockUser')
    console.log(props.mockUser)
    const [subs, setSubs] = useState(props.mockUser)
    const [availableSubs, setAvailableSubs] = useState([''])

    useEffect(() => {
      getShit()
    }, []);

    const getShit = async () => {
      
      //await setSubs(mockUser.subscriptions)
      setSubs(props.mockUser)

      
      let someShit = subs.map(s => s.channelName)
      console.log('settings 2 someShit')
      console.log(someShit)

      setAvailableSubs(someShit)
      console.log('settings 2 availableSubs')
      console.log(availableSubs)

      console.log('6')
    }

  function changeShit(order, sortable, evt) {
    console.log('order')
    console.log(order)
    console.log('sortable')
    console.log(sortable)
  }

    return (
    
      <div>
        <h1> Settings2 </h1>
        
      <button onClick={() => {
          console.log('subs');
          console.log(subs);
          console.log( subs.map(s => s.channelName))
          setAvailableSubs(subs.map(s => s.channelName))
        }} >log subs </button>

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

export const Settings = () => {

  const [isSigned, setIsSigned] = useState()
  const { user, setUser } = useContext(UserContext);
  const [subs, setSubs] = useState([ ])
  const [subsList, setSubsList] = useState([ ])
  useEffect(() => {
    getShit()
  }, []);
    
  async function getShit() {
    let mockUser = await ServerEndpoints.getMockUser()
    await setSubs(mockUser.subscriptions)
    await setSubsList( mockUser.subscriptions.map( s => s.channelName ))

    //subz = subs.map(s => (<div className="block" data-id={s.channelName} key={s.channelId} > {s.channelName} </div> ))
  }

  const SettingsIn = () => {

    const ff = ['Apple', 'Banana', 'Cherry', 'Grape'];
    //<MySortables.SharedGroup2 items={subs} onChange={setSubs}/>
    return (
      <div>
      <MySortables.SharedGroup items={ff} />
        <MySortables.SharedGroup2 items={subsList} onChange={setSubsList}/>
        <h1> SettingsIn </h1>
        <button onClick={() => {
          console.log('subs');
          console.log(subs);
        }} >log subs </button>
 
        <Sortable
          className="block-list"
          options={{
            group: 'shared'
          }}
          chosenClass="sortable-chosen"
          onChange={(order, sortable, evt) => { setSubs(order) }} >
          {subs.map(s => (<div className="block" data-id={s.channelName} key={s.channelId} > {s.channelName} </div> ))}
        </Sortable>
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
      {/*!user ? <h1> You need to be logged in </h1> : <h1> YOUR IN! </h1> 
      */}
      <h1> ~~~~~~~~~~~~~~~~~~~~~~~~~ </h1>
        {!user ? <SettingsOut /> : <Settings2  mockUser={subs}/> }
      <h1> ~~~~~~~~~~~~~~~~~~~~~~~~~ </h1>
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
      <MySortables.FruitsSort />
      <MySortables.GeneralList />
      <MySortables.Fruits />
        <h3> Shared grup </h3>
      <MySortables.SharedGroup items={['Apple', 'Banana', 'Cherry', 'Grape']} />
            <h4> (shared) extra space for testing </h4>
      <MySortables.SharedGroup items={['Lemon', 'Orange', 'Pear', 'Peach']} />
      <MySortables.ControlGroup />
      <h3>====================================</h3>
      <div/>
      <ButtonsAuthDebug/>
    </div>
  );
}

