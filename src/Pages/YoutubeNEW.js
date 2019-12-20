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

//UseState and accessing it before api is recieved https://stackoverflow.com/questions/49101122/cant-access-objects-properties-within-object-in-react
// react infinite scroll https://github.com/CassetteRocks/react-infinite-scroller#readme
// simpe react pagation https://codepen.io/grantdotlocal/pen/zReNgE
export function YoutubeNEW() {

//  var GoogleAuth;

  const { user, setUser }         = useContext(UserContext);
  //const { isSigned, setIsSigned } = useContext(IsSignedContext);
  //const [pageLength, setPageLength] = useState(3);
  const [pageLength, setPageLength] = useState(3);
  const [hasMoreShelfs, setHasMoreShelfs] = useState(false); //At start, there are no shelfs, thus we have no more shelfs

  const [finalShelfs, setFinalShelfs] = useState(
    {
      isActs: false,
      shelfs: [
        {
          title: '',
          videos:
            [
              {
                contentDetails: {},
                snippet: {
                  thumbnails: {
                    default: {},
                    medium: {},
                    high: {},
                    standard: {},
                    maxres: {},
                  }
                },
                statistics: {},
              }
            ]
        }
      ]
    }
  )
  
  
  
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
  
  {
    /*
    let sub1 = new Subscription()
    sub1.channelName = "The Hill"
    sub1.channelId = "UCPWXiRWZ29zrxPFIQT7eHSA";
  
    let sub2 = new Subscription()
    sub2.channelName = "Crunkmastaflexx"
    sub2.channelId = "UCA-8h5uCH5RE-1r6gskkbTw";
  
    let sub3 = new Subscription()
    sub3.channelName = "Deep Beat"
    sub3.channelId = "UC0CeYMTh57zSsbUKhsyOPfw";
  
    let sub4 = new Subscription()
    sub4.channelName = "Video Box"
    sub4.channelId = "UCeMFHOzX9MDWbr-pu2WdmVw";
  
    let sub5 = new Subscription()
    sub5.channelName = "mineralblue"
    sub5.channelId = "UC3IngBBUGFUduHp-7haK1lw";
  
    let sub6 = new Subscription()
    sub6.channelName = "SMTOWN"
    sub6.channelId = "UCEf_Bc-KVd7onSeifS3py9g";
  
    let sshelf1 = new CustomShelf()
    let shelf1 = new UserShelf()
    shelf1.title = "Politics"
    shelf1.subscriptions.push(sub1)
    shelf1.subscriptions.push(sub2)
    shelf1.subscriptions.push(sub3)
  
    let shelf2 = new UserShelf();
    shelf2.title = "Babes"
    shelf2.subscriptions.push(sub4)
    shelf2.subscriptions.push(sub5)
  
    let shelf3 = new UserShelf();
    shelf3.title = "k-pop"
    shelf3.subscriptions.push(sub6)
    
    
    const [shelfs, setShelfs] = useState([
      {
        subscriptions: shelf1.subscriptions,
        //mockUser.customShelfs.fewSubs
        title: shelf1.title,
      },
      {
        subscriptions: shelf2.subscriptions,
        title: shelf2.title,
      }
    ] );
    */
  }
  
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
        setHasMoreShelfs(true)
        //loadShelf2()
        //let shelfVids = fetchActs_perShelf()

      }
    }
    console.log('---------------useEffect bot----------------------')
  }, [user])
    
  
  async function hackHelper() {
  console.log('vvvvvvv HACK HELPER  vvvvvvvv')
  let count = 1
  let logged = false
    while (logged = !GApiAuth.isHeSignedIn()) { //|| !user.id) {
      console.log("Hack Helper: GoogleAuth NOT exist: " + count)
      console.log('Hack Helper: Logged in?: ' + logged)
      await Common.sleep(100*count) 
      count = count + 1      
      if (count > 40) {
        count = count * 2
        console.log("Hack Helper: Something went wrong :(  " + count)
      }
    }
    console.log("Hack Helper: GoogleAuth !!! exist")
    console.log(GApiAuth.isHeSignedIn())
    console.log('^^^^^^^^^^^^^^^^^^^^^^^^^')
  }

  var prevPage = 0
  const fetchActs_perShelf = async () => {
    console.log(" xxxxXXXXxxxx fetchActs_perShelfs xxxxXXXXxxxx")
    let shelfsActs = null;
    await hackHelper()

    // Returns array of Shelfs, each shelf is an array of subscription. Each sub is an array of activities
    // Kinda like: shelf[x].subscription[y].activity[z] 
    console.log('user')
    console.log(user)
    
    //shelfsActs = await ytLogic.getActivitiesShelfs(user.customShelfs)
    shelfsActs = await ytLogic.getActivitiesShelfs(user.customShelfs.slice(prevPage, pageLength))
    console.log('shelfsActs')
    console.log(shelfsActs)


    // Returns only Uploads of the activities
    shelfsActs = await ytLogic.removeNonVideos(shelfsActs)
    
    // Returns all the activies in a single array (shelf), instead array of activities in n different sub
    // Kinda like: shelf[x].Activity[z]
    shelfsActs = await shelfsActs.map( shelf => ytLogic.flattenShelf(shelf))
    shelfsActs = await shelfsActs.map( shelf => ytLogic.sortByDate(shelf))

     console.log('shelfsActs after remNonVids + flat + sort ')
     console.log(shelfsActs)
    //Render the info that we got, the 2nd half comes after this
    shelfsActs = shelfsActs.map(sh => sh.slice(0,20))    
     console.log('shelfsActs after slice')
     console.log(shelfsActs)
    let injectShelfTitle = user.customShelfs.slice(prevPage,pageLength).map((sh, idx) => {
      return {"videos": shelfsActs[idx], "title":sh.title}
    })
    console.log('injectShelfTitle')
    console.log(injectShelfTitle)
    setFinalShelfs({ isActs: true, shelfs: injectShelfTitle })
    setHasMoreShelfs(true)
    /*
    // Returns an array of video's ID per shelf
    let shelfsVidIds = await shelfsActs.map( sh => ytLogic.extractIds(sh))

    // Returns an array of video objects(yt) per shelf
    let shelfVids = await ytLogic.requestVideosShelf(shelfsVidIds)

    //Returns only "OK" status and then http results
    shelfVids = shelfVids.filter(sh => sh.status > 199 || sh.status < 300).map( sh => sh.result.items)       
    shelfVids = shelfVids.map( shelf => ytLogic.sortByDate(shelf))
        
    console.log("\n \n WE ARE SETTING \n \n")
    console.log("_____-------WE FINISHED THE FILTER!-------_______")
    
        
    let lifehack2 = user.customShelfs.map((sh, idx) => {
      return {"videos": shelfVids[idx], "title":sh.title}
    })


    let postxd = { isActs: false, shelfs: lifehack2 }
    prevPage = pageLength
    console.log(' postxd')
    console.log(postxd)
    setFinalShelfs(postxd)
    */
    setHasMoreShelfs(true) //We now have shelfs to be rendered
    setPageLength( pageLength + 1)
    console.log("LOAD SHELF")
    console.log("LOAD SHELF")
    console.log("LOAD SHELF")
    console.log("LOAD SHELF")
    console.log("LOAD SHELF")
    console.log("LOAD SHELF")
    console.log(pageLength)
    console.log(pageLength)

    if (pageLength >= user.customShelfs.length - 1 ) {  // 3 == 0
      console.log("\n\n\n\nPAGE LENGTH REACHED!!!!!\n\n")
      console.log(user.customShelfs.length)
      console.log(pageLength)
      setHasMoreShelfs(false)
    }

    
  //ytLogic.saveToLocal(shelfVids)
  //  return shelfVids;
  }
  
  
  
  function loadShelf() {
    setPageLength( pageLength + 1)
    console.log("LOAD SHELF")
    console.log(pageLength)
    if (pageLength >= finalShelfs.shelfs.length) {  // 3 == 0
      console.log("PAGE LENGTH REACHED!!!!!")
      console.log(finalShelfs.length)
      console.log(pageLength)
      setHasMoreShelfs(false)
    }
  }
  
  async function loadShelf2() {
    console.log('loadShelf2')
    let dankAct
    let aShelf = user.customShelfs[pageLength]

    dankAct = await ytLogic.getActivitiesShelfs([user.customShelfs[pageLength]])
    dankAct = await ytLogic.removeNonVideos(dankAct)
    dankAct = await dankAct.map( shelf => ytLogic.flattenShelf(shelf))
    dankAct = await dankAct.map( shelf => ytLogic.sortByDate(shelf))

    dankAct = dankAct[0].slice(0,20)

    let dankInject = { "videos": dankAct, "title": user.customShelfs[pageLength].title }
    setFinalShelfs(prev => {
      let newS = { ...prev }
      prev.shelfs[0].videos[0].snippet.publishedAt ? newS.shelfs.push(dankInject) : newS.shelfs[0] = dankInject
      newS.isActs = true
      return newS
    })
    
    /*

    let dankVidIds = dankAct.map( sh => ytLogic.extractIds(sh))
    console.log('dankVidIds')
    console.log(dankVidIds)
    console.time('dank vids')
    let dankVids = await ytLogic.requestVideosShelf(dankVidIds)
    console.timeEnd('dank vids')
    console.log('dankVids')
    console.log(dankVids)
    dankVids = dankVids.filter(sh => sh.status > 199 || sh.status < 300).map( sh => sh.result.items)       
    dankVids = dankVids.map( shelf => ytLogic.sortByDate(shelf))
    console.log('dankVids')    
    console.log(dankVids)    
    
     dankInject = { "videos": dankVids, "title": user.customShelfs[pageLength].title }
    setFinalShelfs(prev => {
      let newS = { ...prev }
      //Checks if 1st entry or not. Does logic to check if 1st "finalShelfs" has a real entry.
      //props.video.statistics.viewCount
      newS.shelfs[pageLength] = dankInject
      newS.isActs = false
      console.log('sneaky prev')
      console.log(newS)
      return newS
    })
    */
    setPageLength( pageLength + 1)
  //  setHasMoreShelfs(true)
    
  console.log( '+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-')
  console.log( 'user.customShelfs.length')
  console.log( user.customShelfs.length)
  console.log('pageLength')
  console.log(pageLength)
    if (pageLength >= user.customShelfs.length -1 ) {  
      console.log("PAGE LENGTH REACHED!!!!!")
      console.log(finalShelfs.length)
      console.log(pageLength)
      setHasMoreShelfs(false)
    }

  }

  return(
    <div>
     {/* 
      <InfiniteScroll
        loadMore={loadShelf}
        hasMore={hasMoreShelfs}
        loader={(<div>Loading ...</div>)}
      >
        <ShelfsMany isActs={finalShelfs.isActs} shelfs={finalShelfs.shelfs.slice(0, pageLength)} /> 
     </InfiniteScroll>
     
    <InfiniteScroll
        loadMore={loadShelf2}
        hasMore={hasMoreShelfs}
        loader={(<div>Loading ...</div>)}
        threshold={0}
      >
        <ShelfsMany isActs={finalShelfs.isActs} shelfs={finalShelfs.shelfs.slice(0, pageLength)} /> 
     </InfiniteScroll>
     */} 
     
    <InfiniteScroll
        loadMore={fetchActs_perShelf}
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


