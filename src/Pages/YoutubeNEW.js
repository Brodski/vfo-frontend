import React, { useState, useEffect, useContext, createContext } from 'react';


import { SECRET_KEYS } from '../api-key';
import { UserContext, UserSettingsContext } from '../Contexts/UserContext.js';
import * as Common                    from '../BusinessLogic/Common.js';
import * as ytLogic                     from '../BusinessLogic/ytLogic.js'
import * as youtubeApi                  from "../HttpRequests/youtubeApi";
import * as ServerEndpoints             from '../HttpRequests/ServerEndpoints.js'
import  * as GApiAuth                   from '../HttpRequests/GApiAuth';
import { FinalShelfs }                 from '../Classes/FinalShelfs'
import { ShelfsMany }                   from '../Components/ShelfsMany';
import { ChannelForm }                  from '../Components/ChannelForm';
import { ButtonsAuthDebug }             from '../Components/ButtonsAuthDebug';

import { CustomShelf, VidCounter }    from '../Classes/User';

import axios from 'axios';
import InfiniteScroll                 from 'react-infinite-scroller';
import nextId  from "react-id-generator";
import * as moment from 'moment';

//UseState and accessing it before api is recieved https://stackoverflow.com/questions/49101122/cant-access-objects-properties-within-object-in-react
// react infinite scroll https://github.com/CassetteRocks/react-infinite-scroller#readme
// simpe react pagation https://codepen.io/grantdotlocal/pen/zReNgE
export function YoutubeNEW() {

  const initialPageLength = 3;
  let prevPage;
  let spamLimit = 25;
  let spamCount = 0;
  const { user, setUser }                   = useContext(UserContext);
  const { userSetings, setUserSettings }    = useContext(UserSettingsContext);
  const [pageLength, setPageLength]         = useState(initialPageLength);
  const [hasMoreShelfs, setHasMoreShelfs]   = useState(false); //At start, there are no shelfs, thus we have no more shelfs

  const [finalShelfs, setFinalShelfs]       = useState( new FinalShelfs())
  const [numVids, setNumVids]               = useState( [new VidCounter()] ) // {vids: 0, shelfId: '' 


  const [isLogged, setIsLogged] = useState(false)
  let GoogleAuthxxx;
          
  ////////////////////////////////////////////////////
  moment.updateLocale('en', {
    relativeTime: {
      m: "1 minute",
      h: "1 hour",
      d: "1 day",
      M: "1 month",
      y: "1 year",
    }
  });

  ///////////////////////////////////////////// //Since state variable has 'new User()' default 'values', we need to check for actual user existence

  // This is the finalShelf:
  //
  // PageOfShelfs = finalShelfs = [ shelf, shelf, shelf ]
  // shelf        = [ vid, vid, vid, vid ]
  // vid          = { id, snippet: {}, contentDetails: {} }
  let isFirst = true;
  const [shittyCount, setShittyCount] = useState(0)
  let GoogleAuth;
  /*
  useEffect(() => {

    console.log("\n\n\n\nHELLO YOU SHOULD ONLY SEE ME ONCE!!!!!!!!!!!!!!!!!!\n\n\n\n")
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://apis.google.com/js/client.js";
    script.async = true
    document.body.appendChild(script)
    script.onload = () => {
      initShit()
    }
  }, [])
  */
  useEffect( () => {
    console.log('---------------useEffect top ----------------------')
    initShit()
    console.log('---------------useEffect bot----------------------')
  //}, [user])
  }, [isLogged])

  useEffect(() => {
    console.log("Google log in status changed")
    console.log("Google log in status changed")
    console.log("Google log in status changed")
    console.log("Google log in status changed")
    console.log("Google log in status changed")
  }, [isLogged])
  

  async function initShit() {
    await doGAuth()

    console.log('user, isLogged?')
    console.log(isLogged)
    console.log(user)
    if (shittyCount > 6) {  return   }
    setShittyCount( prev => prev + 1)
    /*if (ytLogic.hasUsedRecently()) { //3 min
        console.log("Request recently used. Using local storage")
        let shelfsVids = ytLogic.getStorageShelfs()
        setFinalShelfs(shelfsVids)
        setHasMoreShelfs(true)    //We now have shelfs to be rendered
      } */
    if (!GApiAuth.isHeSignedIn() && user.isDemo) {
    //  loadMock()
      console.log('post load mock user')
      console.log(user)
     // fetchMoreSubs(true)
      setNumVids(user.customShelfs.map(() => new VidCounter()))
    }
    if (GApiAuth.isHeSignedIn() && !user.isDemo) {
      console.log("Should be doing fetch to server")
    }
    
    console.log('numVids')
    console.log(numVids)
  }
  
  async function doGAuth() {
    if (!GoogleAuth) {
      console.time("pre init")
      //let GoogleAuth = await GApiAuth.initGoogleAPI()  // Usually 500ms   
      GoogleAuth = await GApiAuth.getGoogleAuth()  // Usually 500ms   
      console.log("YOU SHOULD SEE ME BEFORE END")
      console.log("YOU SHOULD SEE ME BEFORE END")
      console.log("YOU SHOULD SEE ME BEFORE END")
      console.log(GApiAuth.isHeSignedIn())
      console.log(GoogleAuth.isSignedIn.get())
      console.timeEnd("pre init")
      //let GoogleAuth = await GApiAuth.getGoogleAuth()
      GoogleAuth.isSignedIn.listen(signinChanged);
      setIsLogged(GApiAuth.isHeSignedIn())
    }
  }
  let signinChanged = function (val) {
    console.log("SETTING TO: ", GApiAuth.isHeSignedIn())
    console.log('Signin state changed to ', val);
    //ServerEndpoints.authenticate()
    setIsLogged(GApiAuth.isHeSignedIn())
  }

  function initUser() {
  console.log('\n\n\n\n\n WE ARE INIT ING USER \n\n\n\n\n\n')
  //if (ytLogic.hasUsedRecently()) { //3 min
      if (false) {
       // console.log("Request recently used. Using local storage")
     //   let shelfsVids = ytLogic.getStorageShelfs()
   //     setFinalShelfs(shelfsVids)
 //       setHasMoreShelfs(true) //We now have shelfs to be rendered
      } 
      else {
   //     ServerEndpoints.requestUserFromDatabase()
        console.log("Doing fetch to Google. Local storage expired.")
        fetchMoreSubs(true) // true ---> first run
      }
      setNumVids(user.customShelfs.map(() => new VidCounter()))
      console.log('numVids')
      console.log(numVids)
  }

  
 async function loadMock() {
    let theUser = ServerEndpoints.getMockUser()
    console.log("LOAD MOCK")
    console.log(theUser)
    await setUser(theUser)
    setUserSettings(theUser);
  }

  function putUnsortedShelfAtBottom() {
    console.log('user')
    console.log(user)
    let newUser = user;
    let sort    = user.customShelfs.filter( sh => sh.isSorted)
    let unSort  = user.customShelfs.filter( sh => !sh.isSorted)  
    sort = sort.concat(unSort)
    newUser.customShelfs = sort
    setUser(newUser)

  }
  
  function isEndReached() {
    let isEnd = false;
    if (spamCount > spamLimit || pageLength > user.customShelfs.length) {
      console.log('\n\n\n\nbro you reached the limit\n\n\n')
      console.log(pageLength)
      console.log(user.customShelfs.length)
      isEnd = true
    }
    return isEnd
  }

  function injectData(isActs, shelfstuff) {
    let injectShelfTitle = user.customShelfs.slice(prevPage, pageLength).map((sh, idx) => {
      return {"videos": shelfstuff[idx], "title":sh.title, "filters": sh.fewSubs.map(sub => sub.filter)}
    })
    return { isActs, shelfs: injectShelfTitle }

  } 
  
  async function hackHelper() {
  let count = 1
  let isReady;
    while (isReady = !GApiAuth.checkAll()) {
      console.log('Hack Helper: Logged out?: ' + isReady + ' - ' + count)
      console.log('user')
      console.log(user)
      await Common.sleep(100*count) 
      count = count + 1      
      if (count > 40) {
        count = count * 2
        console.log("Hack Helper: Something went wrong :(  " + count)
      }
    }
  }


  async function _fetchActivities() {

    // Returns array of Shelfs, each shelf is an array of subscription. Each sub is an array of activities
    // Kinda like: shelf[x].subscription[y].activity[z]
    let shelfsActs = await ytLogic.getActivitiesShelfs(user.customShelfs.slice(prevPage, pageLength))
    


    // Returns only Uploads of the channels activities
    shelfsActs = await ytLogic.removeNonVideos(shelfsActs)
    
    // Returns all the activies in a single array (shelf), instead array of activities in n different sub
    // Kinda like: shelf[x].Activity[z]
    shelfsActs = await shelfsActs.map( shelf => ytLogic.flattenShelf(shelf))
    shelfsActs = await shelfsActs.map( shelf => ytLogic.sortByDate(shelf))

    // Fetch data from youtube api
    const fetchThisManyVideosPerShelf = 20 //Arbitrary number (max 50) (see youtube's Video api)
    shelfsActs = shelfsActs.map(sh => sh.slice(0,fetchThisManyVideosPerShelf))    

    
    {/*as Object
      let actResponses = shelfsActs.map(sh => (sh.map(sub => {
      let actRes = new FS.ActRes()
      actRes.contentDetails = sub.contentDetails;
      actRes.snippet = sub.snippet;
      return actRes
    })))
    return actResponses*/}
    return shelfsActs

  }
  
  async function _fetch2ndHalf(shelfsActs) {
    // Returns an array of video's ID per shelf
    let shelfsVidIds = await shelfsActs.map(sh => ytLogic.extractIds(sh))

    // Returns an array of video objects(yt) per shelf
    let shelfVids = await ytLogic.requestVideosShelf(shelfsVidIds)

    //Returns only "OK" status and then http results
    shelfVids = shelfVids.filter(sh => sh.status > 199 || sh.status < 300).map(sh => sh.result.items)
    shelfVids = shelfVids.map(shelf => ytLogic.sortByDate(shelf))

    {/*let vidResponses = shelfVids.map(sh => (sh.map(sub => {
      let vidRes = new FS.VideoRes()
      vidRes.contentDetails = sub.contentDetails;
      vidRes.snippet        = sub.snippet;
      vidRes.statistics     = sub.statistics
      return vidRes
    })))
    return vidResponses*/}

    return shelfVids
  }

  function _preRenderViaActs(shelfsActs) {
    let iData0 = injectData(true, shelfsActs)
    console.log('iData0 - Activities')
    console.log(iData0)
    
    
    setFinalShelfs(prevShs => {
      let newS = { ...prevShs }
      prevPage != 0 ? newS.shelfs.push(...iData0.shelfs) : newS = iData0
      newS.isActs = true
      return newS
    })
}


  const fetchMoreSubs = async (isFirstRun) => {
    console.log(" xxxxXXXXxxxx fetchMoreSubs xxxxXXXXxxxx")
    console.log('user in fetch')
    console.log(user)
    if (isFirstRun) { await putUnsortedShelfAtBottom() }

    setHasMoreShelfs(false) //instantly halt any possible room for multi fetches
    prevPage = pageLength == initialPageLength ? 0 : pageLength - 1 //PrevPage = 0 for initial load //After that prevPage = pageLength - 1
    

    await hackHelper()
    if ( isEndReached()) { //If all shelfs retrieved, then quit
      return
    }

    let shelfsActs = await _fetchActivities()
    console.log('shelfsActs')
    console.log(shelfsActs)
    //await preRenderViaActs(shelfsActs)
    
    
    let shelfVids = await _fetch2ndHalf(shelfsActs)
    
    let iData = injectData(false, shelfVids)
    
    ytLogic.beginFilter2(iData.shelfs)

    console.log("_____-------WE FINISHED THE FETCH & PROCESSING!-------_______")
    console.log("_____ {prevPage, pageLength} ", prevPage, ', ', pageLength )
    console.log('finalShelfs')
    console.log(finalShelfs)
    //console.log('iData - Videos')

    //TODO clean this slop 
    setFinalShelfs(prevShs => {
      let newS = { ...prevShs }
      newS.isActs = false
      // if (p == 0) --> initial load
      if (prevPage == 0) {
        for (let i = 0; i < pageLength; i++) {
          newS.shelfs[prevPage + i] = iData.shelfs[i]
        }
      } else { // if (p != 0) --> additional requests
        console.log("I Think we doing this")
        newS.shelfs.push(iData.shelfs[0])
      }
      return newS
    })
    
    //ytLogic.saveToLocal(iData)  


    setPageLength( pageLength + 1)
    spamCount = spamCount + 1;
    setHasMoreShelfs(true) //We now have shelfs to be rendered
  }
    
  const LoggedOut = () => {
    return (
      <div>
        <h2> Log in to customize your homepage </h2>
        <h2> Currently using a demo profile </h2>
      </div>
    )
  }

  const LoggedIn = () => {
    return(
      <div>
        <h2> Hi {user.fullName} </h2>
      </div>
      )
  }

  const Shelfs = () => {
    return ( 
        <InfiniteScroll key={nextId('infScroll-')}
          loadMore={fetchMoreSubs}
          hasMore={hasMoreShelfs}
          loader={(<div key={nextId('loader-')}>Loading ...</div>)}
          threshold={10}
            >
          <ShelfsMany key={nextId('manyShelfsid-')} isActs={finalShelfs.isActs} shelfs={finalShelfs.shelfs.slice(0, pageLength)} numVids={numVids} setNumVids={setNumVids} /> 
        </InfiniteScroll>
      )
  }
    
  function doAuth() {
    console.log('GApiAuth.isHeSignedIn()')
    console.log(GApiAuth.isHeSignedIn())
    if (!GApiAuth.isHeSignedIn()) {
      console.log("NOT SIGNED. RETURNING")
      return
    }
    ServerEndpoints.authenticate();

  }

  function doCreate() {
    console.log('GApiAuth.isHeSignedIn()')
    console.log(GApiAuth.isHeSignedIn())
    if (!GApiAuth.isHeSignedIn()) {
      console.log("NOT SIGNED. RETURNING")
      return
    }
    ServerEndpoints.createUser();
  }


  return(
    <div>
      <h1>Youtube</h1>
      <ButtonsAuthDebug />
      <button onClick={loadMock} >Load mock user</button>
      <button onClick={() => {console.log('numVids'); console.log(numVids); } }> c.log numVids </button>
      <button onClick={() => {console.log('finalShelfs'); console.log(finalShelfs); } }> c.log finalShelfs </button>
      <button onClick={() => {console.log('user'); console.log(user); } }> c.log User </button>
      <button onClick={() => {console.log('isLogged'); console.log(isLogged); } }> c.log isLogged </button>
      <div></div>
      <button onClick={() => {console.log('DoAuth'); doAuth(); } }> DoAuth </button>
      <button onClick={() => {console.log('doCreate'); doCreate(); } }> doCreate </button>
      <h3> Youtube api </h3>
      { isLogged ? <div> THIS GUYS IS SIGNED IN </div> : <div> NOT SIGNED IN </div> }
      <div/>
        <button onClick={ytLogic.getAllSubs}> Get All Subs  </button> 
      <div/>
        <button onClick={ytLogic.XXXgetActivitesOfChannels_2}> 2.0: Get All Subs, then get activites of 1 of your subs  </button>
      <div></div>
      
      <ChannelForm />
      { isLogged ? <LoggedIn /> :  <LoggedOut /> }
      <Shelfs />
    </div>
    );
}


