/*
* The Youtube page starts by using the user's profile data (his subscriptions) then fetches data from youtube
* If the user is not logged in then we use a demo profile. 
*
*/

import React, { useContext, useEffect, useState } from 'react';

import InfiniteScroll from 'react-infinite-scroller';
import nextId from "react-id-generator";

import * as Common from '../BusinessLogic/Common.js';
import * as GApiAuth from '../HttpRequests/GApiAuth';
import * as ytLogic from '../BusinessLogic/YtLogic.js';
import {
  IsInitFinishedContext,
  UserContext,
  UserSettingsContext
} from '../Contexts/UserContext.js';
import FinalShelfs from '../Classes/FinalShelfs'
import GreetingsMsg from '../Common/GreetingsMsg.jsx'
import LoadingMain from '../Common/LoadingMain.jsx';
import ShelfsMany from './ShelfsMany.jsx';
import VidCounter from '../Classes/VidCounter'
import VideoResponse from '../Classes/VideoResponse'

function YoutubeNEW() {

  const spamLimit = 25;
  const pageGrowth = 4;
  const initialPageLength = 3
  // Arbitrary number (max 50) (see youtube's Video api)
  const fetchThisManyVideosPerShelf = 35
  let isSubscribed;

  const { user, setUser } = useContext(UserContext);
  const { userSetings, setUserSettings } = useContext(UserSettingsContext);
  const { isInitFinished2, setIsInitFinished2 } = useContext(IsInitFinishedContext);

  const [finalShelfs, setFinalShelfs] = useState(new FinalShelfs())
  const [pageLength, setPageLength] = useState(initialPageLength);
  const [prevPage2, setPrevPage2] = useState(0);
  const [numVids, setNumVids] = useState([new VidCounter()]) 
  const [isFirst, setIsFirst] = useState(true)
  const [isMoreShelfs, setIsMoreShelfs] = useState(false);
  let spamCount = 0;

  function isEndReached() {
    let isEnd = false;
    if (isFirst) {
      return false
    }
    if (spamCount > spamLimit
      || pageLength > user.customShelfs.length
      || prevPage2 >= user.customShelfs.length) {
      isEnd = true
    }
    return isEnd
  }

  function putUnsortedShelfAtBottom() {
    const newUser = user;
    let sort = user.customShelfs.filter(sh => sh.isSorted)
    const unSort = user.customShelfs.filter(sh => !sh.isSorted)
    sort = sort.concat(unSort)
    newUser.customShelfs = sort
    setUser(newUser)
  }

  async function hackHelper() {
    let count = 1
    let isReady = !GApiAuth.checkAll();
    while (isReady) {
      await Common.sleep(100 * count)
      count = count + 1
      if (count > 40) {
        count = count * 2
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

  function calcShelfSlice() {
    let sliceVal;
    if (user.customShelfs.length <= pageLength) {
      sliceVal = user.customShelfs.length
    } else {
      sliceVal = pageLength
    }
    return sliceVal

  }

  async function _fetchActivities() {

    let shelfsActs = await ytLogic.getActivitiesShelfs(user.customShelfs.slice(prevPage2, calcShelfSlice()))

    shelfsActs = ytLogic.removeNonVideos(shelfsActs)
    shelfsActs = shelfsActs.map(shelf => ytLogic.flattenShelf(shelf))
    shelfsActs = shelfsActs.map(shelf => ytLogic.sortByDate(shelf))

    return shelfsActs

  }

  function isNothingLoadedYet() {
    return (finalShelfs.shelfs[0].videos[0].id == null)
  }

  function setFinalShelfAux(iData) {
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
    setPrevPage2(pageLength)

    if (pageLength + pageGrowth > user.customShelfs.length) {
      setPageLength(user.customShelfs.length)
    } else {
      setPageLength(pageLength + pageGrowth)
    }

    spamCount = spamCount + pageGrowth;
    setIsMoreShelfs(true)
  }

  function injectData(shelfstuff) {

    const injectShelfTitle = user.customShelfs.slice(prevPage2, calcShelfSlice()).map((sh, idx) => {
      return { "videos": shelfstuff[idx], "title": sh.title, "filters": sh.fewSubs.map(sub => sub.filter) }
    })
    if (!injectShelfTitle[0].videos[0]) {
      injectShelfTitle[0].videos[0] = new VideoResponse()
      injectShelfTitle[0].videos[0].id = ''
    }
    return { shelfs: injectShelfTitle }
  }

  async function _fetchVideos(shelfsActs) {

    shelfsActs = shelfsActs.map(sh => sh.slice(0, fetchThisManyVideosPerShelf))

    const shelfsVidIds = await shelfsActs.map(sh => ytLogic.extractIds(sh))

    let shelfVids = await ytLogic.fetchVideos(shelfsVidIds)

    shelfVids = shelfVids.filter(sh => sh.status > 199 || sh.status < 300).map(sh => sh.result.items)

    shelfVids = shelfVids.map(shelf => ytLogic.sortByDate(shelf))

    return shelfVids
  }

  const fetchMoreSubs = async () => {

    if (isEndReached()) {
      return
    }

    await preFetchMoreSubs()

    const shelfsActs = await _fetchActivities()

    const shelfVids = await _fetchVideos(shelfsActs)

    const iData = injectData(shelfVids)

    ytLogic.beginFilter2(iData.shelfs)

    if (isSubscribed) {
      setFinalShelfAux(iData)
    }
  }

  async function initPage() {

    await GApiAuth.getGoogleAuth()
    if (GApiAuth.isHeSignedIn() && user.isDemo) {
      await Common.loginAndSet(setUser, setUserSettings)
    }
    setIsFirst(false)
    setNumVids(user.customShelfs.map(() => new VidCounter()))
    await fetchMoreSubs()
  }

  // https://juliangaramendy.dev/use-promise-subscription/ solution to 'mem-leak'
  useEffect(() => {
    isSubscribed = true;
    initPage()
    return () => {
      isSubscribed = false
    }
  }, [])


  const Shelfs = () => {
    return (
      <InfiniteScroll
        key={nextId('infScroll-')}
        loadMore={() => fetchMoreSubs()}
        hasMore={isMoreShelfs}
        loader={(<div key={nextId('loader-')}> </div>)}
        threshold={200}
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

  return (
    <div>
      {isInitFinished2 ? <GreetingsMsg /> : null}
      {isNothingLoadedYet() ? <LoadingMain /> : <Shelfs />}
    </div>
  );
}
export default YoutubeNEW;