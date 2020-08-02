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


// let isFirstRun = true
// let isSubscribed = true
// let prevPageLength = 0
function Youtube() {
  console.log("\n\n\nTOP OF YOYTUBE\n\n\n")
  // console.log("prevPageLength")
  // console.log(prevPageLength)

  // const pageGrowth = 4;
  const pageGrowth = 2;
  const initialNumShelfsLoaded = 1;
  // const initialNumShelfsLoaded = 3;

  // Arbitrary number (max 50) (see youtube's Video api)
  const fetchThisManyVideosPerShelf = 50;

  const { user, setUser } = useContext(UserContext);
  const { userSetings, setUserSettings } = useContext(UserSettingsContext);
  const { isInitFinished, setIsInitFinished } = useContext(IsInitFinishedContext);

  const [isFirstRun, setIsFirstRun] = useState(true)
  const [isSubscribed, setIsSubscribed] = useState(true)
  const [prevPageLength, setPrevPageLength] = useState(0)
  const [finalShelfs, setFinalShelfs] = useState(new FinalShelfs())
  const [numShelfsLoaded, setNumShelfsLoaded] = useState(initialNumShelfsLoaded);
  const [numVids, setNumVids] = useState([new VidCounter()]) 
  const [isMoreShelfs, setIsMoreShelfs] = useState(false);
  
  const isNothingLoadedYet = (() => finalShelfs.shelfs[0].videos[0].id == null)()
  const getPageLength = (() => { return user.customShelfs.length <= numShelfsLoaded ? user.customShelfs.length : numShelfsLoaded }) ()


  async function initPage() {
    
    await Common.betterLogin(setUser, setUserSettings)
    // isFirstRun = false
    setIsFirstRun(false)
    setNumVids(user.customShelfs.map(() => new VidCounter()))
    await fetchMoreVids()
  }

  // https://juliangaramendy.dev/use-promise-subscription/ solution to 'mem-leak'
  useEffect(() => {
    initPage()
    return () => {
      // isSubscribed = false
      setIsSubscribed(false)
    }
  }, [])


  function logDebug(){
      console.log("USER")
      console.log(user)
      console.log("numVids")
      console.log(numVids)
      console.log("finalShelfs")
      console.log(finalShelfs)
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


  function setFinalShelfAux(iData) {
    
    if (!isSubscribed) { return }

    setFinalShelfs(prevShs => {
      const newS = { ...prevShs }
      if (isNothingLoadedYet) {
        newS.shelfs[0] = iData.shelfs.shift()
      }
      iData.shelfs.forEach(sh => {
        newS.shelfs.push(sh)
      });
      return newS;
    })

    // setPrevPage(numShelfsLoaded)
    console.log("\n\n\nSETTING")

    console.log("BEFORE prevPageLength, numShelfsLoaded")
    console.log(prevPageLength, numShelfsLoaded)
    // prevPageLength = numShelfsLoaded
    setPrevPageLength(numShelfsLoaded)
    console.log("AFTER prevPageLength, numShelfsLoaded")
    console.log(prevPageLength, numShelfsLoaded)

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
    console.log('--------------------')
    console.log('--------------------')
    console.log('--------------------')
    console.log('--------------------')
    console.log('shelfstuff')
    console.log(shelfstuff)
    console.log("user.customShelfs.slice(prevPageLength, getPageLength)")
    console.log(user.customShelfs.slice(prevPageLength, getPageLength))
    console.log("prevPageLength, getPageLength")
    console.log(prevPageLength, getPageLength)
    console.log("user.customShelfs.length <= numShelfsLoaded ")
    console.log(user.customShelfs.length <= numShelfsLoaded )
    console.log("user.customShelfs.length, numShelfsLoaded")
    console.log(user.customShelfs.length, numShelfsLoaded)
    // let injectShelfTitle = null
    let injectShelfTitle = user.customShelfs.slice(prevPageLength, getPageLength).map((sh, idx) => {
      console.log(idx, '  ++ ++ ++ ++ ++ ++')
      console.log(idx, '  ++ ++ ++ ++ ++ ++')
      console.log("shelfstuff[idx]")
      console.log(shelfstuff[idx])
      let vids = shelfstuff[idx] ?  shelfstuff[idx] : []
      // return { "videos": shelfstuff[idx], "title": sh.title, "filters": sh.fewSubs.map(sub => sub.filter) }
      return { "videos": vids, "title": sh.title, "filters": sh.fewSubs.map(sub => sub.filter) }
    })
    console.log("injectShelfTitle")
    console.log("injectShelfTitle")
    console.log("injectShelfTitle")
    console.log(injectShelfTitle)
    if ( !injectShelfTitle[0].videos[0]) {
      console.log("SOMETHIGN IS GOING ON HERE!!!!!!!!!!")
      console.log("SOMETHIGN IS GOING ON HERE!!!!!!!!!!")
      injectShelfTitle[0].videos[0] = new VideoResponse()
      injectShelfTitle[0].videos[0].id = ''
    }
    return { shelfs: injectShelfTitle }
  }
  async function _fetchActivities() {
    
    if (!isSubscribed) { return }
    let shelfsActs = await ytLogic.getActivitiesShelfs(user.customShelfs.slice(prevPageLength, getPageLength))
    console.log("TOP OF RAW shelfsActs")
    console.log(shelfsActs)
    shelfsActs = ytLogic.getResult(shelfsActs)
    shelfsActs = shelfsActs.map(shelf => ytLogic.flattenShelf(shelf))
    shelfsActs = shelfsActs.map(shelf => ytLogic.sortByDate(shelf))
    console.log("shelfsActs")
    console.log(shelfsActs)
    
    return shelfsActs
  }

  async function _fetchVideos2(shelfsActs) {
    
    if (!isSubscribed) { return }
    console.log("_fetchVideos2")
    console.log("shelfsActs new dilio")
    console.log(shelfsActs)

    let allShelfs = []
    shelfsActs.forEach( async sh => {
      let count = 0
      console.log("sh.length")
      console.log(sh.length)
      console.log(sh.length)
      if (sh.length == 0 ){
        console.log("WOAH ------------------------")
        return // b/c forEach
      }
      let eachShelf = []

      while ( count < sh.length) {
        console.log("count")
        console.log(count)
        let subArr = sh.slice(count, count + 50)
        console.log("subArr")
        console.log(subArr)
        let vidIds = ytLogic.extractIds(subArr)
        // let vidIds = subArr.map(act => ytLogic.extractIds(act))
        // promises.push( ytLogic.fetchVideos(vidIds) )
        console.log("vidIds")
        console.log(vidIds)
        eachShelf.push( youtubeApi.getSomeVideos(vidIds) )
        count = count + 50
      }
      if (eachShelf.length > 0) {
        allShelfs.push(eachShelf)
      } else {
        console.log("WOAH -??????????????????")
      }
    })
    console.log("allShelfs")
    console.log(allShelfs)
    let x = allShelfs.map( yy => Promise.all(yy))
    let shelfsVids = await Promise.all(x)

    console.log("shelfsVids")
    console.log(shelfsVids)
    let vidsOnEachShelf = []
    shelfsVids.forEach( sh => {
      console.log("sh")
      console.log(sh)
      let vids = []
      sh.forEach( responseOfMax50 => {
        let resp = responseOfMax50.result.items
        vids = vids.concat(resp)
      } )
      console.log("vids")
      console.log(vids)
      vidsOnEachShelf.push(vids)
    })
    
    console.log("vidsOnEachShelf")
    console.log("vidsOnEachShelf")
    console.log(vidsOnEachShelf)

    // let actuallAllVidsPerShelf = []
    // shelfsVids.forEach ( shxx => {
    //   let shx = shxx
    //   console.log("shx")
    //   console.log(shx)
    //   shx = shx.filter(sh => sh.status > 199 || sh.status < 300).map(sh => sh.result.items)
    //   shx = shx.map(shelf => ytLogic.sortByDate(shelf))
    //   console.log("cleaner")
    //   console.log(shx)
    //   actuallAllVidsPerShelf.push(shx)
    // })
    // console.log("actuallAllVidsPerShelf")
    // console.log("actuallAllVidsPerShelf")
    // console.log("actuallAllVidsPerShelf")
    // console.log(actuallAllVidsPerShelf)
    
    
    // return shelfsVids
    return vidsOnEachShelf

  }

  async function _fetchVideos(shelfsActs) {
    if (!isSubscribed) { return }
    console.log("BEFORE")
    console.log("BEFORE")
    console.log("BEFORE")
    console.log("shelfsActs")
    console.log(shelfsActs)
    
    let shActs = shelfsActs
    shActs = shActs.map(sh => sh.slice(0, fetchThisManyVideosPerShelf))

    let shelfsVidIds =  shActs.map(sh => ytLogic.extractIds(sh))
    let shelfVids = await ytLogic.fetchVideos(shelfsVidIds)
    console.log("BEFORE FLTERE")
    console.log(shelfVids)
    
    shelfVids = shelfVids.filter(sh => sh.status > 199 || sh.status < 300).map(sh => sh.result.items)
    shelfVids = shelfVids.map(shelf => ytLogic.sortByDate(shelf))

    console.log("AFTER")
    console.log("AFTER")
    console.log("AFTER")
    console.log("ShelfVids")

    console.log(shelfVids)
    
    return shelfVids
  }


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
    let x = eachShelf.map( act => Promise.all(act))
    return Promise.all(x)
  
  }
  
  const fetchMoreVids = async () => {

    let shelfsActs;
    let shelfVids;
    let iData;
    if (isEndReached) { return }
    if (isSubscribed && isFirstRun) { putUnsortedShelfAtBottom() }
    setIsMoreShelfs(false)
    
    console.log("prevPageLength, getPageLength!!!!!!")
    console.log("prevPageLength, getPageLength!!!!!!")
    console.log(prevPageLength, getPageLength)
    console.log("user.customShelfs")
    console.log(user.customShelfs)
    
    let nextShelfs = user.customShelfs.slice(prevPageLength, getPageLength)
    console.log("nextShelfs")
    console.log(nextShelfs)
    shelfsActs = await getActivities2(nextShelfs)
     
    console.log("shelfsActs")
    console.log(shelfsActs)
     
    shelfsActs = ytLogic.getResult(shelfsActs)
    shelfsActs = shelfsActs.map(shelf => ytLogic.flattenShelf(shelf))
    shelfsActs = shelfsActs.map(shelf => ytLogic.sortByDate(shelf))

    // shelfsActs = await _fetchActivities()
    shelfVids = await _fetchVideos2(shelfsActs)
    // shelfVids = await _fetchVideos(shelfsActs)
    iData = injectData(shelfVids)
    console.log("shelfVids")
    console.log("shelfVids")
    console.log(shelfVids)
    console.log("iData")
    console.log("iData")
    console.log(iData)
    ytLogic.beginFilter2(iData.shelfs)

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
      {isNothingLoadedYet ? <LoadingMain /> : <Shelfs />}
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
