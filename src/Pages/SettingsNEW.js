import React, { useState, useContext, useEffect } from 'react';
import * as stLogic from '../BusinessLogic/SettingsLogic';
import { UserContext } from '../Contexts/UserContext.js'
import { UserSettingsContext } from '../Contexts/UserContext.js'
import { ButtonsAuthDebug } from '../Components/ButtonsAuthDebug';
import { LoginLogout } from '../Components/LoginLogout'
import { AllShelfs } from '../Components/SettingsAllShelfs';
import * as ServerEndpoints from '../HttpRequests/ServerEndpoints';

import { PostSave } from '../Components/PostSave';



import Sortable2 from 'sortablejs';


import * as SettingsLogic from '../BusinessLogic/SettingsLogic'

import { CustomShelf } from '../Classes/User'
import * as Common from '../BusinessLogic/Common.js';

// to consider... https://www.npmjs.com/package/choices.js


//import Tags from "@yaireo/tagify/react.tagify"
//  https://www.npmjs.com/package/react-dialog
//  https://github.com/SortableJS/react-sortablejs
//  https://github.com/yairEO/tagify

// css: https://css-tricks.com/snippets/css/a-guide-to-flexbox/


  /*const tagSettings = {
    maxTags: 6,
    placeholder: "type something",
    dropdown: { enabled: 0 }// a;ways show suggestions dropdown
   }*/


  /////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////
  ///////////////     SETTINGS
  ///////////////
  /////////////////////////////////////////////////////////////////////////////////////////////


export const SettingsNEW = () => {
//export class SettingsNEW extends React.Component {

  
  const { user, setUser } = useContext(UserContext);
  const { userSettings, setUserSettings } = useContext(UserSettingsContext);
  const [tagifyProps, setTagifyProps] = useState([])
  const [kickIt, setKickIt] = useState(true)
  useEffect(() => {
    console.log("\n\n USE EFFECT \n")
    setTagifyProps({value: ["from settingsz"], showDropdown: false})

  }, []);
  
  
  async function shelfsButton() {

    console.log('user')  
    console.log(user)  
    console.log('\n\n\nuserSettings')
    console.log(userSettings)
}



  /////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////
  ///////////////     -----------------> SAVE
  ///////////////
  /////////////////////////////////////////////////////////////////////////////////////////////


  async function save() {
    //console.log('----------- SAVING! -----------')
    
    let newCustomShelfs = stLogic.queryShelfs(userSettings)
    
    let newS = { ...userSettings }
    newS.customShelfs = newCustomShelfs
    setUserSettings(newS)
    setUser(newS)
    setKickIt(false)
    if (!user.isDemo) {
      ServerEndpoints.saveSettings(user)
    }
    /*setUserSettings(prevUserSetting => {
      let newS = { ...prevUserSetting }
      newS.customShelfs = newCustomShelfs
      return newS
    })
    setUser(prevUserSetting => {
      let newS = { ...prevUserSetting }
      newS.customShelfs = newCustomShelfs
      return newS
     })    
     */
  } 

  function logUS() {
    console.log(userSettings)
  }
  
    return (
    <div>  
        {/*<Tags settings={tagSettings} {...tagifyProps} />    
        <input i.d="sometag" /> 
        <NestedStuff.Nested />*/}
        
        <LoginLogout user={user}/>
        <button onClick={shelfsButton} > (shelfsButton) </button>
        
        <button onClick={save} > Save </button>
        <button onClick={logUS} > log user settomg </button>
        <div >
        { kickIt ? <AllShelfs userSettings={userSettings} setUserSettings={setUserSettings} /> : <PostSave /> }
        </div>
      <h1> ```````````````````````` </h1>
        
        {/*<MySortables.AllThisSortableStuff/>*/}
      <ButtonsAuthDebug/>
    </div>
  );
}
