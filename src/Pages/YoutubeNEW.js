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
  }, [])


  //Set up login/logout handlers, get user, then fetch data from youtube
  async function initShit() {
    await doGAuth()

    if (GApiAuth.isHeSignedIn() && user.isDemo) {
      console.log("LOGGED IN Should be doing fetch to server")
      //let res = await doLoginToBackend()
      let res = await ServerEndpoints.loginToBackend();
      if (res.status > 199 && res.status < 300) {
        console.log('Recieved user from server: ', res.status)
        console.log(res.data)
        let u = await ytLogic.processUserFromServer(res)
        setUserDataHelper(u)
      }
    }
    else {
      loadMock()
      setNumVids(user.customShelfs.map(() => new VidCounter()))
    }

    await fetchMoreSubs(isFirst)
  }


  async function setUserDataHelper(u) {

    //TODO could be better
    setUser(prev => {
      prev.customShelfs = u.customShelfs
      prev.googleId = u.googleId
      prev.pictureUrl = u.pictureUrl
      prev.username = u.username
      prev.isDemo = false
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
    setNumVids(u.customShelfs.map(() => new VidCounter()))
      /*setUser(prevUser => {
        newSubs.forEach(newS => { prevUser.addSub(newS) })
        ServerEndpoints.saveUser(prevUser)
        return prevUser
      })

      setUserSettings(prevUser => {
        newSubs.forEach(newS => { prevUser.addSub(newS) })
        return prevUser
      })
      setNumVids(user.customShelfs.map(() => new VidCounter()))*/



  }

  async function doGAuth() {
    if (!GoogleAuth) {
      GoogleAuth = await GApiAuth.getGoogleAuth()  // Usually 500ms   
      GoogleAuth.isSignedIn.listen(signinChanged);
      setIsLogged2(GApiAuth.isHeSignedIn())
      setIsFirst(false)
    }
  }

  let signinChanged = function (val) {
    console.log('Signin state changed to ', val, "\nSETTING TO: ", GApiAuth.isHeSignedIn());
    setIsLogged2(GApiAuth.isHeSignedIn())
    window.location.reload(true);
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
    if (spamCount > spamLimit || pageLength > user.customShelfs.length) {
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
      await Common.sleep(100 * count)
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
    //TODO: follow up logic for let ordered = orderdAndSplice(shelfsActs)

    // Returns all the activies in a single array (shelf), instead array of activities in n different sub
    // Kinda like: shelf[x].Activity[z]
    shelfsActs = await shelfsActs.map(shelf => ytLogic.flattenShelf(shelf))

    shelfsActs = await shelfsActs.map(shelf => ytLogic.sortByDate(shelf))

    // Fetch data from youtube api
    const fetchThisManyVideosPerShelf = 35 //Arbitrary number (max 50) (see youtube's Video api)
    shelfsActs = shelfsActs.map(sh => sh.slice(0, fetchThisManyVideosPerShelf))

    return shelfsActs

  }

  async function _fetchVideos(shelfsActs) {
    // Returns an array of video's ID per shelf
    let shelfsVidIds = await shelfsActs.map(sh => ytLogic.extractIds(sh))

    // Returns an array of video objects(yt) per shelf
    let shelfVids = await ytLogic.requestVideosShelf(shelfsVidIds)

    //Returns only "OK" status and then http results
    shelfVids = shelfVids.filter(sh => sh.status > 199 || sh.status < 300).map(sh => sh.result.items)
    shelfVids = shelfVids.map(shelf => ytLogic.sortByDate(shelf))

    return shelfVids
  }

  
  const preFetchMoreSubs = async () => {

    if (isEndReached()) { //If all shelfs retrieved, then quit
      return
    }
    if (isFirst) {  
      putUnsortedShelfAtBottom() 
    }
    setHasMoreShelfs(false) //instantly halt any possible room for multi fetches
    prevPage = pageLength - 1
    await hackHelper()
  }

  const fetchMoreSubs = async () => {
    /////////////////////////////////
    console.log(" xxxxXXXXxxxx fetchMoreSubs xxxxXXXXxxxx")
    console.log(" isFirst: ", isFirst)
    console.log("user")
    console.log(user)
    /////////////////////////////////
    await preFetchMoreSubs()

    let shelfsActs = await _fetchActivities()    

    let shelfVids = await _fetchVideos(shelfsActs)

    let iData = injectData(false, shelfVids)
    console.log('iData------')
    console.log(iData)
    ytLogic.beginFilter2(iData.shelfs)

    setAndManageData(iData)
    ////////////////////////////////////////////
    console.log("_____-------WE FINISHED THE FETCH & PROCESSING!-------_______")
    console.log("_____ {prevPage, pageLength} ", prevPage, ', ', pageLength)
    console.log('finalShelfs')
    console.log(finalShelfs)
    ////////////////////////////////////////////
  }

  function setAndManageData(iData) {
    //FIXME clean this slop 
    setFinalShelfs(prevShs => {
        let newS = { ...prevShs }
        newS.isActs = false
        if (prevPage == 0) {
          console.log("Initializing finalshelfs from prevPage --> pageLength ", prevPage, " --> ", pageLength)
          for (let i = 0; i < pageLength; i++) {
            newS.shelfs[prevPage + i] = iData.shelfs[i]
          }
        } else { 
          // when we reach the bottom, new data gets pushed onto the shelfs
          console.log("Pushing data to finalshelfs")
          newS.shelfs.push(iData.shelfs[0])
        }
        return newS
      })
      setPageLength(pageLength + 1)
      spamCount = spamCount + 1;
      setHasMoreShelfs(true) 
  }


  //async function doLoginToBackend() {
    
  //  if (!GApiAuth.isHeSignedIn()) {
  //    console.log("NOT SIGNED. RETURNING")
  //    return
  //  }
  //  let res = ServerEndpoints.loginToBackend();
  //  return res
  //}

  async function saveBackend(u) {
    console.log('save backend u')
    console.log(u)
    ServerEndpoints.saveUser(u)
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
      <ButtonsAuthDebug data={{ numVids, finalShelfs, user, isLogged2, pageLength, saveBackend, setPageLength, user }}/>
      <h1>Youtube</h1>
      <h3> Youtube api </h3>
      {/* isLogged2==true ? <div> THIS GUYS IS SIGNED IN </div> : <div> NOT SIGNED IN </div> */}
      
      {isLogged2 === true && !user.isDemo ? <LoggedIn /> : <LoggedOut />}
      
      {finalShelfs.shelfs[0].videos[0].id == null ? <LoadingMain /> : <Shelfs />}
      
    </div>
    );
}

/*
  function _preRenderViaActs(shelfsActs) {
    let iData0 = injectData(true, shelfsActs)
    setFinalShelfs(prevShs => {
      let newS = { ...prevShs }
      prevPage != 0 ? newS.shelfs.push(...iData0.shelfs) : newS = iData0
      newS.isActs = true
      return newS
    })
  }
*/

      {/*<button onClick={loadMock} >Load mock user</button>
      <button onClick={() => {console.log('numVids');     console.log(numVids) }      }>  c.log numVids     </button>
      <button onClick={() => {console.log('finalShelfs'); console.log(finalShelfs) }  }>  c.log finalShelfs </button>
      <button onClick={() => {console.log('user');        console.log(user) }         }>  c.log User        </button>
      <button onClick={() => {console.log('isLogged2');   console.log(isLogged2) }    }>  c.log isLogged2   </button>
      <button onClick={() => {console.log('pageLength');  console.log(pageLength) }   }>  c.log pageLength  </button>
      <div></div>
      <button onClick={() => {console.log('doLoginToBackend'); doLoginToBackend(); } }> doLoginToBackend </button>
      <button onClick={() => {console.log('saveBackend'); saveBackend(user); } }> saveBackend </button>
      <button onClick={() => {console.log('set Page 1'); wtf(); } }> set Page 1 </button>*/}
     

{/*
    // not working as desired :/
    if (user.customShelfs.length > initialPageLength) {
      //setPageLength(res.data.customShelfs.length)
      setPageLength(initialPageLength)
      } else {
      setPageLength(user.customShelfs.length)
        }

  prevPage = pageLength <= initialPageLength ? 0 : pageLength - 1 //PrevPage = 0 for initial load //After that prevPage = pageLength - 1




    //for (let uSh of subsFromBackend.customShelfs) {
    //  for (let sub of uSh.fewSubs) {
    //    for (let rmS of removedSubs) {
    //      if (rmS.channelId == sub.channelId) {
    //        let idz = uSh.fewSubs.indexOf(sub)
    //        console.log(idz)
    //        console.log(sub)
    //        uSh.fewSubs.splice(idz,1)
    //        if (uSh.fewSubs.length === 0) {
    //          let idz2 = subsFromBackend.customShelfs.indexOf(uSh)
    //          subsFromBackend.customShelfs.splice(idz2,1)
    //        }
    //      }
    //    }
    //  }
    //}

*/}