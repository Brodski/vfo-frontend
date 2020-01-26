import React, { useState, useEffect, useContext } from 'react';
import { UserContext, UserSettingsContext, IsLoggedContext, IsInitFinishedContext } from '../Contexts/UserContext.js';

import GreetingsMsg from '../Common/GreetingsMsg.jsx'
import * as ytLogic from '../BusinessLogic/YtLogic.js';
import * as GApiAuth from '../HttpRequests/GApiAuth';
import FinalShelfs from '../Classes/FinalShelfs'
import VideoResponse from '../Classes/VideoResponse'

import VidCounter from '../Classes/VidCounter'

import ShelfsMany from './ShelfsMany.jsx';

import LoadingMain from '../Common/LoadingMain.jsx';

import * as Common from '../BusinessLogic/Common.js';

import InfiniteScroll from 'react-infinite-scroller';
import nextId from "react-id-generator";

// UseState and accessing it before api is recieved https://stackoverflow.com/questions/49101122/cant-access-objects-properties-within-object-in-react
// react infinite scroll https://github.com/CassetteRocks/react-infinite-scroller#readme
// simple react pagation https://codepen.io/grantdotlocal/pen/zReNgE
function YoutubeNEW() {

  const spamLimit = 25;
  let spamCount = 0;
  const PAGE_GROWTH = 4;
  const INITIAL_PAGE_LENGTH = 3

  // fuction setPrevPage(x){
  //   prevPage = x
  // }
  // At start, there are no shelfs, thus we have no more shelfs
  const [isMoreShelfs, setIsMoreShelfs] = useState(false); 
  const { user, setUser } = useContext(UserContext);
  const { userSetings, setUserSettings } = useContext(UserSettingsContext);
  const { isLogged2, setIsLogged2 } = useContext(IsLoggedContext);
  const { isInitFinished2, setIsInitFinished2 } = useContext(IsInitFinishedContext);

  const [pageLength, setPageLength] = useState(INITIAL_PAGE_LENGTH);
  const [prevPage2, setPrevPage2] = useState(0);
  const [finalShelfs, setFinalShelfs] = useState(new FinalShelfs())
  const [numVids, setNumVids] = useState([new VidCounter()]) // {vids: 0, shelfId: '' 
  const [isFirst, setIsFirst] = useState(true)
  
  // This is the finalShelf:
  // finalShelfs  = [ shelf, shelf, shelf ]
  // shelf        = [ vid, vid, vid, vid ]
  // vid          = { id, snippet: {}, contentDetails: {} }

   
  
  function isEndReached() {
    let isEnd = false;
    if (isFirst){
      return false
    }
    if ( spamCount > spamLimit 
        || pageLength > user.customShelfs.length 
        || prevPage2 >= user.customShelfs.length) {
      console.log('\n\n\n\nbro you reached the limit\n\n\n')
      console.log('prevPage2: ', prevPage2)
      console.log('pageLength : ', pageLength)
      console.log('user.customShelfs.length: ', user.customShelfs.length)
      
      isEnd = true
    }
    return isEnd
  }
  
  function putUnsortedShelfAtBottom() {
    let newUser = user;
    let sort = user.customShelfs.filter(sh => sh.isSorted)
    let unSort = user.customShelfs.filter(sh => !sh.isSorted)
    sort = sort.concat(unSort)
    newUser.customShelfs = sort
    setUser(newUser)
  }
   
 async function hackHelper() {
  let count = 1
  let isReady  = !GApiAuth.checkAll();
  while ( isReady ) {
    console.log('Hack Helper: Logged out?: ' + isReady + ' - ' + count)
    await Common.sleep(100 * count)
    count = count + 1
    if (count > 40) {
      count = count * 2
      console.log("Hack Helper: Something went wrong :(  " + count)
    }
    isReady = !GApiAuth.checkAll()
  }
}
  const preFetchMoreSubs = async () => {

    if (isFirst) {  
      putUnsortedShelfAtBottom() 
    }
    // instantly halt any possible room for multi fetches
    setIsMoreShelfs(false) 
    await hackHelper()
  }

  
  
  async function _fetchActivities() {

    let shelfsActs = await ytLogic.getActivitiesShelfs(user.customShelfs.slice(prevPage2, calcShelfSlice() ))
    
    // if ( user.customShelfs.length <= pageLength ) {
    //   console.log("FETCH ACTIVITES TRUE: " )
    //   console.log(user.customShelfs.length)
    //   console.log(pageLength)
    //   shelfsActs = await ytLogic.getActivitiesShelfs(user.customShelfs.slice(prevPage2, user.customShelfs.length  + 1))
    // } else {
    //   console.log("FETCH ACTIVITES FALSE: " )
    //   console.log(user.customShelfs.length)
    //   console.log(pageLength)
    //   shelfsActs = await ytLogic.getActivitiesShelfs(user.customShelfs.slice(prevPage2, pageLength))
    // }

    shelfsActs = ytLogic.removeNonVideos(shelfsActs)
    // TODO: follow up logic for orderdAndSplice(shelfsActs)

    // Returns - shelf[x].Activity[z]
    shelfsActs = shelfsActs.map(shelf => ytLogic.flattenShelf(shelf))
    shelfsActs = shelfsActs.map(shelf => ytLogic.sortByDate(shelf))

    return shelfsActs

  }
  
  function isNothingLoadedYet(){
    return (finalShelfs.shelfs[0].videos[0].id == null)
  }
  
  function setFinalShelfAux(iData) {
    // TODO clean this slop 
    // setFinalShelfs(prevShs => {
    //     let newS = { ...prevShs }
    //     if (prevPage === 0) {
    //       for (let i = 0; i < pageLength; i = i + 1) {
    //         newS.shelfs[prevPage + i] = iData.shelfs[i]
    //       }
    //     } else { 
    //       // when we reach the bottom of page, new data gets pushed onto the shelfs
    //       console.log("Pushing data to finalshelfs")
    //       newS.shelfs.push(iData.shelfs[0])
    //     }
    //     return newS
    //   })
      setFinalShelfs(prevShs => {
        let newS = { ...prevShs }
        if (isNothingLoadedYet()) {
          // newS.shelfs[0] = iData.shelfs[0]
          newS.shelfs[0] = iData.shelfs.shift()
        }
        iData.shelfs.forEach(sh => {
          newS.shelfs.push(sh)
        });
        return newS;
      })
      //prevPage = pageLength
      setPrevPage2(pageLength)

      if (pageLength + PAGE_GROWTH > user.customShelfs.length) {
        setPageLength(user.customShelfs.length)
      } else {
        setPageLength(pageLength + PAGE_GROWTH)
      }
      spamCount = spamCount + PAGE_GROWTH;
      setIsMoreShelfs(true) 
  }

  function calcShelfSlice(){
    let sliceVal;
    if ( user.customShelfs.length <= pageLength ) {
      sliceVal = user.customShelfs.length
    } else {
      sliceVal = pageLength
    }
    console.log("SLICE VALUCE: ", sliceVal)
    return sliceVal

  }

  function injectData( shelfstuff) {
    console.log('prevPage2, pageLength')
    console.log('prevPage2, pageLength')
    console.log('prevPage2, pageLength')
    console.log('prevPage2, pageLength')
    console.log(prevPage2, pageLength)
    
    let injectShelfTitle = user.customShelfs.slice(prevPage2, calcShelfSlice() ).map((sh, idx) => {
      return { "videos": shelfstuff[idx], "title": sh.title, "filters": sh.fewSubs.map(sub => sub.filter) }
    })
    if (!injectShelfTitle[0].videos[0]) {
      injectShelfTitle[0].videos[0] = new VideoResponse()
      injectShelfTitle[0].videos[0].id = ''
    }
    return { shelfs: injectShelfTitle }
  }
   
  // eslint-disable-next-line no-underscore-dangle
  async function _fetchVideos(shelfsActs) {

    // Arbitrary number (max 50) (see youtube's Video api)
    const fetchThisManyVideosPerShelf = 35 
    shelfsActs = shelfsActs.map(sh => sh.slice(0, fetchThisManyVideosPerShelf))

    let shelfsVidIds = await shelfsActs.map(sh => ytLogic.extractIds(sh))
    let shelfVids = await ytLogic.fetchVideos(shelfsVidIds)

    shelfVids = shelfVids.filter(sh => sh.status > 199 || sh.status < 300).map(sh => sh.result.items)
    shelfVids = shelfVids.map(shelf => ytLogic.sortByDate(shelf))

    return shelfVids
  }

  const fetchMoreSubs = async () => {

    console.log("xxxxXXXXxxxx fetchMoreSubs xxxxXXXXxxxx")
    
    console.log(user)

    if (isEndReached()) { 
      return
    }
    await preFetchMoreSubs()
    console.log("__TOP___ {prevPage, pageLength} ", prevPage2, ', ', pageLength)
    let shelfsActs = await _fetchActivities()    

    let shelfVids = await _fetchVideos(shelfsActs)

    let iData = injectData(shelfVids)
    console.log('iData')
    console.log('iData')
    console.log('iData')
    console.log('iData')
    console.log(iData)

    ytLogic.beginFilter2(iData.shelfs)
    
    setFinalShelfAux(iData)
    
    console.log("_____-------WE FINISHED THE FETCH & PROCESSING!-------_______")
    console.log("__BOT___ {prevPage, pageLength} ", prevPage2, ', ', pageLength)
    console.log('finalShelfs')
    console.log(finalShelfs)
  }


  // Set up login/logout handlers, get user, then fetch data from youtube
  // TODO could abstract initPage() and initPage2() (in settings) probably
  async function initPage() {

    await GApiAuth.getGoogleAuth() 
    if (GApiAuth.isHeSignedIn() && user.isDemo) {
      await Common.loginAndSet(setUser, setUserSettings)
    }
    setIsFirst(false)
    setNumVids(user.customShelfs.map(() => new VidCounter()))
    await fetchMoreSubs()
  }
  
  useEffect(() => {
    console.log('---------------useEffect top ----------------------')
    initPage()
    console.log('---------------useEffect bot----------------------')
  }, [])


  const Shelfs = () => {
    return (
      <InfiniteScroll
        key={nextId('infScroll-')}
        loadMore={() => fetchMoreSubs()}
        hasMore={isMoreShelfs}
        loader={(<div key={nextId('loader-')}> </div>)}
        threshold={10}
      >
        <ShelfsMany 
          key={nextId('manyShelfsid-')} 
          shelfs={finalShelfs.shelfs.slice(0, pageLength)} 
          numVids={numVids} 
          setNumVids={setNumVids} 
          hasMore={isMoreShelfs}
        /> 
      </InfiniteScroll>
      )
  }

  return(
    <div className="yt-body-wrapper">
      { isInitFinished2 ? <GreetingsMsg /> : null}
      
      { isNothingLoadedYet() ? <LoadingMain /> : <Shelfs />}
      
      {/* JUNK BELOW */}
      {/* <ButtonsAuthDebug data={{ numVids, finalShelfs, user, isLogged2, pageLength, setPageLength, user }}/> */}
      
    </div>
    );
}
export default YoutubeNEW;