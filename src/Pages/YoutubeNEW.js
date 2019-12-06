import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

import { Link } from "react-router-dom";
import axios from 'axios';
import { SECRET_KEYS } from '../api-key';
import * as Common from './Common.js';
import { SubscriptionActivitys } from '../Classes/SubscriptionActivitys';
import * as videoJ from '../Scratch/api_video.json';
import * as moment from 'moment';
import * as youtubeApi from "./youtubeApi";
import { UserShelf } from '../Classes/UserShelf';
import { Filter } from '../Classes/Filter';
import { Subscription } from '../Classes/Subscription';
import { Shelf } from '../Components/Shelf';
import { Video } from '../Components/Video';
import { ShelfsMany } from '../Components/ShelfsMany';
import { ChannelForm } from '../Components/ChannelForm';
import { VideoShelf } from '../Components/VideoShelf';
import { ButtonsAuthDebug } from '../Components/ButtonsAuthDebug';
import  * as GApiAuth from '../HttpRequests/GApiAuth';

import * as ytLogic from '../BusinessLogic/ytLogic.js'


//UseState and accessing it before api is recieved https://stackoverflow.com/questions/49101122/cant-access-objects-properties-within-object-in-react
export function YoutubeNEW() {

  var GoogleAuth;
  
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

  
  const [isSigned, setIsSigned] = useState(false)

  // This is the finalShelf
  // PageOfShelfs = finalShelfs = [ shelf, shelf, shelf ]
  // shelf =[ vid, vid, vid, vid ]
  // vid = { id, snippet: {}, contentDetails: {} }
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
  const [shelfs, setShelfs] = useState([
    {
      subscriptions: shelf1.subscriptions,
      title: shelf1.title,
    },
    {
      subscriptions: shelf2.subscriptions,
      title: shelf2.title,
    }
  ] );
  
  const [count, setCount] = useState(0)
  function handleButtonClick() {
    setCount(count + 1 )
  }
   let ass2 = 50+1*2


  ///////////////////////////////////////////////
  /*
    console.log('---------------useEffect1----------------------')
    console.log("\n\n\n\nHELLO YOU SHOULD ONLY SEE ME ONCE!!!!!!!!!!!!!!!!!!\n\n\n\n")
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://apis.google.com/js/client.js";
    script.async = true
    document.body.appendChild(script)
    script.onload = () => {
      initShit()
    }
    let shelfVids = fetchActs_perShelf()
    console.log('---------------useEffect2----------------------')
    */

  useEffect( () => {
  
    setCount(ass2)
    console.log('---------------useEffect1----------------------')
    console.log("\n\n\n\nHELLO YOU SHOULD ONLY SEE ME ONCE!!!!!!!!!!!!!!!!!!\n\n\n\n")
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://apis.google.com/js/client.js";
    script.async = true
    document.body.appendChild(script)
    script.onload = () => {
      initShit()
    }
    let shelfVids = fetchActs_perShelf()
    console.log('---------------useEffect2----------------------')
  }, [])
  
  async function hackHelper() {
  console.log('vvvvvvv HACK HELPER  vvvvvvvv')
  let count = 1
    while (!GoogleAuth) {
      console.log("Hack Helper: GoogleAuth NOT exist: " + count)
      await Common.sleep(100*count) 
      if (count > 40) {
        count = count * 2
        console.log("Hack Helper: We are initing again " + count)
        initShit()
      }
      count = count + 1
    }
    console.log("Hack Helper: GoogleAuth !!! exist")
    console.log('^^^^^^^^^^^^^^^^^^^^^^^^^')
  }


  async function initShit() {
      var googleAuthPromise = await GApiAuth.initGoogleAPI()  // Usually 500ms

      GoogleAuth = await googleAuthPromise // Usually 1ms
  }

  const fetchActs_perShelf = async () => {
    console.log(" xxxxXXXXxxxx fetchActs_perShelfs xxxxXXXXxxxx")
    let shelfsActs = null;
    await hackHelper()
    
    // Returns array of Shelfs, each shelf is an array of subscription. Each sub is an array of activities
    // Kinda like: shelf[x].subscription[y].activity[z] 
    shelfsActs = await ytLogic.getActivitiesShelfs(shelfs)
    
    // Returns only Uploads of the activities
    shelfsActs = await ytLogic.removeNonVideos(shelfsActs)

    // Returns all the activies in a single array (shelf), instead array of activities in n different sub
    // Kinda like: shelf[x].Activity[z]
    shelfsActs = await shelfsActs.map( shelf => ytLogic.flattenShelf(shelf))
    shelfsActs = await shelfsActs.map( shelf => ytLogic.sortByDate(shelf))
    
    // Returns an array of video's ID per shelf
    let shelfsVidIds = await shelfsActs.map( sh => ytLogic.extractIds(sh))
    
    // Returns an array of video objects(yt) per shelf
    let shelfVids = await ytLogic.getVideosShelf(shelfsVidIds)
        
    //Returns only "OK" status and then http results
    shelfVids = shelfVids.filter(sh => sh.statusText == "OK").map( sh => sh.result.items)       
    shelfVids = shelfVids.map( shelf => ytLogic.sortByDate(shelf))

    console.log("\n \n WE ARE SETTING \n \n")
    console.log("_____-------WE FINISHED THE FILTER!-------_______")
    console.log('shelfVids')
    console.log(shelfVids)

    setFinalShelfs(shelfVids)

    
    return shelfVids;
  }

  return(
  

    <div>
      <ShelfsMany shelfs={finalShelfs} />
      
      <div> count incremented {count} times </div>
      <button onClick={handleButtonClick}>
      click me 
      </button>
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
      
      <VideoShelf videoList={videoJ.items}/>
      <Video video={videoJ.items[0]} />
        

    </div>
    );
}


