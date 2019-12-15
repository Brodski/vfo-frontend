import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../Contexts/UserContext.js'
import { UserSettingsContext } from '../Contexts/UserContext.js'
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
import { FilterDialog, Example } from '../Components/Dialog';
import { Filter } from '../Classes/Filter'
import { UserShelf } from '../Classes/UserShelf'
import { CustomShelf } from '../Classes/User'
import * as Common from '../BusinessLogic/Common.js';
//  https://www.npmjs.com/package/react-dialog
//  https://github.com/SortableJS/react-sortablejs




const AllShelfs = (props) => {

  console.log("AllShelfs props")
  console.log(props)
  const shelfz = props.shelfs.map(sh => {
    return (<Shelf key={sh.title} title={sh.title} shelfNames={sh.fewSubs.map(s => s.channelName)}
      shelfObj={sh.fewSubs} userSettings={props.userSettings} setUserSettings={props.setUserSettings} setUser={props.setUser}/>)
  })

  function addShelf() {
//    console.log('BEFORE')
  //  console.log(props.userSettings)
    props.setUserSettings(prevUser => {
      let damn = { ...prevUser }
      let cs = new CustomShelf()
      cs.title = "Shelf " + (damn.customShelfs.length + 1)
      damn.customShelfs.push(cs)
      return damn
    })
    
 //   console.log('AFTER')
  //  console.log(props.userSettings)
    //props.setUser
  
//      <Shelf title="New Shelf" shelfNames={['']} shelfObj={new UserShelf()} setUser={props.setUser} />
  
}
  function save() {
    console.log("SAVE!!!!!!!!")
//    console.log(props)
    props.setUser(props.userSettings)
    props.setUserSettings(props.userSettings)
  //  console.log(props)
  }
  
  return (
    <div>
      <button onClick={save}> Save </button>
      {shelfz}
      <button onClick={addShelf} > Add shelf </button>
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
      console.log(sub.dataset)
      console.log(sub.textContent)
      }
    } 
  }

    const itemz = props.shelfObj.map((s, idx) => (
    <div className="subitem">
        <div id={"subId" + idx} className="sub-QHack" data-id={s.channelName} key={s.channelName}> {s.channelName} </div> 
        <div id={s.channelName.replace(/ /g,'')} />
        <FilterDialog userSettings={props.userSettings} setUserSettings={props.setUserSettings} subObj={s} bindToId={s.channelName.replace(/ /g, '')} />
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
  /*
  const itemz = props.shelfNames.map((s, idx) => (
    <div className="subitem">
      <div id={"subId" + idx} className="sub-QHack" data-id={s} key={s} > {s} </div> 
      <div id={s.replace(/ /g,'')} />
      <FilterDialog  bindToId={s.replace(/ /g, '')} title={s} />
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
  */
  
  }
  


const SettingsOut = () => { 
  return( <h1> Fool! Log in! </h1> ) 
  }

export const SettingsNEW = () => {

  let mockUser;
  const { user, setUser } = useContext(UserContext);
  const [subs, setSubs] = useState([ ])
  const { userSettings, setUserSettings } = useContext(UserSettingsContext);
  //const [tempUser, setTempUser] = useState(new User())
  const [shelfs, setShelfs] = useState([
    { 
      title: '',
      fewSubs: []
    }] )
  
  useEffect(() => {
    console.log("\n\n USE EFFECT \n")
    
    getShit()
  }, []);

  async function setHack_TempUser() {
    while (user.Id == null) {
      await Common.sleep(1000)
      console.log('sleeping..........')
    }
    //setTempUser(user)
  }

    
  async function getShit() {
    //setTempUser(user)
    //setHack_TempUser()
    console.log("\n\n GET SHIT\n")
    console.log("ACTUAL USER: \n")
    console.log(user)
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
    console.log('\n\n\nuserSettings')
    console.log(userSettings)
}

  function testSave(s) {
    console.log("user")
    console.log(user)
    let newDude =  user
    //let shwing = { ...user, ...user.subscriptions: { ...user.subscriptions }}
    newDude.subscriptions[0].filter.minDuration="yeah!"
    console.log(newDude)
    setUser(newDude)
    console.log(user)
    
    console.log('find user')
    let xsub =  user.subscriptions.find( s => s.channelName == "The Hill")
    let xsub2 =  user.subscriptions.find( s => s.channelName == "SMTOWN")
    let xsubInd =  user.subscriptions.findIndex( s => s.channelName == "SMTOWN")
    console.log(xsub)
    console.log(xsub2)
    console.log(xsubInd)
    let ff = new Filter() 
    ff.requireKeyword.push("req word")
    xsub2.filter = ff
    newDude.subscriptions[xsubInd].filter = ff
    setUser(newDude)
    console.log(user)
    //setUser({ subscriptions[0].filter.minDuration: "hey!!!!"})
    //console.log(user)

    //setUser

  }

  //<CustomSubShelf shelf={shelfs[0]}/>    
  //  {!user ? <SettingsOut /> : <UnsortedSubsShelf  mockUser={subs}/> }
    return (
    <div>  
        <button onClick={testSave} > test save </button>
        <div id="settings-main"> </div>
        <Example text="Hey suckah!" />
        <NestedStuff.Nested />
        <LoginLogout user={user}/>
        
        {/*<button onClick={() => setUser('man this is it')} > change user message </button>*/}
        <button onClick={() => console.log(subs)} > Log Subs </button>
        <button onClick={shelfsButton} > (shelfsButton) </button>
        
        {/*<AllShelfs shelfs={shelfs} setShelf={setShelfs}/>*/}
        {/*<AllShelfs user={user} shelfs={user.customShelfs} setUser={setUser} setShelf={setShelfs}/>*/}
        <AllShelfs shelfs={userSettings.customShelfs}
           userSettings={userSettings} setUserSettings={setUserSettings}  setUser={setUser} setShelf={setShelfs}/>
      <h1> ```````````````````````` </h1>
        
      <label> wtf is this
              
            </label>
      <MySortables.AllThisSortableStuff/>
      <ButtonsAuthDebug/>
    </div>
  );
}

