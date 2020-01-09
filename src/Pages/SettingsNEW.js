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
//  https://www.npmjs.com/package/react-dialog
//  https://github.com/SortableJS/react-sortablejs

/////////////////////////////////////////////////////////////////////////////////////////////
///////////////
///////////////     SETTINGS
///////////////
/////////////////////////////////////////////////////////////////////////////////////////////


export const SettingsNEW = () => {
  const { user, setUser } = useContext(UserContext);
  const { userSettings, setUserSettings } = useContext(UserSettingsContext);
  
  const [kickIt, setKickIt] = useState(true)

  useEffect(() => {
    console.log("\n\n USE EFFECT \n")
    setUserSettings(user)
  }, []);
  
  
  async function logUserAndSettings() {

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
    console.log('----------- SAVING! -----------')

    
    let newSet = { ...userSettings }    
    let newCustomShelfs = stLogic.queryShelfs(userSettings)
    setKickIt(false)
    console.log('newCustomShelfs (after query)')
    console.log('newCustomShelfs (after query)')
    console.log('newCustomShelfs (after query)')
    console.log('newCustomShelfs (after query)')
    console.log(newCustomShelfs)


    let auxNewCustomShelfs = newCustomShelfs.filter( sh => sh.isSorted)
    
    let yourSubscriptionsShelf = newCustomShelfs.filter( sh => !sh.isSorted)[0]
    console.log('yourSubscriptionsShelf')
    console.log(yourSubscriptionsShelf)

    if (yourSubscriptionsShelf) {
      let converted = yourSubscriptionsShelf.convertAllSubsToShelfs()
      auxNewCustomShelfs.push(...converted)
      newSet.customShelfs = auxNewCustomShelfs
    }

    if (!user.isDemo) {
      ServerEndpoints.saveUser(newSet)
    }

    setAndManageData(auxNewCustomShelfs)
  } 

  function setAndManageData(auxNewCustomShelfs) {
    //TODO could be better
    setUserSettings(prevUserSetting => {
      let newS = { ...prevUserSetting }
      newS.customShelfs = auxNewCustomShelfs
      return newS
    })

    setUser(prevUserSetting => {
      let newS = { ...prevUserSetting }
      newS.customShelfs = auxNewCustomShelfs
      return newS
     })    

  }

    return (
    <div>  
        {/*<LoginLogout user={user}/>*/}
        <button onClick={save} > Save </button>
        <div></div>
        <button onClick={logUserAndSettings} > log User & Settings </button>
        <ButtonsAuthDebug/>
        <div >
        { kickIt ? <AllShelfs userSettings={userSettings} setUserSettings={setUserSettings} /> : <PostSave /> }
        </div>
      <h1> ```````````````````````` </h1>
        
        {/*<MySortables.AllThisSortableStuff/>*/}
      
    </div>
  );
}
