/*
* The Youtube page starts by using the user's profile data (his subscriptions) then fetches data from youtube
* If the user is not logged in then we use a demo profile. 
*/
import React, { useContext, useEffect, useState } from 'react';

import InfiniteScroll from 'react-infinite-scroller';
import nextId from "react-id-generator";

import * as Common from '../BusinessLogic/Common';
import * as youtubeApi from '../HttpRequests/YoutubeApi';
import * as ytLogic from '../BusinessLogic/YtLogic';
import {
  IsInitFinishedContext,
  NumVidsContext,
  UserContext,
  UserSettingsContext
} from '../Contexts/UserContext.js';
import FinalShelfs from '../Classes/FinalShelfs'
import GreetingsMsg from '../Components/GreetingsMsg.jsx'
import LoadingMain from '../Components/LoadingMain.jsx';
import ShelfsMany from './ShelfsMany.jsx';
import VidCounter from '../Classes/VidCounter'
import VideoResponse from '../Classes/VideoResponse'


function Youtube() {

  // const pageGrowth = 4;
  const pageGrowth = 2;
  const initialPageLength = 1;
  // const initialPageLength = 3;

  // Arbitrary number (max 50) (see youtube's Video api)
  const fetchThisManyVideosPerShelf = 50;
  let isSubscribed = true

  const { user, setUser } = useContext(UserContext);
  const { userSetings, setUserSettings } = useContext(UserSettingsContext);
  const { isInitFinished2, setIsInitFinished2 } = useContext(IsInitFinishedContext);

  const [finalShelfs, setFinalShelfs] = useState(new FinalShelfs())
  const [pageLength, setPageLength] = useState(initialPageLength);
  let pLength = 1
  const [prevPage, setPrevPage] = useState(0);
  const [numVids, setNumVids] = useState([new VidCounter()]) 
  const [isFirst, setIsFirst] = useState(true)
  let isFirstRun = true
  const [isMoreShelfs, setIsMoreShelfs] = useState(false);
  let isRemainingShelfs = false
  
  const isNothingLoadedYet = () => finalShelfs.shelfs[0].videos[0].id == null


  async function initPage() {
    
    // await Common.betterLogin(setUser, setUserSettings, user.isDemo)
    await Common.betterLogin(setUser, setUserSettings)
    setIsFirst(false) 
    isFirstRun = false
    setNumVids(user.customShelfs.map(() => new VidCounter()))
    await fetchMoreSubs()
  }

  // https://juliangaramendy.dev/use-promise-subscription/ solution to 'mem-leak'
  useEffect(() => {
    console.log("USER BEFORE")
    console.log(user)
    initPage()
    return () => {
      isSubscribed = false
    }
  }, [])


  function logDebug(){
      console.log("USER")
      console.log(user)
  }
  function isEndReached() {
    //if isFirstRun
    if (isFirst) {
      return false
    }
    if ( pageLength > user.customShelfs.length || prevPage >= user.customShelfs.length) {
      return true
    }
    return false
  }

  function putUnsortedShelfAtBottom() {
    const newUser = user;
    let sort = user.customShelfs.filter(sh => sh.isSorted)
    let unSort = user.customShelfs.filter(sh => !sh.isSorted)
    sort = sort.concat(unSort)
    newUser.customShelfs = sort
    setUser(newUser)
  }

  function calcShelfSlice() {
    let sliceVal;
    if (user.customShelfs.length <= pageLength) {
      sliceVal = user.customShelfs.length
    } else {
      sliceVal = pageLength
    }
    return sliceVal
  }

  function setFinalShelfAux(iData) {
    console.log('setting data')
    if (!isSubscribed) { return }

    setFinalShelfs(prevShs => {
      const newS = { ...prevShs }
      if (isNothingLoadedYet()) {
        newS.shelfs[0] = iData.shelfs.shift()
      }
      iData.shelfs.forEach(sh => {
        newS.shelfs.push(sh)
      });
      console.log('done setting data')
      console.log(newS)
      console.log("good bye")
      return newS;
    })

    setPrevPage(pageLength)
    
    if (pageLength + pageGrowth > user.customShelfs.length) {
      setPageLength(user.customShelfs.length)
      pLength = user.customShelfs.length
    } else {
      setPageLength(pageLength + pageGrowth)
    }
    
    setIsMoreShelfs(true)
    isRemainingShelfs = true
    
  }

  function injectData(shelfstuff) {

    const injectShelfTitle = user.customShelfs.slice(prevPage, calcShelfSlice()).map((sh, idx) => {
      return { "videos": shelfstuff[idx], "title": sh.title, "filters": sh.fewSubs.map(sub => sub.filter) }
    })
    if (!injectShelfTitle[0].videos[0]) {
      injectShelfTitle[0].videos[0] = new VideoResponse()
      injectShelfTitle[0].videos[0].id = ''
    }
    return { shelfs: injectShelfTitle }
  }

  async function _fetchActivities() {
    
    if (!isSubscribed) { return }
    // console.log("Fetching activities: ")
    // console.log("prevPage, calcShelfSlice ")
    // console.log(prevPage)
    // console.log(calcShelfSlice())
    // console.log("user.customShelfs.slice(prevPage, calcShelfSlice())")
    // console.log(user.customShelfs.slice(prevPage, calcShelfSlice()))
    let shelfsActs = await ytLogic.getActivitiesShelfs(user.customShelfs.slice(prevPage, calcShelfSlice()))
    
    shelfsActs = ytLogic.removeNonVideos(shelfsActs)
    shelfsActs = shelfsActs.map(shelf => ytLogic.flattenShelf(shelf))
    shelfsActs = shelfsActs.map(shelf => ytLogic.sortByDate(shelf))
    
    return shelfsActs
  }

  async function _fetchVideos(shelfsActs) {
    
    if (!isSubscribed) { return }
    let shActs = shelfsActs
    shActs = shActs.map(sh => sh.slice(0, fetchThisManyVideosPerShelf))
    const shelfsVidIds = await shActs.map(sh => ytLogic.extractIds(sh))
    let shelfVids = await ytLogic.fetchVideos(shelfsVidIds)


    console.log("ShelfVids")
    console.log(shelfVids)
    shelfVids = shelfVids.filter(sh => sh.status > 199 || sh.status < 300).map(sh => sh.result.items)
    shelfVids = shelfVids.map(shelf => ytLogic.sortByDate(shelf))
    
    return shelfVids
  }

  async function _fetchMicros() {
    if (!isSubscribed) { return }
    let shelfs = user.customShelfs.slice(prevPage, calcShelfSlice())
    console.log("----------- shelfs -----------")
    console.log(shelfs)
    shelfs.forEach(sh => {
      const shPromises = sh.fewSubs.map( async (sub, index) => {
        let actsPromise = youtubeApi._getActivities(sub.channelId)
        actsPromise.then( acts => {
          
          console.log(index)
          console.log("acts")
          console.log(acts)
          let shelfsActs = ytLogic.removeNonVideosMicro( acts )
          if (shelfsActs == null) { return }
          shelfsActs = ytLogic.sortByDate(shelfsActs)
          
          console.log(index)
          console.log("shelfsActs")        
          console.log(shelfsActs)
        })
      })
      console.log("shPromises")
      console.log(shPromises)
    })
  }

  const fetchMoreSubs = async () => {

    let shelfsActs;
    let shelfVids;
    let iData;
    if (isEndReached()) {
      return
    }

    // halt room for multi fetches
    setIsMoreShelfs(false)
    isRemainingShelfs = false
    
    if (isSubscribed && isFirst) {    
      putUnsortedShelfAtBottom()      
    }
  //  _fetchMicros()
    
    shelfsActs = await _fetchActivities()
    shelfVids = await _fetchVideos(shelfsActs)
    iData = injectData(shelfVids)
    ytLogic.beginFilter2(iData.shelfs)
    console.log("iData")
    console.log("iData")
    console.log("iData")
    console.log(iData)

    setFinalShelfAux(iData)
  }


  const Shelfs = () => {
    return (
      <InfiniteScroll
        key={nextId('infScroll-')}
        loadMore={() => fetchMoreSubs()}
        hasMore={isMoreShelfs}
        loader={(<div key={nextId('loader-')}> </div>)}
        threshold={1000}
      >
        <NumVidsContext.Provider value={{ numVids, setNumVids }}>
          <ShelfsMany
            key={nextId('manyShelfsid-')}
            shelfs={finalShelfs.shelfs.slice(0, pageLength)}
            hasMore={isMoreShelfs}
          />
        </NumVidsContext.Provider>
      </InfiniteScroll>
    )
  }

  return (
    <div>
      { process.env.REACT_APP_ENV_NAME === 'development' ? <button onClick={logDebug}> Debugg button</button> : null }
      {isInitFinished2 ? <GreetingsMsg /> : null}
      {isNothingLoadedYet() ? <LoadingMain /> : <Shelfs />}
    </div>
  );
}
export default Youtube;








    //console.log("Fetching videos: ")    

    
    // BANG!!!!!
    // BANG!!!!!
    // BANG!!!!!
    // BANG!!!!!
    // let shActsAll = shelfsActs
    // const shelfsVidIds2 = await shActsAll.map(sh => ytLogic.extractIds(sh))
    // let shelfzzz = await ytLogic.fetchVideos2(shelfsVidIds2)
    // console.log("shelfzzz")
    // console.log("shelfzzz is all promisssssses form the videso")
    // console.log(shelfzzz)
    // let shelfzzz2 = []
    // let resultArr = shelfzzz.map( response => {
    //   console.log(response.status)
    //   if (response.status > 199 && response.status < 300) {
    //     shelfzzz2 = shelfzzz2.concat(response.result.items)
    //     console.log("response.result.items")
    //     console.log(response.result.items)
    //     console.log("shelfzzz2")
    //     console.log(shelfzzz2)
    //     return shelfzzz2
    //   }
    // })
    // console.log("resultArr")
    // console.log(resultArr)
    // shelfzzz = shelfzzz.filter(sh => sh.status > 199 || sh.status < 300).map(sh => sh.result.items)
    // shelfzzz = shelfzzz.map(shelf => ytLogic.sortByDate(shelf))
