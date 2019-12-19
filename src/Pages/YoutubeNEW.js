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

  var GoogleAuth;

  const { user, setUser }         = useContext(UserContext);
  const { isSigned, setIsSigned } = useContext(IsSignedContext);
  const [pageLength, setPageLength] = useState(3);
  const [hasMoreShelfs, setHasMoreShelfs] = useState(false); //At start, there are no shelfs, thus we have mo more shelfs
  const [activitiesShelf, setActivitiesShelf] = useState(
    [
      [{
        contentDetails: {upload: {} },
        snippet: {
          channelId: '',
          channelTitle: '',
          description: '',
          publishedAt: '',
          thumbnails: {},
          title: '',
          type: '',
        }
    }]
  ]
  )
  const [finalShelfs, setFinalShelfs] = useState(
  [
    [{
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
      }]
  ]
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
      let shelfVids = fetchActs_perShelf()
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

  const fetchActs_perShelf = async () => {
    console.log(" xxxxXXXXxxxx fetchActs_perShelfs xxxxXXXXxxxx")
    let shelfsActs = null;
    await hackHelper()

    // Returns array of Shelfs, each shelf is an array of subscription. Each sub is an array of activities
    // Kinda like: shelf[x].subscription[y].activity[z] 
    //shelfsActs = await ytLogic.getActivitiesShelfs(shelfs)
    console.log('user')
    console.log(user)
    
    shelfsActs = await ytLogic.getActivitiesShelfs(user.customShelfs)
    
//    console.log("1")
 //   console.log(shelfsActs)
    // Returns only Uploads of the activities
    shelfsActs = await ytLogic.removeNonVideos(shelfsActs)
    
    console.log("2")
    console.log(shelfsActs)
    // Returns all the activies in a single array (shelf), instead array of activities in n different sub
    // Kinda like: shelf[x].Activity[z]
    shelfsActs = await shelfsActs.map( shelf => ytLogic.flattenShelf(shelf))
    shelfsActs = await shelfsActs.map( shelf => ytLogic.sortByDate(shelf))
    
    console.log("3")
    console.log(shelfsActs)
    setActivitiesShelf( shelfsActs )
    // Returns an array of video's ID per shelf
    let shelfsVidIds = await shelfsActs.map( sh => ytLogic.extractIds(sh))
    
    console.log("4")
    console.log(shelfsVidIds)
    // Returns an array of video objects(yt) per shelf
    let shelfVids = await ytLogic.requestVideosShelf(shelfsVidIds)
        
    console.log("5")
    console.log(shelfVids)
    //Returns only "OK" status and then http results
    shelfVids = shelfVids.filter(sh => sh.status > 199 || sh.status < 300).map( sh => sh.result.items)       
    shelfVids = shelfVids.map( shelf => ytLogic.sortByDate(shelf))

    console.log("6")
    console.log(shelfVids)

    console.log("\n \n WE ARE SETTING \n \n")
    console.log("_____-------WE FINISHED THE FILTER!-------_______")
    console.log('shelfVids')
    console.log(shelfVids)

    setFinalShelfs(shelfVids)
    setHasMoreShelfs(true) //We no have shelfs
    
    return shelfVids;
  }
  
  
  
  function loadShelf() {
    setPageLength( pageLength + 1)
    if (pageLength >= finalShelfs.length) {  // 3 == 0
      console.log("PAGE LENGTH REACHED!!!!!")
      console.log(finalShelfs.length)
      console.log(pageLength)
      setHasMoreShelfs(false)
    }
  }

  return(
    <div>
      <InfiniteScroll
        loadMore={loadShelf}
        hasMore={hasMoreShelfs}
        loader={(<div>Loading ...</div>)}
      >
        <ShelfsMany shelfs={finalShelfs.slice(0, pageLength)} /> 
     </InfiniteScroll>
    {/*<ShelfsMany2 shelfs={activitiesShelf} />*/}
      
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


