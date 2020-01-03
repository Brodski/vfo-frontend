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
//  https://github.com/yairEO/tagify

// css: https://css-tricks.com/snippets/css/a-guide-to-flexbox/


  /////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////
  ///////////////     SETTINGS
  ///////////////
  /////////////////////////////////////////////////////////////////////////////////////////////


export const SettingsNEW = () => {
//export class SettingsNEW extends React.Component {

  
  const { user, setUser } = useContext(UserContext);
  const { userSettings, setUserSettings } = useContext(UserSettingsContext);
  
  const [kickIt, setKickIt] = useState(true)
  useEffect(() => {
    console.log("\n\n USE EFFECT \n")
    setUserSettings(user)
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
    console.log('----------- SAVING! -----------')
    
    let newCustomShelfs = stLogic.queryShelfs(userSettings)
    console.log('newCustomShelfs')
    console.log(newCustomShelfs)

    setKickIt(false)

    let newSet = { ...userSettings }
    
    //let auxNewCustomShelfs = newSet.customShelfs.filter( sh => sh.isSorted)
    //let unSort = newSet.customShelfs.filter( sh => !sh.isSorted)[0]

    let auxNewCustomShelfs = newCustomShelfs.filter( sh => sh.isSorted)
    let unSort = newCustomShelfs.filter( sh => !sh.isSorted)[0]

    console.log('unSort')
    console.log('unSort')
    console.log('unSort')
    console.log('unSort')
    console.log('unSort')
    console.log('unSort')
    console.log('unSort')
    console.log('unSort')
    console.log('unSort')
    console.log('unSort')
    console.log(unSort)
    if (unSort) {
      unSort.fewSubs.map(sub => {
        let newSh = new CustomShelf()
        newSh.title = sub.channelName
        newSh.isSorted = false // sh.isSorted = false
        newSh.fewSubs = [sub]
        console.log("Pushing newSh: ")
        console.log(newSh)
        auxNewCustomShelfs.push(newSh)
      })
      console.log('user after save')
      newSet.customShelfs = auxNewCustomShelfs
      console.log(newSet)
      console.log('BROTHER!!!! auxNewCustomShelfs')
      console.log(auxNewCustomShelfs)
    }
    if (!user.isDemo) {
      //ServerEndpoints.saveUser(newS)
      console.log("Saving newSet: ")
      console.log(newSet)
      ServerEndpoints.saveUser(newSet)
    }
    setUserSettings(prevUserSetting => {
      let newS = { ...prevUserSetting }
      //newS.customShelfs = newCustomShelfs
      newS.customShelfs = auxNewCustomShelfs
      return newS
    })
    setUser(prevUserSetting => {
      let newS = { ...prevUserSetting }
      //newS.customShelfs = newCustomShelfs
      newS.customShelfs = auxNewCustomShelfs
      return newS
     })    
    
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
        <button onClick={logUS} > log user settings </button>
        <button onClick={() => console.log(user)} > log user </button>
        <div >
        { kickIt ? <AllShelfs userSettings={userSettings} setUserSettings={setUserSettings} /> : <PostSave /> }
        </div>
      <h1> ```````````````````````` </h1>
        
        {/*<MySortables.AllThisSortableStuff/>*/}
      <ButtonsAuthDebug/>
    </div>
  );
}
