import React, { useState, useContext, useEffect, Fragment } from 'react';
import GreetingsMsg from '../Common/GreetingsMsg.jsx'
import * as stLogic from '../BusinessLogic/SettingsLogic';
import { UserContext, UserSettingsContext, IsInitFinishedContext } from '../Contexts/UserContext.js'
import Footer from '../Common/Footer.jsx';
import AllShelfs from './AllShelfs.jsx';
import * as ServerEndpoints from '../HttpRequests/ServerEndpoints';
import PostSave                      from './PostSave.jsx';
import LoadingMain                  from '../Common/LoadingMain.jsx';

import HowTo from './HowTo'

// to consider... https://www.npmjs.com/package/choices.js
//  https://www.npmjs.com/package/react-dialog
//  https://github.com/SortableJS/react-sortablejs

/////////////////////////////////////////////////////////////////////////////////////////////
///////////////
///////////////     SETTINGS
///////////////
/////////////////////////////////////////////////////////////////////////////////////////////



const SettingsNEW = () => {
  const { user, setUser } = useContext(UserContext);
  const { userSettings, setUserSettings } = useContext(UserSettingsContext);
  const { isInitFinished2, setIsInitFinished2 } = useContext(IsInitFinishedContext);
  
  const [shouldRedirect, setShouldRedirect] = useState(false)
  const [isInitFinished, setIsInitFinished] = useState(false)

  useEffect(() => {
    console.log("\n\n USE EFFECT \n")
    setUserSettings(user)
    initPage2()
  }, []);
  
async function initPage2() {
  // console.log('isInitFinished2')
  // console.log('isInitFinished2')
  // console.log('isInitFinished2')
  // console.log('isInitFinished2')
  // console.log(isInitFinished2)
  // await GApiAuth.getGoogleAuth() 
    
  // if (GApiAuth.isHeSignedIn() && user.isDemo) {
  //   await Common.loginAndSet(setUser, setUserSettings)
  // }
  // setIsInitFinished(true)
  // while( isInitFinished2) {
  //   console.log('LOOP isInitFinished2')
  //   console.log(isInitFinished2)
  //   await Common.sleep(500)
  // }
}

  /////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////
  ///////////////     -----------------> SAVE
  ///////////////
  /////////////////////////////////////////////////////////////////////////////////////////////


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

  async function save() {
    console.log('----------- SAVING! -----------')
    let newSet = { ...userSettings }    
    let newCustomShelfs = stLogic.queryShelfs(userSettings)
    console.log('newCustomShelfs (after query)')
    console.log('newCustomShelfs (after query)')
    console.log('newCustomShelfs (after query)')
    console.log('newCustomShelfs (after query)')
    console.log(newCustomShelfs)

    let auxNewCustomShelfs = newCustomShelfs.filter( sh => sh.isSorted)
    let yourSubscriptionsShelf = newCustomShelfs.filter( sh => !sh.isSorted)[0]

    // push all the subs (converted to shelfs) on the left container to the end of all the other of the shelfs on the right
    if (yourSubscriptionsShelf) {
      let converted = yourSubscriptionsShelf.convertAllSubsToShelfs()
      auxNewCustomShelfs.push(...converted)
      newSet.customShelfs = auxNewCustomShelfs
    }
    if (!user.isDemo) {
      newSet.customShelfs = newSet.customShelfs.filter( sh =>  sh.fewSubs[0] )
      ServerEndpoints.saveUser(newSet)
    }
    setAndManageData(auxNewCustomShelfs)
    setShouldRedirect(true)
  } 


  const LoadShelfs = () => {
    if (isInitFinished2) {
      return ( <AllShelfs userSettings={userSettings} setUserSettings={setUserSettings} save={save} /> )
    }
    return ( <LoadingMain /> )
  }

  const Customize = () => {
    return (
      <div>
        <h4 className="set-top-title"> Customize <HowTo /> </h4>
      </div>
    )
  }

  return (
    <Fragment>
      
      <div className="container" >  
        
        <div className="set-topbody">
          <div className="set-top-tophalf ">
            { isInitFinished2 ? <GreetingsMsg isSettingsPage={true} /> : null}    
            { isInitFinished2 ? <Customize /> : null}    
          </div>          
          {/* { isInitFinished2 ? <div>This is a demo profile</div> : null}      */}
          {/* <div className="divider" /> */}
          <div className='div-aux' />
        </div>
        { shouldRedirect 
            ? <PostSave /> 
            : <LoadShelfs />}
        {/* <h1> ```````````````````````` </h1>      
        <button onClick={logUserAndSettings} > log User & Settings </button>
        
        <button onClick={() => stLogic.logAllShelfs() }> log all Shelf </button>  
        <button onClick={() => stLogic.logIds() }> log IDs Shelf </button>  
        <ButtonsAuthDebug/> */}
        <div className='div-aux about-div-padding' />
      </div>
      
      {/* {isInitFinished ? <Footer /> : null } */}
      {isInitFinished2 ? <Footer /> : null }
    </Fragment>
    );
}
export default SettingsNEW