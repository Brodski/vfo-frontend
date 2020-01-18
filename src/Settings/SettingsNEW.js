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
import {HowTo} from './HowTo'
import Pic1 from './action1.jpg'
import Pic2 from './action2.jpg'
import Pic3 from './action3.webp'
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
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
    <div className="container">  
        <a class=" btn save-btn" onClick={save} >Save</a>
        <div>   </div>
        <HowTo />
        
      <div className="carousel-wrap">
        <Carousel 
          showArrows={true} 
          showStatus={false}
          showThumbs={false}
          //width=69
          dynamicHeight={true}
          useKeyboardArrows={true}
          infiniteLoop={true}
          >
          <div>
              <img src={Pic1} />
              <p className="legend">Legend 1</p>
          </div>
          <div>
              <img src={Pic2} />
              <p className="legend">Legend 2</p>
          </div>
          <div>
            <img src={Pic3} />
              <p className="legend">Legend 3</p>
          </div>
        </Carousel>
      </div>
        { shouldRedirect 
          ? <PostSave /> 
          : <LoadShelfs /> }
           
{/*      <h1> ```````````````````````` </h1>      
      <button onClick={logUserAndSettings} > log User & Settings </button>
      
      <button onClick={() => stLogic.logAllShelfs() }> log all Shelf </button>  
      <button onClick={() => stLogic.logIds() }> log IDs Shelf </button>  
      <ButtonsAuthDebug/> */}

    </div>
  );
}
