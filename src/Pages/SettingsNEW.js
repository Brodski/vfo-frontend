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
import { FilterDialog } from '../Components/Dialog';
import { Filter } from '../Classes/Filter'
import { UserShelf } from '../Classes/UserShelf'
import { CustomShelf } from '../Classes/User'
import * as Common from '../BusinessLogic/Common.js';

import Tagify from '@yaireo/tagify'

import Tags from "@yaireo/tagify/dist/react.tagify"

//import Tags from "@yaireo/tagify/react.tagify"
//  https://www.npmjs.com/package/react-dialog
//  https://github.com/SortableJS/react-sortablejs
//  https://github.com/yairEO/tagify

//import Tagify from '@yaireo/tagify'


  /*const tagSettings = {
    maxTags: 6,
    placeholder: "type something",
    dropdown: { enabled: 0 }// a;ways show suggestions dropdown
   }*/
  


  /////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////
  ///////////////     SHELFS ALL
  ///////////////
  /////////////////////////////////////////////////////////////////////////////////////////////

const AllShelfs = (props) => {

  console.log("AllShelfs props")
  console.log(props)
  const shelfz = props.shelfs.map(sh => {
    return (<Shelf title={sh.title} key={sh.title}
      shelfObj={sh.fewSubs} userSettings={props.userSettings} setUserSettings={props.setUserSettings} setUser={props.setUser}/>)
  })
  
  function addShelf() {
    props.setUserSettings(prevUserSetting => {
      let newS = { ...prevUserSetting }
      let cs = new CustomShelf()
      cs.title = "Shelf " + (newS.customShelfs.length + 1)
      newS.customShelfs.push(cs)
      return newS
    })
  }
  
  function logIds() {
    var shelfs = [].slice.call(document.querySelectorAll('.subListWrapper'));
    console.log('----------- I D S -----------')
    console.log(shelfs)
    for (let i = 0; i < shelfs.length; i++) {
      console.log(`${i} ++ Shelf ++`)
      for (let sub of shelfs[i].querySelectorAll('.subitem')) {
        console.log(sub)
        console.log(sub.id)
      }
    }
  }

  function logAllShelfs() {
    var shelfs = [].slice.call(document.querySelectorAll('.subListWrapper'));
    console.log('-----------shelfs-----------')
    console.log(shelfs)

    for (let i = 0; i < shelfs.length; i++) {
      console.log(`${i} ++ Shelf ++`)
      for (let sub of shelfs[i].querySelectorAll('.sub-QHack')) {
      console.log(sub)
      console.log(sub.dataset)
      console.log(sub.id)
      console.log(sub.textContent)
      }
    } 
  }
  
  return (
    <div id="allbloodyshelfs">
      <button onClick={(order, sortable, evt) => logAllShelfs() }> log all Shelf </button>  
      <button onClick={(order, sortable, evt) => logIds() }> log IDs Shelf </button>  
      {shelfz}
      <button onClick={addShelf} > Add shelf </button>
    </div>
    )
  }

  /////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////
  ///////////////     A SHELF
  ///////////////
  /////////////////////////////////////////////////////////////////////////////////////////////

const Shelf = (props) => {
  useEffect(() => {
    makeDraggableShared('.shelf', 'shelfs') //class, group name
    makeDraggableShared('.subListWrapper', 'subscriptions')
  }, [])


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
  
  const itemz = props.shelfObj.map((s, idx) => {
  var d = new Date();
  var seconds = d.getTime();
    return (
      <div className="subitem" key={s.channelName} id={s.channelName.replace(/ /g, '') }>
        <div className="sub-QHack" data-name={s.channelName}> {s.channelName} </div>
        <FilterDialog userSettings={props.userSettings} setUserSettings={props.setUserSettings} subObj={s} bindToId={s.channelName.replace(/ /g, '') } />
      </div>
    )
  }) 

  //<div className="sh-QHack" data-name={props.title} key={props.title}>
  //id={props.bindToId}

  // REMOVED key={props.title}  FROM classname="sh-QHack"
  return (
    <div className="shelf" >
      <div className="sh-QHack" data-name={props.title} data-id={props.title} >
        <h3> Custom Sub Shelf: {props.title} </h3>
        <div className="subListWrapper">
          {itemz}
        </div>
    </div>
  </div>
  )  
}
  


  
  /////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////
  ///////////////     SETTINGS
  ///////////////
  /////////////////////////////////////////////////////////////////////////////////////////////


export const SettingsNEW = () => {
//export class SettingsNEW extends React.Component {

  let mockUser;
  const { user, setUser } = useContext(UserContext);
  const { userSettings, setUserSettings } = useContext(UserSettingsContext);
  const [tagifyProps, setTagifyProps] = useState([])
  const [kickIt, setKickIt] = useState(true)
  useEffect(() => {
    console.log("\n\n USE EFFECT \n")
    setTagifyProps({value: ["from settingsz"], showDropdown: false})
    getShit()
    console.log(kickIt)
    console.log(kickIt ? "kick it is true" : "Kick it is false")

  //  var input = document.querySelector('#sometag');
//    new Tagify(input)s
  }, []);

  useEffect(() => {
    if (kickIt == false) {
      waitNStuff()
    }
  },[kickIt])

  async function waitNStuff() {
    console.log('user & userSettings')
    console.log(user)
    console.log(userSettings)
    //await Common.sleep(10000)
    //window.location.reload(true)
  }

  async function getShit() {
    mockUser = await ServerEndpoints.getMockUser() //Probably will "setSubs(actualUser)" in future    
  }
  
  async function shelfsButton() {

    console.log('user')  
    console.log(user)  
    console.log('\n\n\nuserSettings')
    console.log(userSettings)
}

  async function testSave(s) {

    //var shelfs = [].slice.call(document.querySelectorAll('.subListWrapper'));
    var shelfs = [].slice.call(document.querySelectorAll('.sh-QHack'));
    //let subx1 = shelfs2[0].querySelectorAll('.sub-QHack')
    console.log('----------- SAVING! -----------')
    console.log('userSettings')
    console.log(userSettings)

    let newCustomShelfs = []
    for (let i = 0; i < shelfs.length; i++) {
      console.log(`${i} ++ Shelf ++`)
      let newShelf = new CustomShelf()
      newShelf.title = shelfs[i].dataset.name
      for (let sub of shelfs[i].querySelectorAll('.sub-QHack')) {
        //console.log(shelfs[i].dataset.name)
        console.log(sub)
        console.log(sub.dataset)
        let idxs = findSubIndex(sub.dataset.name)
        let tempSub = userSettings.customShelfs[idxs.shelfIndex].fewSubs[idxs.subIndex]
        newShelf.fewSubs.push(tempSub)

      }
      console.log('newShelf')
      console.log(newShelf)
      if (newShelf.fewSubs[0]) {
        newCustomShelfs.push(newShelf)
      }

    }

    console.log('\n\n\nnewCustomShelfs')
    console.log(newCustomShelfs)
    
    console.log('setKickIt(false)')
    setKickIt(false)
    setUserSettings(prevUserSetting => {
      let newS = { ...prevUserSetting }
      newS.customShelfs = newCustomShelfs
      return newS
    })
    setUser(prevUserSetting => {
      let newS = { ...prevUserSetting }
      newS.customShelfs = newCustomShelfs
      return newS
     })
    var d = new Date();
    var seconds = d.getTime()/1000;
    console.log(seconds)
    console.log(d.getTime())
    //window.location.reload()
    
  } 
  //  {!user ? <SettingsOut /> : <UnsortedSubsShelf  ={subs}/> }
  function findSubIndex(chName) {
    let subIndex, shelfIndex = 0;
    for (let sh of userSettings.customShelfs) {
      subIndex = sh.fewSubs.findIndex(s => s.channelName == chName) 
      if (subIndex > -1) { break }
      shelfIndex += 1;
    }
    console.log({ shelfIndex, subIndex })
    return { shelfIndex, subIndex }
  }


  
    return (
    <div>  
        {/*<Tags settings={tagSettings} {...tagifyProps} />    
        <input i.d="sometag" /> 
        <NestedStuff.Nested />*/}
        
        <LoginLogout user={user}/>
        <button onClick={shelfsButton} > (shelfsButton) </button>
        
        {/*<AllShelfs shelfs={shelfs} setShelf={setShelfs}/>*/}
        {/*<AllShelfs user={user} shelfs={user.customShelfs} setUser={setUser} setShelf={setShelfs}/>*/}
        <button onClick={testSave} > test save </button>
        { kickIt ? <AllShelfs shelfs={userSettings.customShelfs} 
          userSettings={userSettings} setUserSettings={setUserSettings} setUser={setUser} /> : <div> THANK YOU </div>}
      <h1> ```````````````````````` </h1>
        
        {/*<MySortables.AllThisSortableStuff/>*/}
      <ButtonsAuthDebug/>
    </div>
  );
}

/*async function setHack_TempUser() {
    while (user.Id == null) {
      await Common.sleep(1000)
      console.log('sleeping..........')
    }
  } */