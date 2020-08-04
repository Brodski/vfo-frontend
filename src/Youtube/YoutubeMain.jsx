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
  const initialNumShelfsLoaded = 1;

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
    setIsFirstRun(false)
    setNumVids(user.customShelfs.map(() => new VidCounter()))
    await fetchMoreVids()
  }

  // https://juliangaramendy.dev/use-promise-subscription/ solution to 'mem-leak'
  useEffect(() => {
    initPage()
    return () => {
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

    setPrevPageLength(numShelfsLoaded)

    if (numShelfsLoaded + pageGrowth > user.customShelfs.length) {
      setNumShelfsLoaded(user.customShelfs.length)
    } else {
      setNumShelfsLoaded(numShelfsLoaded + pageGrowth)
    }
  
    setIsMoreShelfs(true)
  }


  function injectData(shelfstuff) {
    // let injectShelfTitle = null
    let injectShelfTitle = user.customShelfs.slice(prevPageLength, getPageLength).map((sh, idx) => {
      let vids = shelfstuff[idx] ?  shelfstuff[idx] : []
      return { "videos": vids, "title": sh.title, "filters": sh.fewSubs.map(sub => sub.filter) }
    })
    // console.log("injectdata 1/2")
    // console.log(injectShelfTitle)
    if ( !injectShelfTitle[0].videos[0]) {
      injectShelfTitle[0].videos[0] = new VideoResponse()
      injectShelfTitle[0].videos[0].id = ''
    }
    // console.log("injectdata 2/2")
    // console.log( {shelfs: injectShelfTitle})
    return { shelfs: injectShelfTitle }
  }
  
  async function _fetchVideos2(shelfsActs) {
    
    if (!isSubscribed) { return }

    let allShelfs = []
    shelfsActs.forEach( async sh => {
      let count = 0
      if (sh.length == 0 ){
        return // "return" since forEach
      }
      let eachShelf = []

      while ( count < sh.length) {
        let subArr = sh.slice(count, count + 50)
        let vidIds = ytLogic.extractIds(subArr)
        eachShelf.push( youtubeApi.getSomeVideos(vidIds) )
        count = count + 50
      }
      if (eachShelf.length > 0) {
        allShelfs.push(eachShelf)
      }
    })
    let x = allShelfs.map( yy => Promise.all(yy))
    let shelfsVids = await Promise.all(x)

    let vidsOnEachShelf = []
    shelfsVids.forEach( sh => {
      let vids = []
      sh.forEach( responseOfMax50 => {
        let resp = responseOfMax50.result.items
        vids = vids.concat(resp)
      } )
      vidsOnEachShelf.push(vids)
    })
    return vidsOnEachShelf
  }

  async function getActivities2(nextShelfs) {

    let eachShelf = []
    nextShelfs.forEach( shelf => {
      let activities = []
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

    // console.log("user.customShelfs")
    // console.log(user.customShelfs)
    
    let nextShelfs = user.customShelfs.slice(prevPageLength, getPageLength)
    shelfsActs = await getActivities2(nextShelfs)     
    shelfsActs = ytLogic.getResult(shelfsActs)
    shelfsActs = shelfsActs.map(shelf => ytLogic.flattenShelf(shelf))
    shelfsActs = shelfsActs.map(shelf => ytLogic.sortByDate(shelf))

    shelfVids = await _fetchVideos2(shelfsActs)

    // console.log("\n\n\n\nshelfVids")
    // console.log(shelfVids)

    iData = injectData(shelfVids)

    // console.log("\n\n\n\niData")
    // console.log(iData)
    ytLogic.beginFilter2(iData.shelfs)

    setFinalShelfAux(iData)
  }


  const Shelfs = () => {
    return (
      <InfiniteScroll
        key={nextId('infScroll-')}
        loadMore={() => fetchMoreVids()}
        hasMore={isMoreShelfs}
        loader={(<div key={nextId('loader-')}> </div>)}
        threshold={1000}
      >
        <NumVidsContext.Provider value={{ numVids, setNumVids }}>
          <ShelfsMany
            key={nextId('manyShelfsid-')}
            shelfs={finalShelfs.shelfs.slice(0, numShelfsLoaded)}
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