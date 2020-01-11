import React, { useState, useContext, useEffect } from 'react';
import * as stLogic from '../BusinessLogic/SettingsLogic';
import { UserContext, UserSettingsContext, IsLoggedContext } from '../Contexts/UserContext.js'
import {  } from '../Contexts/UserContext.js'
import { ButtonsAuthDebug } from '../Common/ButtonsAuthDebug';

import { AllShelfs } from '../Settings/SettingsAllShelfs';
import * as ServerEndpoints from '../HttpRequests/ServerEndpoints';
import  * as GApiAuth                   from '../HttpRequests/GApiAuth';
import * as ytLogic                     from '../BusinessLogic/ytLogic.js'
import * as Common                      from '../BusinessLogic/Common'
import { PostSave }                     from '../Settings/PostSave';
import { LoadingMain }                  from '../Common/LoadingMain';

import Sortable2 from 'sortablejs';
import * as SettingsLogic from '../BusinessLogic/SettingsLogic'

import { CustomShelf } from '../Classes/User'

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
  
  const [shouldRedirect, setShouldRedirect] = useState(false)
  const [isInitFinished, setIsInitFinished] = useState(false)

  useEffect(() => {
    console.log("\n\n USE EFFECT \n")
    setUserSettings(user)
    initPage2()
  }, []);
  
async function initPage2() {
  await GApiAuth.getGoogleAuth() 
    
  if (GApiAuth.isHeSignedIn() && user.isDemo) {
    await Common.loginAndSet(setUser, setUserSettings)
  }
  setIsInitFinished(true)
}

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
    setShouldRedirect(true)

    
    let newSet = { ...userSettings }    
    let newCustomShelfs = stLogic.queryShelfs(userSettings)
    console.log('newCustomShelfs (after query)')
    console.log('newCustomShelfs (after query)')
    console.log('newCustomShelfs (after query)')
    console.log('newCustomShelfs (after query)')
    console.log(newCustomShelfs)

    let auxNewCustomShelfs = newCustomShelfs.filter( sh => sh.isSorted)
    let yourSubscriptionsShelf = newCustomShelfs.filter( sh => !sh.isSorted)[0]

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
    //TODO looks a bit silly
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

  const LoadShelfs = () => {
    if (isInitFinished) {
      return ( <AllShelfs userSettings={userSettings} setUserSettings={setUserSettings} /> )
    }
    else {
      return ( <LoadingMain /> )
    }
      
  }

    return (
    <div>  
        <button onClick={save} > Save </button>
        <div></div>
        <button onClick={logUserAndSettings} > log User & Settings </button>
        <ButtonsAuthDebug/>
        <div >
        { shouldRedirect 
          ? <PostSave /> 
          : <LoadShelfs /> }
        </div>
      <h1> ```````````````````````` </h1>      
    </div>
  );
}