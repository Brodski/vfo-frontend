import React, { useState, useEffect, useContext } from 'react';
import ReactDOM from 'react-dom';

import { Link } from "react-router-dom";
import axios from 'axios';
import { SECRET_KEYS } from '../api-key';
import * as Common from '../BusinessLogic/Common.js';
import * as videoJ from '../Scratch/api_video.json';
import * as moment from 'moment';
import * as youtubeApi from "../HttpRequests/youtubeApi";
import { UserShelf } from '../Classes/UserShelf';
import { Filter } from '../Classes/Filter';
import { Subscription } from '../Classes/Subscription';
import { Shelf } from '../Components/Shelf';
import { Video } from '../Components/Video';
import { ShelfsMany } from '../Components/ShelfsMany';
import { ShelfsMany2 } from '../Components/ShelfsMany';
import { ChannelForm } from '../Components/ChannelForm';
import { VideoShelf } from '../Components/VideoShelf';
import { ButtonsAuthDebug } from '../Components/ButtonsAuthDebug';
import  * as GApiAuth from '../HttpRequests/GApiAuth';
import { CustomShelf } from '../Classes/User';
import InfiniteScroll from 'react-infinite-scroller';


import * as ytLogic from '../BusinessLogic/ytLogic.js'
import { UserContext } from '../Contexts/UserContext.js'
import * as ServerEndpoints from '../HttpRequests/ServerEndpoints.js'
import { FinalShelfs, FinalShelfs2 } from '../Classes/FinalShelfs';
import * as FS  from '../Classes/FinalShelfs';


//UseState and accessing it before api is recieved https://stackoverflow.com/questions/49101122/cant-access-objects-properties-within-object-in-react
// react infinite scroll https://github.com/CassetteRocks/react-infinite-scroller#readme
// simpe react pagation https://codepen.io/grantdotlocal/pen/zReNgE
export function YoutubeNEW() {

//  var GoogleAuth;
  const initialPageLength = 3;
  let prevPage;
  let spamLimit = 25;
  let spamCount = 0;
  const { user, setUser }         = useContext(UserContext);
  //const [pageLength, setPageLength] = useState(3);
  const [pageLength, setPageLength] = useState(initialPageLength);
  const [hasMoreShelfs, setHasMoreShelfs] = useState(false); //At start, there are no shelfs, thus we have no more shelfs

  const [finalShelfs, setFinalShelfs] = useState( new FinalShelfs())
  
  
  
  ////////////////////////////////////////////////////
  moment.updateLocale('en', {
    relativeTime: {
      m: "1 minute",
      h: "1 hour",
      d: "1 day",
      M: "1 month",
      y: "1 year",
    }
  });

  /////////////////////////////////////////////

  // This is the finalShelf:
  //
  // PageOfShelfs = finalShelfs = [ shelf, shelf, shelf ]
  // shelf        = [ vid, vid, vid, vid ]
  // vid          = { id, snippet: {}, contentDetails: {} }

  useEffect( () => {
    console.log('---------------useEffect top ----------------------')
    console.log(user)
    if (user.userId) { //Since state variable has 'new User()' default 'values', we need to check for actual user existence
      //if (ytLogic.hasUsedRecently()) {
      if (false) {
          console.log("USED RECNETLY!!!")
          console.log("getting fomr local")
          let shelfsVids = ytLogic.getStorageShelfs()
          setFinalShelfs(shelfsVids)
          setHasMoreShelfs(true) //We now have shelfs to be rendered
      } else {
        console.log("NOT used !!!!!")
        console.log("doing fetch to google")
        fetchMoreSubs(true) // true ---> first run

      }
    }
    console.log('---------------useEffect bot----------------------')
  }, [user])
   
  function putUnsortedShelfAtBottom() {
    console.log('user')
    console.log(user)
    let newUser = user;
    let sort    = user.customShelfs.filter( sh => sh.isSorted)
    let unSort  = user.customShelfs.filter( sh => !sh.isSorted)  
    sort = sort.concat(unSort)
    newUser.customShelfs = sort
    setUser(newUser)

  }
  
  function isEndReached() {
    let isEnd = false;
    if (spamCount > spamLimit || pageLength > user.customShelfs.length) {
      console.log('\n\n\n\nbro you reached the limit\n\n\n')
      console.log(pageLength)
      console.log(user.customShelfs.length)
      isEnd = true
    }
    return isEnd
  }

  function injectData(isActs, shelfstuff) {
    let injectShelfTitle = user.customShelfs.slice(prevPage, pageLength).map((sh, idx) => {
      return {"videos": shelfstuff[idx], "title":sh.title, "filters": sh.fewSubs.map(sub => sub.filter)}
    })
    return { isActs, shelfs: injectShelfTitle }

  } 
  
  async function hackHelper() {
  let count = 1
  let isloggedOut;
    while (isloggedOut = !GApiAuth.isHeSignedIn()) {
      console.log("Hack Helper: GoogleAuth NOT exist: " + count)
      console.log('Hack Helper: Logged out?: ' + isloggedOut)
      console.log('user')
      console.log(user)
      await Common.sleep(100*count) 
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
    


    // Returns only Uploads of the activities
    shelfsActs = await ytLogic.removeNonVideos(shelfsActs)
    
    // Returns all the activies in a single array (shelf), instead array of activities in n different sub
    // Kinda like: shelf[x].Activity[z]
    shelfsActs = await shelfsActs.map( shelf => ytLogic.flattenShelf(shelf))
    shelfsActs = await shelfsActs.map( shelf => ytLogic.sortByDate(shelf))

    // Fetch data from youtube api
    const fetchThisManyVideosPerShelf = 20 //Arbitrary number (max 50) (see youtube's Video api)
    shelfsActs = shelfsActs.map(sh => sh.slice(0,fetchThisManyVideosPerShelf))    

    
    {/*as Object
      let actResponses = shelfsActs.map(sh => (sh.map(sub => {
      let actRes = new FS.ActRes()
      actRes.contentDetails = sub.contentDetails;
      actRes.snippet = sub.snippet;
      return actRes
    })))
    return actResponses*/}
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

    {/*let vidResponses = shelfVids.map(sh => (sh.map(sub => {
      let vidRes = new FS.VideoRes()
      vidRes.contentDetails = sub.contentDetails;
      vidRes.snippet        = sub.snippet;
      vidRes.statistics     = sub.statistics
      return vidRes
    })))
    return vidResponses*/}

    return shelfVids
  }

const fetchMoreSubs = async (isFirstRun) => {
    if (isFirstRun) { await putUnsortedShelfAtBottom() }

    setHasMoreShelfs(false) //instantly halt any possible room for multi fetches
    prevPage = pageLength == initialPageLength ? 0 : pageLength - 1 //PrevPage = 0 for initial load //After that prevPage = pageLength - 1
    console.log(" xxxxXXXXxxxx fetchMoreSubs xxxxXXXXxxxx")
    
    console.log("\n\n TOP setting pages: ")
    console.log("prevPage, pageLength ")
    console.log(prevPage + ',' + pageLength)
    

    await hackHelper()
    if ( isEndReached()) { //If all shelfs retrieved, then quit
      return
    }

    let shelfsActs = await _fetchActivities()
    console.log('shelfsActs')
    console.log(shelfsActs)

    let iData = injectData(true, shelfsActs)

    console.log('iData - Activities')
    console.log(iData)
    
    
    /*setFinalShelfs(prevShs => {
      let newS = { ...prevShs }
      prevPage != 0 ? newS.shelfs.push(...iData.shelfs) : newS = iData
      newS.isActs = true
      return newS
    })*/
    
    
    let shelfVids = await _fetch2ndHalf(shelfsActs)
    
    iData = injectData(false, shelfVids)
    
    ytLogic.beginFilter2(iData.shelfs)
    //beginFilter(iData)

    //beginFilter(iData)

    console.log("_____-------WE FINISHED THE FILTER!-------_______")
    console.log("_____ {prevPage, pageLength} " + {prevPage, pageLength} )
    console.log('finalShelfs')
    console.log(finalShelfs)
    console.log('iData - Videos')
    console.log(iData)
    console.log('user')
    console.log(user)

      //TODO clean this slop 
      setFinalShelfs(prevShs => {
        let newS = { ...prevShs }
        newS.isActs = false
        if (prevPage == 0) {
          for (let i = 0; i < pageLength; i++) {
            newS.shelfs[prevPage + i] = iData.shelfs[i]
          }
        } else {
          console.log("I Think we doing this")
          newS.shelfs.push(iData.shelfs[0])
        }
        return newS
      })
    
    //ytLogic.saveToLocal(iData)  


    setPageLength( pageLength + 1)
    spamCount = spamCount + 1;
    setHasMoreShelfs(true) //We now have shelfs to be rendered
  }
    
  
    
    
  return(
    <div>
        <ButtonsAuthDebug />
      <button onClick={() => {console.log('finalShelfs'); console.log(finalShelfs); } }> log finalShelfs </button>
      <button onClick={() => {console.log('user'); console.log(user); } }> log User </button>
    <InfiniteScroll
        loadMore={fetchMoreSubs}
        hasMore={hasMoreShelfs}
        loader={(<div>Loading ...</div>)}
      >
        <ShelfsMany isActs={finalShelfs.isActs} shelfs={finalShelfs.shelfs.slice(0, pageLength)} /> 
     </InfiniteScroll>
      
      <h1>Youtube</h1>
        <div>Note, the app must ALWAYS do loadClient before any API call</div>
      
      <h3> Youtube api </h3>
      
      <div/>
        <button onClick={ytLogic.getAllSubs}> Get All Subs  </button> 
      <div/>
        <button onClick={ytLogic.XXXgetActivitesOfChannels_2}> 2.0: Get All Subs, then get activites of 1 of your subs  </button>
      
      <div></div>
      
      <ChannelForm />
      
      {/*    <VideoShelf videoList={videoJ.items}/>
      <Video video={videoJ.items[0]} />*/}
        

    </div>
    );
}

