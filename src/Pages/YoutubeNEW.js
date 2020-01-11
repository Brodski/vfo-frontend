import React, { useState, useEffect, useContext, createContext } from 'react';
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
import { LoadingMain }                  from '../Components/LoadingMain';

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
  let GoogleAuth;
  const { user, setUser } = useContext(UserContext);
  const { userSetings, setUserSettings } = useContext(UserSettingsContext);
  const { isLogged2, setIsLogged2 } = useContext(IsLoggedContext);

  const [pageLength, setPageLength] = useState(1);
  const [hasMoreShelfs, setHasMoreShelfs] = useState(false); //At start, there are no shelfs, thus we have no more shelfs

  const [finalShelfs, setFinalShelfs] = useState(new FinalShelfs())
  const [numVids, setNumVids] = useState([new VidCounter()]) // {vids: 0, shelfId: '' 
  const [chillBro, setChillBro] = useState(0)
  const [isFirst, setIsFirst] = useState(true)
  

  // This is the finalShelf:
  // finalShelfs  = [ shelf, shelf, shelf ]
  // shelf        = [ vid, vid, vid, vid ]
  // vid          = { id, snippet: {}, contentDetails: {} }

  useEffect(() => {
    console.log('---------------useEffect top ----------------------')
    initPage()
    console.log('---------------useEffect bot----------------------')
  }, [])


  //Set up login/logout handlers, get user, then fetch data from youtube
  //TODO could abstract initPage() and initPage2() (in settings) probably
  async function initPage() {
    await GApiAuth.getGoogleAuth() 
    
    if (GApiAuth.isHeSignedIn() && user.isDemo) {
      await ytLogic.loginAndSet(setUser, setUserSettings)
    }

    setIsFirst(false)
    setNumVids(user.customShelfs.map(() => new VidCounter()))
    await fetchMoreSubs()
  }
      
  const preFetchMoreSubs = async () => {

    if (isFirst) {  
      putUnsortedShelfAtBottom() 
    }
    // instantly halt any possible room for multi fetches
    setHasMoreShelfs(false) 
    prevPage = pageLength - 1
    await hackHelper()
  }

  const fetchMoreSubs = async () => {
    console.log(" xxxxXXXXxxxx fetchMoreSubs xxxxXXXXxxxx")
    console.log(user)

    if (isEndReached()) { 
      return
    }
    await preFetchMoreSubs()

    let shelfsActs = await _fetchActivities()    

    let shelfVids = await _fetchVideos(shelfsActs)

    let iData = injectData(shelfVids)

    ytLogic.beginFilter2(iData.shelfs)

    setFinalShelfAux(iData)
    
    console.log("_____-------WE FINISHED THE FETCH & PROCESSING!-------_______")
    console.log("_____ {prevPage, pageLength} ", prevPage, ', ', pageLength)
    console.log('finalShelfs')
    console.log(finalShelfs)
  }

  function setFinalShelfAux(iData) {
    //FIXME clean this slop 
    setFinalShelfs(prevShs => {
        let newS = { ...prevShs }
        newS.isActs = false
        if (prevPage == 0) {
          for (let i = 0; i < pageLength; i++) {
            newS.shelfs[prevPage + i] = iData.shelfs[i]
          }
        } else { 
          // when we reach the bottom of page, new data gets pushed onto the shelfs
          console.log("Pushing data to finalshelfs")
          newS.shelfs.push(iData.shelfs[0])
        }
        return newS
      })
      setPageLength(pageLength + 1)
      spamCount = spamCount + 1;
      setHasMoreShelfs(true) 
  }

  async function _fetchActivities() {
    let shelfsActs = await ytLogic.getActivitiesShelfs(user.customShelfs.slice(prevPage, pageLength))

    shelfsActs = await ytLogic.removeNonVideos(shelfsActs)   
    // TODO: follow up logic for orderdAndSplice(shelfsActs)

    // Returns - shelf[x].Activity[z]
    shelfsActs = await shelfsActs.map(shelf => ytLogic.flattenShelf(shelf))
    shelfsActs = await shelfsActs.map(shelf => ytLogic.sortByDate(shelf))
    
    // Arbitrary number (max 50) (see youtube's Video api)
    const fetchThisManyVideosPerShelf = 35 
    shelfsActs = shelfsActs.map(sh => sh.slice(0, fetchThisManyVideosPerShelf))

    return shelfsActs

  }

  async function _fetchVideos(shelfsActs) {

    let shelfsVidIds = await shelfsActs.map(sh => ytLogic.extractIds(sh))
    let shelfVids = await ytLogic.fetchVideos(shelfsVidIds)

    shelfVids = shelfVids.filter(sh => sh.status > 199 || sh.status < 300).map(sh => sh.result.items)
    shelfVids = shelfVids.map(shelf => ytLogic.sortByDate(shelf))

    return shelfVids
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

  function injectData( shelfstuff) {
    let injectShelfTitle = user.customShelfs.slice(prevPage, pageLength).map((sh, idx) => {
      return { "videos": shelfstuff[idx], "title": sh.title, "filters": sh.fewSubs.map(sub => sub.filter) }
    })
    return { shelfs: injectShelfTitle }
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
        loadMore={() => fetchMoreSubs() }
        hasMore={hasMoreShelfs}
        loader={(<div key={nextId('loader-')}>Loading ...</div>)}
        threshold={200}
       >
          <ShelfsMany 
            key={nextId('manyShelfsid-')} 
            shelfs={finalShelfs.shelfs.slice(0, pageLength)} 
            numVids={numVids} 
            setNumVids={setNumVids} 
          /> 
       </InfiniteScroll>
      )
  }

  return(
    <div>
      <ButtonsAuthDebug data={{ numVids, finalShelfs, user, isLogged2, pageLength, setPageLength, user }}/>
      <h1>Youtube</h1>
      
      {isLogged2 === true && !user.isDemo ? <LoggedIn /> : <LoggedOut />}
      
      {finalShelfs.shelfs[0].videos[0].id == null ? <LoadingMain /> : <Shelfs />}
      
    </div>
    );
}