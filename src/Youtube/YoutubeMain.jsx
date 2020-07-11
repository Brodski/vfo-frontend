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


let isFirstRun = true
let isSubscribed = true
let prevPageLength = 0
function Youtube() {

  // const pageGrowth = 4;
  const pageGrowth = 2;
  const initialnumShelfsLoaded = 1;
  // const initialnumShelfsLoaded = 3;

  // Arbitrary number (max 50) (see youtube's Video api)
  const fetchThisManyVideosPerShelf = 50;

  const { user, setUser } = useContext(UserContext);
  const { userSetings, setUserSettings } = useContext(UserSettingsContext);
  const { isInitFinished, setIsInitFinished } = useContext(IsInitFinishedContext);

  const [finalShelfs, setFinalShelfs] = useState(new FinalShelfs())
  const [numShelfsLoaded, setNumShelfsLoaded] = useState(initialnumShelfsLoaded);
  const [numVids, setNumVids] = useState([new VidCounter()]) 
  const [isMoreShelfs, setIsMoreShelfs] = useState(false);
  
  const isNothingLoadedYet = () => finalShelfs.shelfs[0].videos[0].id == null


  async function initPage() {
    
    await Common.betterLogin(setUser, setUserSettings)
    isFirstRun = false
    setNumVids(user.customShelfs.map(() => new VidCounter()))
    await fetchMoreVids()
  }

  // https://juliangaramendy.dev/use-promise-subscription/ solution to 'mem-leak'
  useEffect(() => {
    initPage()
    return () => {
      isSubscribed = false
    }
  }, [])


  function logDebug(){
      console.log("USER")
      console.log(user)
      console.log("isFirstRun")
      console.log(isFirstRun)
  }

  let isEndReached = ( () => {
    if (isFirstRun) { 
      return false 
    } else if ( numShelfsLoaded > user.customShelfs.length || prevPageLength >= user.customShelfs.length) {
      return true
    } else {
      return false
    }
  })()

  function putUnsortedShelfAtBottom() {
    const newUser = user;
    let sort = user.customShelfs.filter(sh => sh.isSorted)
    let unSort = user.customShelfs.filter(sh => !sh.isSorted)
    // sort = sort.concat(unSort)
    newUser.customShelfs = sort.concat(unSort)
    setUser(newUser)
  }

  let getPageLength = (() => { return user.customShelfs.length <= numShelfsLoaded ? user.customShelfs.length : numShelfsLoaded }) ()

  // function calcShelfSlice() {
  //   let sliceVal;
  //   if (user.customShelfs.length <= numShelfsLoaded) {
  //     sliceVal = user.customShelfs.length
  //   } else {
  //     sliceVal = numShelfsLoaded
  //   }
  //   return sliceVal
  // }

  function setFinalShelfAux(iData) {
    
    if (!isSubscribed) { return }

    setFinalShelfs(prevShs => {
      const newS = { ...prevShs }
      if (isNothingLoadedYet()) {
        newS.shelfs[0] = iData.shelfs.shift()
      }
      iData.shelfs.forEach(sh => {
        newS.shelfs.push(sh)
      });
      return newS;
    })

    // setPrevPage(numShelfsLoaded)
    prevPageLength = numShelfsLoaded
    
    if (numShelfsLoaded + pageGrowth > user.customShelfs.length) {
      setNumShelfsLoaded(user.customShelfs.length)
    } else {
      setNumShelfsLoaded(numShelfsLoaded + pageGrowth)
    }
    
    setIsMoreShelfs(true)
    // console.log("Setting to true")
    // isRemainingShelfs = true
    
  }

  function injectData(shelfstuff) {
    console.log("getPageLength")
    console.log(getPageLength)
    const injectShelfTitle = user.customShelfs.slice(prevPageLength, getPageLength).map((sh, idx) => {
    // const injectShelfTitle = user.customShelfs.slice(prevPage, calcShelfSlice()).map((sh, idx) => {
      return { "videos": shelfstuff[idx], "title": sh.title, "filters": sh.fewSubs.map(sub => sub.filter) }
    })
    if (!injectShelfTitle[0].videos[0]) {
      injectShelfTitle[0].videos[0] = new VideoResponse()
      injectShelfTitle[0].videos[0].id = ''
    }
    return { shelfs: injectShelfTitle }
  }
  // async function _fetchActivities2(nextShelfs) {
  //   if (!isSubscribed) { return }
  //   let shelfsActs = await ytLogic.getActivitiesShelfs(
  //   let  nextActivities = ytLogic.removeNonVideos(nextShelfs)
  //   nextActivities = nextActivities.map(shelf => ytLogic.flattenShelf(shelf))
  //   nextActivities = nextActivities.map(shelf => ytLogic.sortByDate(shelf))
  //   console.log("nextActivities")
  //   console.log(nextActivities)
    
  //   return nextActivities

  // }
  async function _fetchActivities() {
    
    if (!isSubscribed) { return }
    let shelfsActs = await ytLogic.getActivitiesShelfs(user.customShelfs.slice(prevPageLength, getPageLength))
    shelfsActs = ytLogic.removeNonVideos(shelfsActs)
    shelfsActs = shelfsActs.map(shelf => ytLogic.flattenShelf(shelf))
    shelfsActs = shelfsActs.map(shelf => ytLogic.sortByDate(shelf))
    console.log("shelfsActs")
    console.log(shelfsActs)
    
    return shelfsActs
  }

  // async function _fetchVideos(shelfsActs) {
    
  //   if (!isSubscribed) { return }
  //   // let shActs = shelfsActs
  //   let count = 0
  //   let promises = []
  //   while ( count < shelfsActs.length) {
  //     let subArr = shelfsActs.slice(count, count + 50)
  //     let vidIds = subArr.map(sh => ytLogic.extractIds(sh))
  //     // promises.push( ytLogic.fetchVideos(vidIds) )
  //     promises.push( youtubeApi.getSomeVideos(vidIds) )
  //     count = count + 50
  //   }
  //   let allVids = await Promise.all(promises)

  //   // shActs = shActs.map(sh => sh.slice(0, fetchThisManyVideosPerShelf))
  //   // let shelfsVidIds = await shActs.map(sh => ytLogic.extractIds(sh))
  //   // let shelfVids = await ytLogic.fetchVideos(shelfsVidIds)

  //   allVids = allVids.filter(sh => sh.status > 199 || sh.status < 300).map(sh => sh.result.items)
  //   allVids = allVids.map(shelf => ytLogic.sortByDate(shelf))

  //   console.log("allVids")
  //   console.log("allVids")
  //   console.log("allVids")
  //   console.log("allVids")
  //   console.log("allVids")
  //   console.log("allVids")
  //   console.log("allVids")
  //   console.log("allVids")
  //   console.log(allVids)
    
  //   return allVids
  // }
  // }
  async function _fetchVideos(shelfsActs) {
    if (!isSubscribed) { return }
    console.log("BEFORE")
    console.log("BEFORE")
    console.log("BEFORE")
    console.log("BEFORE")
    console.log("BEFORE")
    console.log("shelfsActs")
    console.log(shelfsActs)
    // let promises = []
    // shelfsActs.forEach( activityOfAChannel => {
    //   let x = actualFetchVideos(activityOfAChannel)
    //   console.log(x)
    //   promises.push(x)
    // })
    
    let shActs = shelfsActs
    shActs = shActs.map(sh => sh.slice(0, fetchThisManyVideosPerShelf))

    let shelfsVidIds =  shActs.map(sh => ytLogic.extractIds(sh))
    let shelfVids = await ytLogic.fetchVideos(shelfsVidIds)

    shelfVids = shelfVids.filter(sh => sh.status > 199 || sh.status < 300).map(sh => sh.result.items)
    shelfVids = shelfVids.map(shelf => ytLogic.sortByDate(shelf))

    console.log("AFTER")
    console.log("AFTER")
    console.log("AFTER")
    console.log("AFTER")
    console.log("AFTER")
    console.log("AFTER")
    console.log("AFTER")
    console.log("AFTER")
    console.log("AFTER")
    console.log("AFTER")
    console.log("ShelfVids")

    console.log(shelfVids)
    
    return shelfVids
  }

  // async function _fetchMicros() {
  //   if (!isSubscribed) { return }
  //   let shelfs = user.customShelfs.slice(prevPageLength, calcShelfSlice())
  //   // let shelfs = user.customShelfs.slice(prevPage, calcShelfSlice())
  //   console.log("----------- shelfs -----------")
  //   console.log(shelfs)
  //   shelfs.forEach(sh => {
  //     const shPromises = sh.fewSubs.map( async (sub, index) => {
  //       let actsPromise = youtubeApi._getActivities(sub.channelId)
  //       actsPromise.then( acts => {
          
  //         console.log(index)
  //         console.log("acts")
  //         console.log(acts)
  //         let shelfsActs = ytLogic.removeNonVideosMicro( acts )
  //         if (shelfsActs == null) { return }
  //         shelfsActs = ytLogic.sortByDate(shelfsActs)
          
  //         console.log(index)
  //         console.log("shelfsActs")        
  //         console.log(shelfsActs)
  //       })
  //     })
  //     console.log("shPromises")
  //     console.log(shPromises)
  //   })
  // }

  async function getActivities2(nextShelfs) {

    let eachShelf = []
    nextShelfs.forEach( shelf => {
      let activities = []
      console.log("shelf")
      console.log(shelf)

      shelf.fewSubs.forEach(subscription => {
        let acts = youtubeApi._getActivities(subscription.channelId)
        activities.push(acts)
      })
      eachShelf.push(activities)
    })
    console.log(eachShelf)
    console.log('promising in')
    eachShelf.forEach( act => Promise.all(act))
    console.log('promising out')
  
  }
  
  const fetchMoreVids = async () => {

    let shelfsActs;
    let shelfVids;
    let iData;
    if (isEndReached) { return }
    if (isSubscribed && isFirstRun) { putUnsortedShelfAtBottom() }
    setIsMoreShelfs(false)
    
    
    let nextShelfs = user.customShelfs.slice(prevPageLength, getPageLength)

    console.log("GOING IN")
    /// HERE HERE HER
    // shelfsActs = await getActivities2(nextShelfs)
    console.log("GOING OUT")
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
        loadMore={() => fetchMoreVids()}
        // hasMore={isRemainingShelfs}
        hasMore={isMoreShelfs}
        loader={(<div key={nextId('loader-')}> </div>)}
        threshold={1000}
      >
        <NumVidsContext.Provider value={{ numVids, setNumVids }}>
          <ShelfsMany
            key={nextId('manyShelfsid-')}
            shelfs={finalShelfs.shelfs.slice(0, numShelfsLoaded)}
            // hasMore={isRemainingShelfs}
            hasMore={isMoreShelfs}
          />
        </NumVidsContext.Provider>
      </InfiniteScroll>
    )
  }

  return (
    <div>
      { process.env.REACT_APP_ENV_NAME === 'development' ? <button onClick={logDebug}> Debugg button</button> : null }
      {isInitFinished ? <GreetingsMsg /> : null}
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
