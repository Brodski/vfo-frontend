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
    
    //console.log(JSON.stringify(mockUser, null, 2))
    //console.log(mockUser)
    console.log('---------------useEffect top ----------------------')
    console.log(user)
    if (user.userId) { 
      //if (ytLogic.hasUsedRecently()) {
    
      if (false) {
          console.log("USED RECNETLY!!!")
          console.log("getting fomr local")

          let shelfsVids = ytLogic.getStorageShelfs()
          console.log('shelfsVids')
          console.log(shelfsVids)
          setFinalShelfs(shelfsVids)
          setHasMoreShelfs(true) //We know have shelfs to be rendered
      } else {
        console.log("NOT used !!!!!")
        console.log("doing fetch to google")
        fetchMoreSubs()
        //loadShelf2()
        //let shelfVids = fetchActs_perShelf()

      }
    }
    console.log('---------------useEffect bot----------------------')
  }, [user])
   
  function injectData(isActs, shelfstuff) {
    let injectShelfTitle = user.customShelfs.slice(prevPage, pageLength).map((sh, idx) => {
      return {"videos": shelfstuff[idx], "title":sh.title}
    })

    let postxd = { isActs, shelfs: injectShelfTitle }
    return postxd

  } 
  
  async function hackHelper() {
//  console.log('vvvvvvv HACK HELPER  vvvvvvvv')
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
  //  console.log("Hack Helper: GoogleAuth !!! exist")
 //   console.log(GApiAuth.isHeSignedIn())
//    console.log('^^^^^^^^^^^^^^^^^^^^^^^^^')
  }


  async function _fetchHalf() {

    // Returns array of Shelfs, each shelf is an array of subscription. Each sub is an array of activities
    // Kinda like: shelf[x].subscription[y].activity[z] 
    
    let shelfsActs = await ytLogic.getActivitiesShelfs(user.customShelfs.slice(prevPage, pageLength))
    


    // Returns only Uploads of the activities
    shelfsActs = await ytLogic.removeNonVideos(shelfsActs)
    
    // Returns all the activies in a single array (shelf), instead array of activities in n different sub
    // Kinda like: shelf[x].Activity[z]
    shelfsActs = await shelfsActs.map( shelf => ytLogic.flattenShelf(shelf))
    shelfsActs = await shelfsActs.map( shelf => ytLogic.sortByDate(shelf))

    //Render the info that we got, the 2nd half comes after this
    shelfsActs = shelfsActs.map(sh => sh.slice(0,20))    

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
  

  function filterUploadsForUser(finalSh) {//
    //finalSh.shelfs[i].videos[i].snippet.channelTitle = "google"
    

  }

  function isEndReached() {
    let isEnd = false;
    if (spamCount > spamLimit || pageLength > user.customShelfs.length) {
      console.log('\n\n\n\nbro you reached the spam limit\n\n\n')

      console.log("LOAD SHELF")
      console.log(pageLength)
      console.log('user.customShelfs.length')
      console.log(user.customShelfs.length)
      isEnd = true
    }
    return isEnd
  }

  const fetchMoreSubs = async () => {
    setHasMoreShelfs(false) //instantly halt any possible room for multi fetches
    prevPage = pageLength == initialPageLength ? 0 : pageLength - 1 //PrevPage = 0 for initial load & prevPage = pageLength - 1 then after
    console.log(" xxxxXXXXxxxx fetchMoreSubs xxxxXXXXxxxx")
    
    console.log("\n\n TOP setting pages: ")
    console.log("prevPage: " + prevPage)
    console.log("pageLength: " + pageLength)
    

    await hackHelper()
    if ( isEndReached()) {
      Common.sleep(5000)
      return
    }

    let shelfsActs = await _fetchHalf()
    let iData = injectData(true, shelfsActs)
   //let iData
    console.log('iData')
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

    console.log("_____-------WE FINISHED THE FILTER!-------_______")
    console.log("_____ {prevPage, pageLength} " + {prevPage, pageLength} )
    console.log('finalShelfs')
    console.log(finalShelfs)
    console.log('iData')
    console.log(iData)
    /*
    let shitty = finalShelfs
    if (prevPage == 0) {
      for (let i = 0; i < pageLength; i++) {
        shitty.shelfs[prevPage + i] = iData.shelfs[i]
      }
    } else {
      console.log('shitty.shelfs')
      console.log(shitty.shelfs)
      if (shitty.shelfs[prevPage ]) {
        console.log("YEAH THIS SHIT IS HERE")
        shitty.shelfs[prevPage ] =  iData.shelfs[0]
      } else {
        console.log("NO ITS NOT")
        shitty.shelfs.push(iData.shelfs[0])
      }
      shitty.isActs = true
      console.log('shitty')
      console.log(shitty)
    }
    */

      setFinalShelfs(prevShs => {
        let newS = { ...prevShs }
        if (prevPage == 0) {
          for (let i = 0; i < pageLength; i++) {
            newS.shelfs[prevPage + i] = iData.shelfs[i]
          }
        } else {
            if (newS.shelfs[prevPage ]) {
              console.log("YEAH THIS SHIT IS HERE")
              newS.shelfs[prevPage ] =  iData.shelfs[0]
            } else {
              console.log("NO ITS NOT")
              newS.shelfs.push(iData.shelfs[0])
            }
        }
        newS.isActs = false
        return newS
      })
    
    //filterUploadsForUser(iData)
    //ytLogic.saveToLocal(iData)  
    //prevPage = pageLength
    setPageLength( pageLength + 1)
    
    console.log("\n\n BOTTOM setting pages: ")
    console.log("prevPage: " + prevPage)
    console.log("pageLength: " + pageLength)

    spamCount = spamCount + 1;
    if (pageLength > user.customShelfs.length) {  // 3 == 0
      console.log("\n\n\n\nPAGE LENGTH REACHED!!!!!\n\n")
      console.log(user.customShelfs.length)
      console.log(pageLength)
      setHasMoreShelfs(false)
    } else {
      setHasMoreShelfs(true) //We now have shelfs to be rendered
    }

  //  return shelfVids;
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


