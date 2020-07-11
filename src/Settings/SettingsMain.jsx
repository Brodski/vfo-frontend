import React, { Fragment, useContext, useEffect, useState } from 'react';

import "react-responsive-carousel/lib/styles/carousel.min.css";
import * as ServerEndpoints from '../HttpRequests/ServerEndpoints';
import * as stLogic from '../BusinessLogic/SettingsLogic';
import * as Common from '../BusinessLogic/Common'
import {
  IsInitFinishedContext,
  UserContext,
  UserSettingsContext
} from '../Contexts/UserContext.js'

import AllShelfs from './AllShelfs.jsx';
import Footer from '../Components/Footer.jsx';
import GreetingsMsg from '../Components/GreetingsMsg.jsx'
import HowTo from './HowTo'
import LoadingMain from '../Components/LoadingMain.jsx';
import PostSave from './PostSave.jsx';
import TheCarousel from './TheCarousel.jsx';
import DevWithYT from "../Images/DevWithYT-black.png"
import * as GApiAuth from '../HttpRequests/GApiAuth'

const SettingsNEW = () => {
  const { user, setUser } = useContext(UserContext);
  const { userSettings, setUserSettings } = useContext(UserSettingsContext);
  const { isInitFinished } = useContext(IsInitFinishedContext);

  const [shouldRedirect, setShouldRedirect] = useState(false)

  useEffect(() => {
    initThis()
  }, []);

  async function initThis() {
    await GApiAuth.initGoogleAPI()
    if (GApiAuth.isHeSignedIn()) {
        await Common.betterLogin(setUser, setUserSettings, true)
    }
    setUserSettings(user)
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

  async function save() {
    let newSet = { ...userSettings }
    let newCustomShelfs = stLogic.queryShelfs(userSettings)
    let auxNewCustomShelfs = newCustomShelfs.filter(sh => sh.isSorted)
    let yourSubscriptionsShelf = newCustomShelfs.filter(sh => !sh.isSorted)[0]

    // push all the subs (converted to shelfs), which could be found on the left container, to the end of all the other of the shelfs on the right
    if (yourSubscriptionsShelf) {
      let converted = yourSubscriptionsShelf.convertAllSubsToShelfs()
      auxNewCustomShelfs.push(...converted)
      newSet.customShelfs = auxNewCustomShelfs
    }
    if (!user.isDemo) {
      newSet.customShelfs = newSet.customShelfs.filter(sh => sh.fewSubs[0])
      ServerEndpoints.saveUser(newSet)
    }
    setAndManageData(auxNewCustomShelfs)
    setShouldRedirect(true)
  }

  const LoadShelfs = () => {    
    if (isInitFinished) {
      return (<AllShelfs save={save} />)
    }
    return (<LoadingMain />)
  }

  const Organize = () => {
    return (
      <div>
        <h4 className="set-top-title"> Organize <HowTo /> </h4>
        {/* <img className="dev-with-yt-demo" src={DevWithYT} /> */}
      </div>
    )
  }
  
  const HowTo2 = () => {
    return (
      <div className="center-align cara2">
        {isInitFinished ? <TheCarousel /> : null}
      </div>
    );
  }

  return (
    <Fragment>
      <div className="container">
        <div>
          <div className="set-top-tophalf ">
            {isInitFinished ? <GreetingsMsg isSettingsPage={true} /> : null}
            {isInitFinished ? <Organize /> : null}
          </div>
          <div>
            {isInitFinished ? <HowTo2 /> : null}
          </div>
          <div className='div-aux' />
        </div>
        {shouldRedirect
          ? <PostSave />
          : <LoadShelfs />}
        <div className='div-aux about-div-padding' />
      </div>
      {isInitFinished ? <Footer /> : null}
    </Fragment>
  );
}
export default SettingsNEW