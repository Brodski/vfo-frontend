import React, { useState, useEffect, useContext, createContext } from 'react';


import { SECRET_KEYS } from '../api-key';
import { UserContext, UserSettingsContext, IsLoggedContext } from '../Contexts/UserContext.js';
import * as Common                    from '../BusinessLogic/Common.js';
import * as ytLogic                     from '../BusinessLogic/ytLogic.js'
import * as youtubeApi                  from "../HttpRequests/youtubeApi";
import * as ServerEndpoints             from '../HttpRequests/ServerEndpoints.js'
import  * as GApiAuth                   from '../HttpRequests/GApiAuth';
import { FinalShelfs }                 from '../Classes/FinalShelfs'
import { CustomShelf, VidCounter, User }                       from '../Classes/User'

import { Subscription }                 from '../Classes/Subscription'
import { ShelfsMany }                   from '../Components/ShelfsMany';
import { ChannelForm }                  from '../Components/ChannelForm';
import { ButtonsAuthDebug }             from '../Components/ButtonsAuthDebug';


import axios from 'axios';
import InfiniteScroll                 from 'react-infinite-scroller';
import nextId  from "react-id-generator";
import ReactLoading from 'react-loading';

import * as moment from 'moment';

//UseState and accessing it before api is recieved https://stackoverflow.com/questions/49101122/cant-access-objects-properties-within-object-in-react
// react infinite scroll https://github.com/CassetteRocks/react-infinite-scroller#readme
// simpe react pagation https://codepen.io/grantdotlocal/pen/zReNgE
export function YoutubeNEW() {

  const initialPageLength = 3;
  let prevPage;
  let spamLimit = 25;
  let spamCount = 0;
  const { user, setUser } = useContext(UserContext);
  const { userSetings, setUserSettings } = useContext(UserSettingsContext);
  const { isLogged2, setIsLogged2 } = useContext(IsLoggedContext);

  //const [pageLength, setPageLength] = useState(1);
  const [pageLength, setPageLength] = useState(1);
  const [hasMoreShelfs, setHasMoreShelfs] = useState(false); //At start, there are no shelfs, thus we have no more shelfs

  const [finalShelfs, setFinalShelfs] = useState(new FinalShelfs())
  const [numVids, setNumVids] = useState([new VidCounter()]) // {vids: 0, shelfId: '' 

  const [chillBro, setChillBro] = useState(0)
  //const [isLogged, setIsLogged] = useState('lol')
  const [isFirst, setIsFirst] = useState(true)
  let GoogleAuth;



  // This is the finalShelf:
  //
  // PageOfShelfs = finalShelfs = [ shelf, shelf, shelf ]
  // shelf        = [ vid, vid, vid, vid ]
  // vid          = { id, snippet: {}, contentDetails: {} }

  useEffect(() => {
    console.log('---------------useEffect top ----------------------')
    initShit()
    console.log('---------------useEffect bot----------------------')
  }, [isLogged2])


  async function initShit() {
    await doGAuth()
    await wtf()
    console.log('A pageLength')
    console.log(pageLength)
    setChillBro(prev => { return prev + 1 })
    if (chillBro > 10) {
      console.log("\n\n bro, ...chill. ")
      return
    }

    if (isLogged2 == 'firstrun') { return }


    if (GApiAuth.isHeSignedIn() && user.isDemo) {
      console.log("initshit(): LOGGED IN Should be doing fetch to server")
      let res = await doLoginToBackend()
      if (res.status > 199 && res.status < 300) {
        console.log('Recieved user from server: ')
        console.log(res.data)
        console.log('B pageLength')
        console.log(pageLength)
        await processUserFromServer(res)
        console.log('C pageLength')
        console.log(pageLength)
      }
    }
    else {
      console.log("HOT DAYM!")
      console.log("HOT DAYM!")
      console.log("HOT DAYM!")
      console.log("HOT DAYM!")
      console.log("HOT DAYM!")
      console.log("HOT DAYM!")
      console.log("HOT DAYM!")
      console.log("HOT DAYM!")
      console.log('D pageLength')
      console.log(pageLength)
      loadMock()
      let u2 = ServerEndpoints.getMockUser()
      //fetchMoreSubs(true)
      //setNumVids( u2.customShelfs.map(() => new VidCounter()))
    }



    // after the fetch
    console.log(' user.customShelfs.map(() => new VidCounter()) ')
    console.log(user.customShelfs.map(() => new VidCounter()))
    setNumVids(user.customShelfs.map(() => new VidCounter()))
    //prevPage = null
    console.log('E pageLength')
    console.log(pageLength)
    await fetchMoreSubs(isFirst)
    console.log('F pageLength')
    console.log(pageLength)

    // not working as desired :/
    /* if (user.customShelfs.length > initialPageLength) {
        //setPageLength(res.data.customShelfs.length)
        setPageLength(initialPageLength)
        } else {
        setPageLength(user.customShelfs.length)
         }
    */

  }


  async function processUserFromServer(res) {

    let u = new User()
    let subzPromise = ytLogic.getAllSubs()


    // TODO create variable/method/header
    if (res.data.customShelfs == null) { // new user
      //subzPromise = await subzPromise;
      u.initNewUser(await subzPromise, res.data)
      ServerEndpoints.saveUser(u)
    }
    else {
      u.customShelfs = res.data.customShelfs
      u.googleId = res.data.googleId
      u.pictureUrl = res.data.pictureUrl
      u.username = res.data.username
      u.isDemo = false
      console.time('check new subs')
      let newSubs = checkForNewSubs(subzPromise, res.data)
      console.timeEnd('check new subs')
    }

    setUser(prev => {
      prev.customShelfs = u.customShelfs
      prev.googleId = u.googleId
      prev.pictureUrl = u.pictureUrl
      prev.username = u.username
      prev.isDemo = false
      console.log("THIS SHOULD BE NEW USER!!!")
      console.log("THIS SHOULD BE NEW USER!!!")
      console.log("THIS SHOULD BE NEW USER!!!")
      console.log(prev)
      return prev
    })
    setUserSettings(prev => {
      prev.customShelfs = u.customShelfs
      prev.googleId = u.googleId
      prev.pictureUrl = u.pictureUrl
      prev.username = u.username
      prev.isDemo = false
      return prev
    })


  }

  async function checkForNewSubs(subsFromYt, subsFromBackend) { //SubsfromYt is promise
    subsFromYt = await subsFromYt

    let newSubs = []

    for (let bs of subsFromYt) {
      let doesMatches = false;
      for (let uSh of subsFromBackend.customShelfs) {
        for (let sub of uSh.fewSubs) {
          if (bs.snippet.resourceId.channelId == sub.channelId) {
            doesMatches = true;
            break
          }
        }
      }
      if (doesMatches == false) {
        newSubs.push(bs)
      }
    }
    console.log('newSubs')
    console.log(newSubs)

    if (newSubs.length > 0) {
      setUser(prev => {
        newSubs.forEach(newS => { prev.addSub(newS) })
        ServerEndpoints.saveUser(prev)
        return prev
      })

      setUserSettings(prev => {
        newSubs.forEach(newS => { prev.addSub(newS) })
        return prev
      })
    }

    return newSubs
  }


  async function doGAuth() {
    if (!GoogleAuth) {
      console.time("pre init")
      GoogleAuth = await GApiAuth.getGoogleAuth()  // Usually 500ms   
      console.timeEnd("pre init")
      GoogleAuth.isSignedIn.listen(signinChanged);
      setIsLogged2(GApiAuth.isHeSignedIn())
      setIsFirst(false)
    }
  }

  let signinChanged = function (val) {
    console.log('Signin state changed to ', val, "\nSETTING TO: ", GApiAuth.isHeSignedIn());
    //ServerEndpoints.authenticate()
    /*setPageLength(prev => {
      let newP = prev
      newP = 1
      return newShit
    })*/
    setIsLogged2(GApiAuth.isHeSignedIn())
    window.location.reload();
  }

  function wtf() {
    setPageLength(1)
  }

  async function loadMock() {
    let theUser = ServerEndpoints.getMockUser()
    console.log("LOADING MOCK")
    console.log(theUser)
    setUser(theUser)
    setUserSettings(theUser);
  }

  function putUnsortedShelfAtBottom() {
    let newUser = user;
    let sort = user.customShelfs.filter(sh => sh.isSorted)
    let unSort = user.customShelfs.filter(sh => !sh.isSorted)
    sort = sort.concat(unSort)
    newUser.customShelfs = sort
    setUser(newUser)

  }

  function isEndReached() {
    let isEnd = false;
/*    console.log( 'spamCount, ect'  )
    console.log( 'spamCount  : ' , spamCount)
    console.log( 'spamLimit : ', spamLimit  )
    console.log( 'pageLength: ', pageLength  )
    console.log( 'user.customShelfs.length : ', user.customShelfs.length  )
    console.log( 'spamCount > spamLimit : ', spamCount > spamLimit  )
    console.log( 'pageLength > user.customShelfs.length : ', pageLength > user.customShelfs.length  )
   */ if (spamCount > spamLimit || pageLength > user.customShelfs.length) {
      console.log('\n\n\n\nbro you reached the limit\n\n\n')
      console.log('pageLength : ', pageLength)
      console.log('user.customShelfs.length: ', user.customShelfs.length)
      isEnd = true
    }
    return isEnd
  }

  function injectData(isActs, shelfstuff) {
    let injectShelfTitle = user.customShelfs.slice(prevPage, pageLength).map((sh, idx) => {
      return { "videos": shelfstuff[idx], "title": sh.title, "filters": sh.fewSubs.map(sub => sub.filter) }
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
      await Common.sleep(100 * count)
      count = count + 1
      if (count > 40) {
        count = count * 2
        console.log("Hack Helper: Something went wrong :(  " + count)
      }
    }
  }


  function orderdAndSplice(shelfsActs) {

    /*let orderedActs = await shelfsActs.map(sh => {
      return sh.map(sub => {
        return ytLogic.sortByDate(sub)
      })
    })
     A very nice print
    for (let sh of orderedActs) {
      for (let s of sh) {
        for (let v of s) {
        console.log(v.snippet.channelTitle, ' ', v.snippet.publishedAt, ' ', v.snippet.title)
        }
      }
    }
    console.log('\n\n\n\n\n\n\n\n\n ORDERED ACTS \n\n\n\n\n\n\n\n\n\n')
    console.log(orderedActs)*/
  }

  async function _fetchActivities() {

    // Returns array of Shelfs, each shelf is an array of subscription. Each sub is an array of activities
    // Kinda like: shelf[x].subscription[y].activity[z]
    let shelfsActs = await ytLogic.getActivitiesShelfs(user.customShelfs.slice(prevPage, pageLength))
    //  console.log("_FETCH ACTS: shelfActs")
    //    console.log(shelfsActs)


    // Returns only Uploads of the channels activities
    shelfsActs = await ytLogic.removeNonVideos(shelfsActs)  //let ordered = orderdAndSplice(shelfsActs)

    // Returns all the activies in a single array (shelf), instead array of activities in n different sub
    // Kinda like: shelf[x].Activity[z]
    shelfsActs = await shelfsActs.map(shelf => ytLogic.flattenShelf(shelf))

    shelfsActs = await shelfsActs.map(shelf => ytLogic.sortByDate(shelf))

    // Fetch data from youtube api
    const fetchThisManyVideosPerShelf = 35 //Arbitrary number (max 50) (see youtube's Video api)
    shelfsActs = shelfsActs.map(sh => sh.slice(0, fetchThisManyVideosPerShelf))

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


  function nicePrint(shelfsActs) {
    let ilol = 0
    for (let sh of shelfsActs) {
      console.log('FETCH: ACTS SHELF ', ilol)
      for (let s of sh) {
        console.log(s.snippet.channelTitle + ' - ' + s.snippet.title)
      }
      ilol++
    }

  }

  const fetchMoreSubs = async (isFirstRun = false) => {
    //setDoingFetch(true)
    console.log(" xxxxXXXXxxxx fetchMoreSubs xxxxXXXXxxxx")
    console.log(" isFirstRun: ", isFirstRun)
    console.log("hasMoreShelfs ", hasMoreShelfs)
    console.log("___BEFORE prevPage, pageLength} ", prevPage, ', ', pageLength)
    console.log("user")
    console.log(user)
    if (isFirstRun) { await putUnsortedShelfAtBottom() }

    setHasMoreShelfs(false) //instantly halt any possible room for multi fetches
    //prevPage = pageLength <= initialPageLength ? 0 : pageLength - 1 //PrevPage = 0 for initial load //After that prevPage = pageLength - 1
    prevPage = pageLength - 1
    console.log("___AFTER prevPage, pageLength} ", prevPage, ', ', pageLength)

    await hackHelper()
    if (isEndReached()) { //If all shelfs retrieved, then quit
      return
    }

    let shelfsActs = await _fetchActivities()    //await preRenderViaActs(shelfsActs)


    let shelfVids = await _fetch2ndHalf(shelfsActs)

    let iData = injectData(false, shelfVids)
    console.log('iData------')
    console.log(iData)
    ytLogic.beginFilter2(iData.shelfs)

    console.log("_____-------WE FINISHED THE FETCH & PROCESSING!-------_______")
    console.log("_____ {prevPage, pageLength} ", prevPage, ', ', pageLength)
    console.log('finalShelfs')
    console.log(finalShelfs)
    //console.log('iData - Videos')

    //TODO clean this slop 
    setFinalShelfs(prevShs => {
      let newS = { ...prevShs }
      newS.isActs = false
      // if (p == 0) --> initial load
      if (prevPage == 0) {
        console.log("Initializing finalshelfs from prevPage --> pageLength ", prevPage, " --> ", pageLength)
        for (let i = 0; i < pageLength; i++) {
          newS.shelfs[prevPage + i] = iData.shelfs[i]
        }
      } else { // if (p != 0) --> additional requests
        console.log("Pushing data to finalshelfs")
        newS.shelfs.push(iData.shelfs[0])
      }
      return newS
    })

    setPageLength(pageLength + 1)
    spamCount = spamCount + 1;
    setHasMoreShelfs(true) //We now have shelfs to be rendered
    //setDoingFetch(false)
  }

  async function doLoginToBackend() {
    if (!GApiAuth.isHeSignedIn()) {
      console.log("NOT SIGNED. RETURNING")
      return
    }
    let res = ServerEndpoints.loginToBackend();
    

    return res
  }

  async function saveBackend(u) {
    console.log('save backend u')
    console.log(u)
    ServerEndpoints.saveUser(u)
  }

  async function debugUser(u) {
    console.log(u)
    ServerEndpoints.debugUser(u)
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
        <h2> Hi {user.username} </h2>
      </div>
      )
  }

  const Shelfs = () => {
    return (
      <InfiniteScroll key={nextId('infScroll-')}
        loadMore={() => fetchMoreSubs(isFirst) }
        hasMore={hasMoreShelfs}
        loader={(<div key={nextId('loader-')}>Loading ...</div>)}
        threshold={200}
            >
          <ShelfsMany key={nextId('manyShelfsid-')} isActs={finalShelfs.isActs} shelfs={finalShelfs.shelfs.slice(0, pageLength)} numVids={numVids} setNumVids={setNumVids} /> 
        </InfiniteScroll>
      )
  }

  const LoadingMain = props => {
    return (
      <div className="loading-main-animation">
        <ReactLoading type={'spinningBubbles'} />
      </div>
    )
  }
   
  return(
    <div>
      <h1>Youtube</h1>
      
      <ButtonsAuthDebug />
      <button onClick={loadMock} >Load mock user</button>
      <button onClick={() => {console.log('numVids'); console.log(numVids); } }> c.log numVids </button>
      <button onClick={() => {console.log('finalShelfs'); console.log(finalShelfs); } }> c.log finalShelfs </button>
      <button onClick={() => {console.log('user'); console.log(user); } }> c.log User </button>
      <button onClick={() => {console.log('isLogged2'); console.log(isLogged2); } }> c.log isLogged2 </button>
      <button onClick={() => {console.log('pageLength'); console.log(pageLength); } }> c.log pageLength </button>
      <div></div>
      <button onClick={() => {console.log('doLoginToBackend'); doLoginToBackend(); } }> doLoginToBackend </button>
      <button onClick={() => {console.log('saveBackend'); saveBackend(user); } }> saveBackend </button>
      <button onClick={() => {console.log('set Page 1'); wtf(); } }> set Page 1 </button>

      <button onClick={() => {console.log('debugUser'); debugUser(user); } }> debugUser </button>
      <h3> Youtube api </h3>
      { isLogged2 ? <div> THIS GUYS IS SIGNED IN </div> : <div> NOT SIGNED IN </div> }
      <div/>
        <button onClick={ytLogic.getAllSubs}> Get All Subs  </button> 
      <div/>
        <button onClick={ytLogic.XXXgetActivitesOfChannels_2}> 2.0: Get All Subs, then get activites of 1 of your subs  </button>
      <div></div>
      
      <ChannelForm />
      {isLogged2 == true ? <LoggedIn /> : <LoggedOut />}
      
      {finalShelfs.shelfs[0].videos[0].id == null ? <LoadingMain /> : <Shelfs />}
      

     
      
    </div>
    );
}


