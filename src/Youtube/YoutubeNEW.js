import React, { useState, useEffect, useContext, createContext, Fragment } from 'react';
import { UserContext, UserSettingsContext, IsLoggedContext } from '../Contexts/UserContext.js';

import * as Common                    from '../BusinessLogic/Common.js';

import * as ytLogic                     from '../BusinessLogic/ytLogic.js';
import * as youtubeApi                  from "../HttpRequests/youtubeApi";
import * as ServerEndpoints             from '../HttpRequests/ServerEndpoints.js'
import  * as GApiAuth                   from '../HttpRequests/GApiAuth';
import FinalShelfs           from '../Classes/FinalShelfs'
import VideoResponse           from '../Classes/VideoResponse'
//import { User }    from '../Classes/User'
import VidCounter     from '../Classes/VidCounter'
import CustomShelf    from '../Classes/CustomShelf'

import Subscription                 from '../Classes/Subscription'
import  ShelfsMany                    from './ShelfsMany';

import { ButtonsAuthDebug }             from '../Common/ButtonsAuthDebug';
import LoadingMain                  from '../Common/LoadingMain';

import axios from 'axios';
import InfiniteScroll                 from 'react-infinite-scroller';
import nextId  from "react-id-generator";
import ReactLoading from 'react-loading';

import * as moment from 'moment';
import { mdiProgressUpload } from '@mdi/js';
import M from 'materialize-css'

//UseState and accessing it before api is recieved https://stackoverflow.com/questions/49101122/cant-access-objects-properties-within-object-in-react
// react infinite scroll https://github.com/CassetteRocks/react-infinite-scroller#readme
// simpe react pagation https://codepen.io/grantdotlocal/pen/zReNgE
function YoutubeNEW() {

  let prevPage;
  const spamLimit = 25;
  let spamCount = 0;
  
  // At start, there are no shelfs, thus we have no more shelfs
  const [isMoreShelfs, setIsMoreShelfs] = useState(false); 
  const { user, setUser } = useContext(UserContext);
  const { userSetings, setUserSettings } = useContext(UserSettingsContext);
  const { isLogged2, setIsLogged2 } = useContext(IsLoggedContext);
  const [pageLength, setPageLength] = useState(1);
  const [finalShelfs, setFinalShelfs] = useState(new FinalShelfs())
  const [numVids, setNumVids] = useState([new VidCounter()]) // {vids: 0, shelfId: '' 
  const [isFirst, setIsFirst] = useState(true)
  
  // This is the finalShelf:
  // finalShelfs  = [ shelf, shelf, shelf ]
  // shelf        = [ vid, vid, vid, vid ]
  // vid          = { id, snippet: {}, contentDetails: {} }

   
  
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
  
  function putUnsortedShelfAtBottom() {
    let newUser = user;
    let sort = user.customShelfs.filter(sh => sh.isSorted)
    let unSort = user.customShelfs.filter(sh => !sh.isSorted)
    sort = sort.concat(unSort)
    newUser.customShelfs = sort
    setUser(newUser)
  }
  
  const preFetchMoreSubs = async () => {

    if (isFirst) {  
      putUnsortedShelfAtBottom() 
    }
    // instantly halt any possible room for multi fetches
    setIsMoreShelfs(false) 
    prevPage = pageLength - 1
    await ytLogic.hackHelper()
  }

  
  // eslint-disable-next-line no-underscore-dangle
  async function _fetchActivities() {

    let shelfsActs = await ytLogic.getActivitiesShelfs(user.customShelfs.slice(prevPage, pageLength))
    shelfsActs = ytLogic.removeNonVideos(shelfsActs)
    // TODO: follow up logic for orderdAndSplice(shelfsActs)

    // Returns - shelf[x].Activity[z]
    shelfsActs = shelfsActs.map(shelf => ytLogic.flattenShelf(shelf))
    shelfsActs = shelfsActs.map(shelf => ytLogic.sortByDate(shelf))
    
    // Arbitrary number (max 50) (see youtube's Video api)
    const fetchThisManyVideosPerShelf = 35 
    shelfsActs = shelfsActs.map(sh => sh.slice(0, fetchThisManyVideosPerShelf))

    return shelfsActs

  }
  
  function setFinalShelfAux(iData) {
    // if (!iData.shelfs[0].videos[0]) {
    //   // let emptyVid = { id: '' }
    //   iData.shelfs[0].videos[0] = new VideoResponse()
    //   iData.shelfs[0].videos[0].id = ''
    // }

    // TODO clean this slop 
    setFinalShelfs(prevShs => {
        let newS = { ...prevShs }
        if (prevPage === 0) {
          for (let i = 0; i < pageLength; i = i + 1) {
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
      setIsMoreShelfs(true) 
  }

  function injectData( shelfstuff) {
    let injectShelfTitle = user.customShelfs.slice(prevPage, pageLength).map((sh, idx) => {
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

    let shelfsVidIds = await shelfsActs.map(sh => ytLogic.extractIds(sh))
    let shelfVids = await ytLogic.fetchVideos(shelfsVidIds)

    shelfVids = shelfVids.filter(sh => sh.status > 199 || sh.status < 300).map(sh => sh.result.items)
    shelfVids = shelfVids.map(shelf => ytLogic.sortByDate(shelf))

    return shelfVids
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
  
  const LoggedOut = () => {
    return (
      <div className="center-align demo-greeting-wrap">
        <div className="flow-text">
          Log in to customize your homepage 
          <br />  
           Currently using a demo profile 
        </div>
        <div className='div-aux' />
      </div>
    )
  }

  const LoggedIn = () => {
    return(
      <div className=" profile-greeting-wrap">
        {/* <img className="profile-pic" src={user.pictureUrl}></img> */}
        <h4 className="profile-msg2"> 
          Hi, {user.username} 
        </h4> 
        <div className='div-aux' />
        {/* <div className="divider"></div> */}
      </div>
      )
  }

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
      {isLogged2 === true && !user.isDemo ? <LoggedIn /> : <LoggedOut />}
      {finalShelfs.shelfs[0].videos[0].id == null ? <LoadingMain /> : <Shelfs />}
      
      {/* JUNK BELOW */}
      {/* <ButtonsAuthDebug data={{ numVids, finalShelfs, user, isLogged2, pageLength, setPageLength, user }}/> */}
      
    </div>
    );
}
export default YoutubeNEW;