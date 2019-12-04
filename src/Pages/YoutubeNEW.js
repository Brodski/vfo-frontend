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
import { ChannelForm } from '../Components/ChannelForm';
import  * as GApiAuth from '../HttpRequests/GApiAuth';

import * as ytLogic from '../BusinessLogic/ytLogic.js'

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
  const [filteredShelfs, setFilteredShelfs] = useState([])
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
   let ass3 = ["xyz", "098"]


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
    setIsSigned(isSigned)
    console.log('apiHelper: isSigned? ' + isSigned) 
    console.log('-- APIHPER BOTTOM ---- APIHPER BOTTOM ---- APIHPER BOTTOM --')
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
    setFilteredShelfs(ass3)
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
  //  console.log('***************************    filteredShelfs: ' + filteredShelfs)
//    console.log(idk2)
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
  //    console.log('sh')
//      console.log(sh)
      const sh_Promises = sh.subscriptions.map(sub => youtubeApi._getActivities(sub.channelId))
      allShelfs_Promises.push(sh_Promises)
      //const acts_Response = await Promise.all(acts_Promises)
    }
    let eachShelfsActs =  await Promise.all( allShelfs_Promises.map( shProm => Promise.all(shProm)) )  //https://stackoverflow.com/questions/36094865/how-to-do-promise-all-for-array-of-array-of-promises

    
    eachShelfsActs = await ytLogic.removeNonVideos(eachShelfsActs)
    console.log('eachShelfsActs xxx')
    console.log(eachShelfsActs)
    let bigBoyShelf = await eachShelfsActs.map( shelf => ytLogic.flattenShelf(shelf))
    console.log('bigBoyShelf')
    console.log(bigBoyShelf)
    bigBoyShelf = bigBoyShelf.map( shelf => ytLogic.sortByDate(shelf))
    console.log('SORTED bigBoyShelf')
    console.log(bigBoyShelf)

    console.log("_____-------WE FINISHED THE FILTER!-------_______")
    console.log('eachShelfsActs')
    console.log(eachShelfsActs)
    console.log(eachShelfsActs[0][0][0].contentDetails.upload.videoId)
    //setFilteredShelfs( eachShelfsActs[0][0][0].contentDetails.upload.videoId)
    setFilteredShelfs(bigBoyShelf)
    
    return eachShelfsActs;
  }



  const RenderShit = () => {
  let idk = filteredShelfs.toString()
  let idk2 = filteredShelfs.map(shelf => {
      return (<Shelf shelf={shelf}/> )
    })
  let shit = (
      <div>12313122312312
        <div> {idk2}  </div>
        {shelfs.map(sh => {
        return (<li> {sh.title} </li>)
      })}
      </div>
    )
    return shit
    //ReactDOM.render( shit, document.getElementById('doItHere'));
  }
  
  const VideoShelf = (props) => {
    const myVidShelf = props.videoList.map((vid) =>
      <Video key={vid.id} video={vid}/>
    );
    return (
      <div> 
        <h1> ======================================= </h1>
        {myVidShelf}
        <h1> ======================================= </h1>
      </div>  
      )
  }
  return(
  

    <div>
    
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
        <RenderShit />
      {/*<XxxShelf shelfInfo={shelf1} />

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

*/