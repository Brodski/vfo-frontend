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
import { Shelf } from '../Classes/Shelf';
import { Filter } from '../Classes/Filter';
import { Subscription } from '../Classes/Subscription';
import { XxxShelf } from '../Components/Shelf';
import { Video } from '../Components/Video';
import { ChannelForm } from '../Components/ChannelForm';
import  * as GApiAuth from '../HttpRequests/GApiAuth';

// Github: JS Client https://github.com/google/google-api-javascript-client
//
//MAIN https://developers.google.com/youtube/v3/getting-started
//       OAUTH https://developers.google.com/youtube/v3/libraries
//       JS API https://github.com/google/google-api-javascript-client

//ACTUAL JS DOCS. gapi objects & methods: https://github.com/google/google-api-javascript-client/blob/master/docs/reference.md
// BIGGER DOCS:           https://developers.google.com/identity/sign-in/web/reference

// Get profile info (id): https://developers.google.com/identity/sign-in/web/people

//OAuth https://developers.google.com/youtube/v3/guides/authentication

/// FIELD THINGY: https://developers.google.com/youtube/v3/getting-started
//    URL: https://www.googleapis.com/youtube/v3/videos?id=7lCDEYXw3mM&key=YOUR_API_KEY
//         &part=snippet, statistics & fields=items(id,snippet,statistics)
///
// Pagination: https://developers.google.com/youtube/v3/guides/implementation/pagination
// next page token

//Scope https://developers.google.com/identity/protocols/googlescopes
// Serverside Auth https://developers.google.com/identity/protocols/OAuth2WebServer
// Serverside Auth https://developers.google.com/identity/sign-in/web/server-side-flow

//if you specify both, async takes precedence on modern browsers, while older browsers 
// that support defer but not async will fallback to defer.
//https://flaviocopes.com/javascript-async-defer/
//
export function YoutubeNEW() {


   var GoogleAuth;

  async function XXXgetActivitesOfChannels_2() {
  

    console.time("Subs getting")
    let allSubs = await getAllSubs()
    console.timeEnd("Subs getting")
    
    console.time("map")
    const allSubs_Promises = allSubs.map( sub =>  youtubeApi._getActivities(sub.snippet.resourceId.channelId))
    console.timeEnd("map")

    console.time("Acts getting")
    const allActivities_response = await Promise.all(allSubs_Promises)
    console.timeEnd("Acts getting")

    console.log(allSubs_Promises)
    console.log(allActivities_response)
    
      for (let act of allActivities_response) {
        console.log("---------- Activity --------------------------------------------------------------------")
//      console.log(JSON.stringify(act.result, null, 2))
      }    
    }

  async function getAllSubs() {
    var response = await youtubeApi._getThisUsersSubs()
    let allSubs = response.result.items

    while (response.result.nextPageToken) {
      response = await youtubeApi._getThisUsersSubs(response.result.nextPageToken)
      allSubs = !allSubs ? response.result.items : allSubs.concat(response.result.items)
    }
    console.log('allSubs : ')
    console.log(allSubs)
    return allSubs

  }
  
  
  ////////////////////////////////////////////////////
  moment.updateLocale('en', {
    relativeTime : {
      m:  "1 minute",
      h:  "1 hour",
      d:  "1 day",
      M:  "1 month",
      y:  "1 year",
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

  let shelf1 = new Shelf()
  shelf1.title = "Politics"
  shelf1.subscriptions.push(sub1)
  shelf1.subscriptions.push(sub2)
  shelf1.subscriptions.push(sub3)

  let shelf2 = new Shelf();
  shelf2.title = "Babes"
  shelf2.subscriptions.push(sub4)
  shelf2.subscriptions.push(sub5)

  let shelf3 = new Shelf();
  shelf3.title = "k-pop"
  shelf3.subscriptions.push(sub6)

  ///////////////////////////////////////////////

  {
    console.log("HELLO YOU SHOULD ONLY SEE ME ONCE!!!!!!!!!!!!!!!!!!")
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://apis.google.com/js/client.js";
    script.async = true
    document.body.appendChild(script)
    script.onload = () => {
      //var wtf = Common.initGoogleAPI()

      var googleAuthPromise = GApiAuth.initGoogleAPI() //apiHelper()
      apiHelper(googleAuthPromise)
      console.log('googleAuthPromise is : ' + googleAuthPromise)
      //setTimeout(function () { console.log("TIMEOUT!!!!!!!!"); console.log(wtf) }, 1000)
    }
  } 

  async function apiHelper(promise) {
    console.log('oooooooooooooooooooooooooooooooooooooooooooooooo')
    GoogleAuth = await promise
    console.log('apiHelper: GoogleAuth.isSignedIn.get() ' + GoogleAuth.isSignedIn.get())
    console.log('apiHelper: isSigned? ' + isSigned) 
    console.log('oooooooooooooooooooooooooooooooooooooooooooooooo')
  }

  async function hackHelper() {
  console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&')
    while (!GoogleAuth) {
      console.log("Hack Helper: GoogleAuth NOT exist")
      await GApiAuth.sleep(100) //sleep 10 ms
    }
    console.log("Hack Helper: GoogleAuth !!! exist")
  //  console.log('isSigned ' + isSigned)
//    console.log('GoogleAuth.isSignedIn.get() ' + GoogleAuth.isSignedIn.get())
    //setIsSigned(GoogleAuth.isSignedIn.get())
    //setIsSigned(false)
    //console.log('isSigned ' + isSigned)
    console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&')
  }
  const [isSigned, setIsSigned] = useState(false)
  const [filteredShelfs, setFilteredShelfs] = useState([])
  const [data, setData] = useState([]);
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

  useEffect(  () => {
    console.log('---------------useEffect1----------------------')
    hackHelper() //useEffect will not wait for any "await" functions
    //var idk = fetchShelfs();
    var idk2 = fetchActs_perShelf()
    setFilteredShelfs(["abcc", '12344'])
    console.log('***************************    filteredShelfs: ' +filteredShelfs)
    console.log(idk2)
    console.log('---------------useEffect2----------------------')
    axios.get("https://jsonplaceholder.typicode.com/users")
      .then(result => setData(result.data))
      .then(() => {
        console.log('data')
        console.log(data)
      })
      
    setTimeout(function () { console.log("TIMEOUT!!!!!!!!"); console.log(data) }, 5000)
  }, [])
  
  /*
  const fetchShelfs = async () => {
    //console.log("fetchShelfs")
    //let data = await _getShelfsFromProfile(www.localhost.com)
    // setShelfs(prevShelfs => [...prevShelfs, {subscription: sh.subscription, title: sh.title } ])
//    console.log('shelfs')
  //  console.log(shelfs)
    //console.log(shelfs.subscriptions)
//    const acts_Promises = shelfs.subscriptions.map(sub => console.log(sub)) //youtubeApi._getActivities(sub.channelId))
    //const acts_Response =  Promise.all(acts_Promises)
    //const shelfzz =
  }
  */

  var SuckIt =[]

  const fetchActs_perShelf = async () => {
    console.log("fetchActs_perShelfs")
    console.log("Entering hack helper")
    await hackHelper()
    console.log("exiting hack helper")
    let allShelfs_Promises =[]
    
    for (let sh of shelfs) {
      console.log('sh')
      console.log(sh)
      const sh_Promises = sh.subscriptions.map(sub => youtubeApi._getActivities(sub.channelId))
      allShelfs_Promises.push(sh_Promises)
      //const acts_Response = await Promise.all(acts_Promises)
    }
    let eachShelfsActs =  await Promise.all( allShelfs_Promises.map( shProm => Promise.all(shProm)) )  //https://stackoverflow.com/questions/36094865/how-to-do-promise-all-for-array-of-array-of-promises
    console.log(eachShelfsActs)

    eachShelfsActs = await removeNonVideos(eachShelfsActs)
    console.log("_____-------WE FINISHED THE FILTER!-------_______")
    SuckIt = eachShelfsActs;
    console.log(SuckIt)
    console.log(setFilteredShelfs)
    await setFilteredShelfs(["abc", "123"])
    console.log(filteredShelfs)
    console.log(filteredShelfs)
    setTimeout( () => console.log(filteredShelfs),5000)
    return eachShelfsActs;
  }

  function removeNonVideos(eachShelfsActs) {
    let filteredShelfs = []
    for (let shelf of eachShelfsActs) {
      console.log('shelf')
      console.log(shelf)
  //    const damnBaby = shelf.map( act => act.result.items.filter(function (item) { return item.contentDetails.upload } ))
      let fShelf = []
      for (let act of shelf) {
        console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
        if (act.status == 200) {
            console.log("2000000000!")
          }
        console.log('act.result')
        //console.log(act.result.items.snippet.channelTitle)
        console.log(act.result)
        const result = act.result.items.filter(function (item) { return item.contentDetails.upload } )
        console.log(result)
        fShelf.push(result)

      }
      filteredShelfs.push(fShelf)
    }
    console.log('filteredShelfs')
    console.log(filteredShelfs)
    return filteredShelfs

  }
  /*        for (let item of act.result.items) {
          console.log(item)
          if (item.contentDetails.upload) {
            console.log("we got contentDetails UPLOAD")
          }
          if (item.contentDetails.subscription) {
            console.log("we got contentDetails SUB")
          }
        }
        */
  function auxShit(shz) {
  return(
      <div>
       {shelfs.map(sh => {
        return (<li> {sh.title} </li>)
      })}
      </div>
    )
  }

  
  function renderShit() {
      console.log('shelfs')
      console.log(shelfs)
      //let shelfStuff = ( <XxxShelf shelfInfo={shelf1} /> )
      //let someShit =  (<div> hi bitches </div> ) 
      let shit = auxShit()
      //ReactDOM.render(someShit, document.getElementById('doItHere'));
      //ReactDOM.render(<XxxShelf shelfInfo={shelf1} />, document.getElementById('doItHere'));
      ReactDOM.render( shit, document.getElementById('doItHere'));

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
        <button onClick={getAllSubs}> Get All Subs  </button> 
      <div/>
        <button onClick={XXXgetActivitesOfChannels_2}> 2.0: Get All Subs, then get activites of 1 of your subs  </button>
      
      <div></div>
      {/*<XxxShelf shelfInfo={shelf1} />*/}

        <button onClick={renderShit}> rendershit </button>
        <div id='doItHere'> </div>
        {/*<button onClick={doPromiseAwaitStuff}> Do Promise await stuff </button>*/}
      <div></div> 

        <ChannelForm />
        <VideoShelf videoList={videoJ.items}/>
        <Video video={videoJ.items[0]} />

    </div>
    );
}
