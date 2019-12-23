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
import { UserContext, IsSignedContext } from '../Contexts/UserContext.js'
import * as ServerEndpoints from '../HttpRequests/ServerEndpoints.js'
import { FinalShelf } from '../Classes/FinalShelf';

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
  //const { isSigned, setIsSigned } = useContext(IsSignedContext);
  //const [pageLength, setPageLength] = useState(3);
  const [pageLength, setPageLength] = useState(initialPageLength);
  const [hasMoreShelfs, setHasMoreShelfs] = useState(false); //At start, there are no shelfs, thus we have no more shelfs

  const [finalShelfs, setFinalShelfs] = useState( new FinalShelf())
  
  
  
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

  // This is the finalShelf
  // PageOfShelfs = finalShelfs = [ shelf, shelf, shelf ]
  // shelf =[ vid, vid, vid, vid ]
  // vid = { id, snippet: {}, contentDetails: {} }

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

  function injectData(isActs, shelfstuff) {
    let injectShelfTitle = user.customShelfs.slice(prevPage, pageLength).map((sh, idx) => {
      return {"videos": shelfstuff[idx], "title":sh.title}
    })

    let postxd = { isActs, shelfs: injectShelfTitle }
    return postxd

  } 
  
  async function hackHelper() {
  let count = 1
  let logged = false
    while (logged = !GApiAuth.isHeSignedIn()) {
      console.log("Hack Helper: GoogleAuth NOT exist: " + count)
      console.log('Hack Helper: Logged in?: ' + logged)
      await Common.sleep(100*count) 
      count = count + 1      
      if (count > 40) {
        count = count * 2
        console.log("Hack Helper: Something went wrong :(  " + count)
      }
    }
  }


  async function _fetch1stHalf() {

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
    const fetchThisManyVideosPerShelf = 20 //Arbitrary number
    shelfsActs = shelfsActs.map(sh => sh.slice(0,fetchThisManyVideosPerShelf))    

    return shelfsActs
  }
  
  async function _fetch2ndHalf(shelfsActs) {
    // Returns an array of video's ID per shelf
    let shelfsVidIds = await shelfsActs.map( sh => ytLogic.extractIds(sh))

    // Returns an array of video objects(yt) per shelf
    let shelfVids = await ytLogic.requestVideosShelf(shelfsVidIds)

    //Returns only "OK" status and then http results
    shelfVids = shelfVids.filter(sh => sh.status > 199 || sh.status < 300).map( sh => sh.result.items)       
    shelfVids = shelfVids.map( shelf => ytLogic.sortByDate(shelf))
    return shelfVids
  }
  

  function beginFilter(iData) {
  //iData = {isActs, shelfsSliced [] }
    
    //apply the user's filter on the subscriber
    //Match iData.shelfs with user.customShelfs
    //TODO, should be an easier, readable way to do this.
    let userShelfs = user.customShelfs.slice(prevPage,pageLength) //Use slice for tricks & improvment
    console.log('\n\n\n\n userShelfs')
    console.log(userShelfs)
    for (let uSh of userShelfs) {     
      //Get a shelf-of-videos fr
      console.log('uSh')
      console.log(uSh)
      //Get the vids for shelf uSh
      let unfiltVids = iData.shelfs.filter( iSh => iSh.title == uSh.title) // TODO // NEED AN ID! (I think) Or perhap require titles to be unique??
      console.log(' unfiltVids')
      console.log(unfiltVids)
      //compare each vid with the user's filter (compare with each sub in fewSubs)
      for (let vid of unfiltVids[0].videos) {
        
        // Recall:
        //      sub = { youtubeObj }
        //      uSh = { fewSubs: [sub, sub, sub], title: "shelfx", isSorted }
        //      sub = { filter{}, channelTitle, channelId }
        let dankFilter = uSh.fewSubs.filter( sub => sub.channelId == vid.snippet.channelId)
        console.log('dankFilter')
        console.log(dankFilter[0].channelId)
        console.log(vid.snippet.channelId)
        // remove the video if passes filter.
        // else keep it.
        //applyFilter() 
      }
      
    }


  }

  function isEndReached() {
    let isEnd = false;
    if (spamCount > spamLimit || pageLength > user.customShelfs.length) {
      console.log('\n\n\n\nbro you reached the limit\n\n\n')

      console.log("LOAD SHELF")
      console.log(pageLength)
      console.log('user.customShelfs.length')
      console.log(user.customShelfs.length)
      isEnd = true
    }
    return isEnd
  }

  const fetchMoreSubs = async (isFirstRun) => {
    console.log("INSIDE OF FILTER UPLOADS")
    console.log(isFirstRun)
    if (isFirstRun) { await putUnsortedShelfAtBottom() }
    console.log('user post w/e')
    console.log(user)

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

    let shelfsActs = await _fetch1stHalf()
    let iData = injectData(true, shelfsActs)

    console.log('iData - Activities')
    console.log(iData)
    
    /*
    setFinalShelfs(prevShs => {
      let newS = { ...prevShs }
      prevPage != 0 ? newS.shelfs.push(...iData.shelfs) : newS = iData
      newS.isActs = true
      return newS
    })
    */
    
    let shelfVids = await _fetch2ndHalf(shelfsActs)
    iData = injectData(false, shelfVids)

    beginFilter(iData)

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
        if (prevPage == 0) {
          for (let i = 0; i < pageLength; i++) {
            newS.shelfs[prevPage + i] = iData.shelfs[i]
          }
        } else {
            if (newS.shelfs[prevPage ]) {
              newS.shelfs[prevPage ] =  iData.shelfs[0]
            } else { 
              console.log("I Think we doing this")
              console.log(newS.shelfs.length + " newS.shelfs.length")
              newS.shelfs.push(iData.shelfs[0])
            }
        }
        newS.isActs = false
        return newS
      })
    
    //filterUploadsForUser(iData)
    //ytLogic.saveToLocal(iData)  

    /// increment ect.
    setPageLength( pageLength + 1)
    spamCount = spamCount + 1;
    setHasMoreShelfs(true) //We now have shelfs to be rendered
  }
    
  
    
    
  return(
    <div>
     
    <InfiniteScroll
        loadMore={fetchMoreSubs}
        hasMore={hasMoreShelfs}
        loader={(<div>Loading ...</div>)}
      >
        <ShelfsMany isActs={finalShelfs.isActs} shelfs={finalShelfs.shelfs.slice(0, pageLength)} /> 
     </InfiniteScroll>
      
      <h1>Youtube</h1>
        <div>Note, the app must ALWAYS do loadClient before any API call</div>
        <ButtonsAuthDebug />
      
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


