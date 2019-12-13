import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../Contexts/UserContext.js'
import { ButtonsAuthDebug } from '../Components/ButtonsAuthDebug';
import { LoginLogout } from '../Components/LoginLogout'
import * as GApiAuth from '../HttpRequests/GApiAuth'
import { User } from '../Classes/User'
import { Subscription } from '../Classes/Subscription'
import * as ServerEndpoints from '../HttpRequests/ServerEndpoints';

import * as NestedStuff from '../Components/NestedStuff'

import Sortable from 'react-sortablejs';
import Sortable2 from 'sortablejs';
import PropTypes from 'prop-types';
import * as MySortables from '../Components/MySortables'
import * as SettingsLogic from '../BusinessLogic/SettingsLogic'
import { Example } from '../Components/Dialog';


//  https://www.npmjs.com/package/react-dialog
//  https://github.com/SortableJS/react-sortablejs




const AllShelfs = (props) => {

  console.log("AllShelfs props")
  console.log(props)
  const shelfz = props.shelfs.map(sh => {
    return (<Shelf key={sh.title} title={sh.title} shelfNames={sh.fewSubs.map(s => s.channelName)} />)
  })

  console.log(shelfz)
  
  return (
    <div>
      {shelfz}
    </div>
    )
  }


const Shelf = (props) => {
  console.log("Shelf")
  console.log(props)

  useEffect(() => { 
    makeDraggableShared('.shelf', 'shelfs') //class, group name
    makeDraggableShared('.subListWrapper', 'subscriptions')
  } ,[])
  

  function makeDraggableShared(selector, groupName) {
    var nestedShelf = [].slice.call(document.querySelectorAll(selector));
    for (var i = 0; i < nestedShelf.length; i++) {
	    new Sortable2(nestedShelf[i], {
		    group: groupName,
		    animation: 150,
		    fallbackOnBody: true,
		    swapThreshold: 0.65
	    });
    }
  }


  function buttonLog() {
    var shelfs = [].slice.call(document.querySelectorAll('.subListWrapper'));
    console.log('-----------shelfs-----------')
    console.log(shelfs)
    for (let i = 0; i < shelfs.length; i++) {
      console.log("++ Shelf ++")
      console.log(i)
      for (let sub of shelfs[i].querySelectorAll('.sub-QHack')) {
      console.log(sub)
      console.log(sub.textContent)
      }
    } 
  }
  function editSub(sub) {
      console.log("HI! " + sub)
      // pop up window
      // get filter from user
      // fill with: user filter OR empty filter
      // save button => update filter
      // cancel
  }

  const itemz = props.shelfNames.map((s, idx) => (
        <div className="subitem"> 
            <div id={"subId" + idx} className="sub-QHack" data-id={s} key={s} > {s} </div> 
      <button onClick={() => editSub(s)} > edit </button>
        </div>
        )) 
  return (
    <div className="shelf" >
      <div className="sh-QHack" data-name={props.title}>
        <h3> Custom Sub Shelf: {props.title} </h3>
        <button onClick={(order, sortable, evt) => buttonLog() }> log this Shelf </button>  
        <div className="subListWrapper">
          {itemz}
        </div>
    </div>
  </div>
  
  )
  }
  


const SettingsOut = () => {

  return(
    <h1> Fool! Log in! </h1>
  )
}
export const SettingsNEW = () => {

  let mockUser;
  const { user, setUser } = useContext(UserContext);
  const [subs, setSubs] = useState([ ])
  const [shelfs, setShelfs] = useState([
    { 
      title: '',
      fewSubs: []
    }] )
  
  useEffect(() => {
    console.log("\n\n USE EFFECT \n")
    
    getShit()
  }, []);
    
  async function getShit() {
  console.log("\n\n GET SHIT\n")
    mockUser = await ServerEndpoints.getMockUser() //Probably will "setSubs(actualUser)" in future
    await setSubs(mockUser.subscriptions) 
    console.log('getShit mockUser')
    console.log(mockUser)
    console.log('mockUser.subscriptions')
    console.log(mockUser.subscriptions)
    console.log(mockUser.customShelfs)
    console.log("--------Doing 'setShelfs( mockUser.customShelfs)'------")
    await setShelfs( mockUser.customShelfs )
    let fewSubz = mockUser.customShelfs.map( shelf => shelf.fewSubs.map( s => s.channelName))

  }

  async function shelfsButton() {
    console.log('shelfs')
    console.log(shelfs)
    mockUser = await ServerEndpoints.getMockUser() //Probably will "setSubs(actualUser)" in future
    console.log('mockUser')  
    console.log(mockUser)  
    console.log('mockUser.customShelfs')  
    console.log(mockUser.customShelfs)  
}

  //<CustomSubShelf shelf={shelfs[0]}/>    
  //  {!user ? <SettingsOut /> : <UnsortedSubsShelf  mockUser={subs}/> }
    return (
    <div>  
        <div id="settings-main"> </div>
        <Example />
        <NestedStuff.Nested />
        <LoginLogout user={user}/>
        
        <button onClick={() => setUser('man this is it')} > change user message </button>
        <button onClick={() => console.log(subs)} > Log Subs </button>
        <button onClick={shelfsButton} > (broken) Log shelfs </button>
        
        <AllShelfs shelfs={shelfs} setShelf={setShelfs}/>
      <h1> ```````````````````````` </h1>
        


      <MySortables.AllThisSortableStuff/>
      <ButtonsAuthDebug/>
    </div>
  );
}

