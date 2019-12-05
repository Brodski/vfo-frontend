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
import  * as GApiAuth from '../HttpRequests/GApiAuth';

import * as ytLogic from '../BusinessLogic/ytLogic.js'


//UseState and accessing it before api is recieved https://stackoverflow.com/questions/49101122/cant-access-objects-properties-within-object-in-react
export function YoutubeNEW() {

  var GoogleAuth;
  var SuckIt =[]
  
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
  // PageOfShelfs = filteredShefls = [ shelf, shelf, shelf ]
  // shelf =[ vid, vid, vid, vid ]
  // vid = { id, snippet: {}, contentDetails: {} }
  const [filteredShelfs, setFilteredShelfs] = useState(
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

   let ass = 50
   let ass2 = 50+1*2
  let emptyVid = {
    contentDetails: {},
    snippet: {channelTitle: ""}
                  }


  ///////////////////////////////////////////////

    /*
    console.log("HELLO YOU SHOULD ONLY SEE ME ONCE!!!!!!!!!!!!!!!!!!")
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://apis.google.com/js/client.js";
    script.async = true
    document.body.appendChild(script)
    script.onload = () => {
      var googleAuthPromise = GApiAuth.initGoogleAPI() //apiHelper()
      apiHelper(googleAuthPromise)
      console.log('googleAuthPromise is : ' + googleAuthPromise)
      //setTimeout(function () { console.log("TIMEOUT!!!!!!!!"); console.log(wtf) }, 1000)
      }
      */

  async function apiHelper(promise) {
    console.log('-- APIHPER TOP ---- APIHPER TOP ---- APIHPER TOP ---- APIHPER TOP --')
    GoogleAuth = await promise
    console.log('apiHelper: GoogleAuth.isSignedIn.get() ' + GoogleAuth.isSignedIn.get())
    console.log('apiHelper: isSigned? ' + isSigned) 
  }

  async function hackHelper() {
  console.log('vvvvvvvvvvvvvvvvvvvvvvv')
    while (!GoogleAuth) {
      console.log("Hack Helper: GoogleAuth NOT exist")
      await GApiAuth.sleep(100) //sleep 10 ms
    }
    console.log("Hack Helper: GoogleAuth !!! exist")
    console.log('^^^^^^^^^^^^^^^^^^^^^^^^^')
  }

  useEffect( () => {
  
    setCount(ass2)
    //setFilteredShelfs([emptyVid])
    console.log('count count count count ')
    console.log(count)
    console.log('---------------useEffect1----------------------')
    console.log("HELLO YOU SHOULD ONLY SEE ME ONCE!!!!!!!!!!!!!!!!!!")
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://apis.google.com/js/client.js";
    script.async = true
    document.body.appendChild(script)
    script.onload = () => {
      var googleAuthPromise = GApiAuth.initGoogleAPI() //apiHelper()
      apiHelper(googleAuthPromise)
      console.log('googleAuthPromise is : ' + googleAuthPromise)
    }
    var idk2 = fetchActs_perShelf()
    console.log('idk2 idk2idk2 idk2idk2 idk2 v ')
//    setFilteredShelfs(["abcc", '12344'])
    console.log('---------------useEffect2----------------------')

      //setTimeout( () => console.log(filteredShelfs),5000)
  }, [])
  

  const fetchActs_perShelf = async () => {
    console.log("fetchActs_perShelfs")
    console.log("Entering hack helper")
    await hackHelper()
    console.log("exiting hack helper")
    let allShelfs_Promises =[]
    
    for (let sh of shelfs) {
      const sh_Promises = sh.subscriptions.map(sub => youtubeApi._getActivities(sub.channelId))
      allShelfs_Promises.push(sh_Promises)
    }
    let shelfsActs =  await Promise.all( allShelfs_Promises.map( shProm => Promise.all(shProm)) )  //https://stackoverflow.com/questions/36094865/how-to-do-promise-all-for-array-of-array-of-promises
    //let shelfsActs
    
    shelfsActs = await ytLogic.removeNonVideos(shelfsActs)
    console.log('shelfsActs xxx')
    console.log(shelfsActs)
    let shelfsActs2 = await shelfsActs.map( shelf => ytLogic.flattenShelf(shelf))
    console.log('shelfsActs2')
    console.log(shelfsActs2)
    shelfsActs2 = shelfsActs2.map( shelf => ytLogic.sortByDate(shelf))
    
    let shelfsVidIds = await ytLogic.extractIds(shelfsActs2)
    console.log('vidIds')
    console.log(shelfsVidIds.length)
    console.log(shelfsVidIds)

    const vidIdShelf_Promise = shelfsVidIds.map(sh => {
      console.log('sh PROMISE')
      console.log(sh)
      return youtubeApi.getSomeVideos(sh.slice(0, 20))
    })

    let shelfVids = await Promise.all(vidIdShelf_Promise)
    
    console.time("are we wasting")
    shelfVids = shelfVids.filter(sh => sh.statusText == "OK").map( sh => sh.result.items)       //remove all that didnt return "OK", get results
    console.timeEnd("are we wasting")

    console.log('AFTER shelfVids')
    console.log(shelfVids)
    shelfVids = shelfVids.map( shelf => ytLogic.sortByDate(shelf))


    // get Videos for each act
    //
    //

    console.log("_____-------WE FINISHED THE FILTER!-------_______")
    console.log('shelfVids')
    console.log(shelfVids)
    //console.log(shelfsActs[0][0][0].contentDetails.upload.videoId)
    //setFilteredShelfs( eachShelfsActs[0][0][0].contentDetails.upload.videoId)
    //setFilteredShelfs(shelfVids)
    console.log("\n \n WE ARE SETTING \n \n")
    for (let shelf of shelfVids) {
      console.log("vid.snippet")
      for (let vid of shelf) {

        if (!vid.snippet) {
          console.log('\n WHAT WHAT \n WHAT WHAT \n \n \n')
        }
      }
    }
    setFilteredShelfs(shelfVids)

    
    return shelfVids;
  }



 const RenderShit = () => {
  let idk = filteredShelfs.toString()
  //let idk2 = filteredShelfs.map(shelf => {
  //    return (<Shelf shelf={shelf}/> )
//    })
  let shit = (
      <div>12313122312312
        
        {shelfs.map(sh => {
        return (<li> {sh.title} </li>)
      })}
      </div>
    )
    return shit
    //ReactDOM.render( shit, document.getElementById('doItHere'));
  }
  

  
  //{filteredShelfs.map( shelf => {
    //    return (<Shelf shelf={shelf}/> )
      //})

  return(
  

    <div>
      <ShelfsMany shelfs={filteredShelfs} />
      
      <div> count incremented {count} times </div>
      <button onClick={handleButtonClick}>
      click me 
      </button>
      <h1>Youtube</h1>
        <div>Note, the app must ALWAYS do loadClient before any API call</div>
      <h3>Common</h3>
        <button onClick={Common.authenticate}>authorize </button>
        <button onClick={Common.signOut} > Log Out </button>
        <button onClick={Common.getAuthCodeForServerSideShit} >Auth Code For Server</button>

      <div></div>
        <button onClick={GApiAuth.isHeSignedIn}> isHeSignedIn</button>
        <button onClick={Common.printShit}> print shit</button>

      <div></div>      
        <button onClick={Common.testAuthcode} > get your logged in profile </button>
        <button onClick={Common.testWithXML} > "Ping" server with xml </button>
      
      <h3> Youtube api </h3>
      
      <div/>
        <button onClick={ytLogic.getAllSubs}> Get All Subs  </button> 
      <div/>
        <button onClick={ytLogic.XXXgetActivitesOfChannels_2}> 2.0: Get All Subs, then get activites of 1 of your subs  </button>
      
      <div></div>
        
      {/*<RenderShit />
      <XxxShelf shelfInfo={shelf1} />

        <button onClick={renderShit}> rendershit </button>
        <div id='doItHere'> </div>
        <button onClick={doPromiseAwaitStuff}> Do Promise await stuff </button>
      <div></div> 
      */}

        <ChannelForm />
      
        <VideoShelf videoList={videoJ.items}/>
        <Video video={videoJ.items[0]} />
        

    </div>
    );
}



/*
 * 
    axios.get("https://jsonplaceholder.typicode.com/users")
      .then(result => setData(result.data))
      .then(() => {
        console.log('data')
        console.log(data)
      })



    let someCheeky = {
      result:     { items: [123, "abc"] },
      statusText: "poop"
    }
    console.log('someCheeky')    
    console.log(someCheeky)    
    
    let trick = []
    trick.push(someCheeky)
    shelfVids.push( someCheeky )
  //  console.log('trick')    
//    console.log(trick)    



*/