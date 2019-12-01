import React, { useState, useEffect } from 'react';
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

export function Youtube() {

    moment.updateLocale('en', {
      relativeTime : {
        m:  "1 minute",
        h:  "1 hour",
        d:  "1 day",
        M:  "1 month",
        y:  "1 year",
      }
    });


//  useEffect(() => {
    console.log("HELLO YOU SHOULD ONLY SEE ME ONCE!!!!!!!!!!!!!!!!!!")
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://apis.google.com/js/client.js";
    script.async = true
    document.body.appendChild(script)
    script.onload = () => {
      Common.initGoogleAPI()
    }
  //}, [])

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
    
    console.log("allActivites:")
      for (let act of allActivities_response) {
        console.log("------------------------------------------------------------------------------")
//      console.log(JSON.stringify(act.result, null, 2))
      }    

    }

  async function getActivitesOfChannels() {
    let subsOfUserList = await getAllSubs()
    let count = 0;
    let subActivityList = []
    for (let s of subsOfUserList) {
      console.log(count)
      count++
      let response = await youtubeApi._getActivities(s.snippet.resourceId.channelId)
      let fewActs = response.result
      let subActivity = new SubscriptionActivitys()
      subActivity.channelId = s.snippet.resourceId.channelId
      subActivity.activityList = fewActs.items;
      subActivity.nextPageToken = fewActs.nextPageToken
      subActivityList.push(subActivity)
      console.log(subActivity)
    }
    console.log("WERE OUT! subActivityList: ")

    console.log("==== ALL SUB ACTIVITIES!! ===")
    console.log(subActivityList)
    console.log(JSON.stringify(subActivityList, null, 2))

    for (const act of subActivityList[1].activityList) {
      //let mydateString = act.snippet.publishedAt
      //let mydate = new Date(mydateString)
      //console.log(mydateString)
      //console.log(mydate.toString())
      console.log("==== An Activity ===")
      console.log(JSON.stringify(act, null, 2))
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
    console.log('leaving allSubs')

    return allSubs

  }

  //////////////////////////////////////////////////////
  const [channel, setChannel] = useState('')
  const updateChannel = (e) => {
    setChannel(e.target.value)
  }

  const Video = (props) => {
    let thumbnail     = props.video.snippet.thumbnails.medium.url
    let id            = props.video.id
    let title         = props.video.snippet.title
    let pubAt         = new Date( props.video.snippet.publishedAt )
    let viewCount     = props.video.statistics.viewCount
    let channelName   = props.video.snippet.channelTitle
    let fromNowDate   = new moment(props.video.snippet.publishedAt).fromNow()    
    
    let vd_aux        = moment.duration( props.video.contentDetails.duration ) //Convert iso8601 string to object
    let vidDuration       = vd_aux.minutes() + ':' + vd_aux.seconds().toString().padStart(2, 0) // if seconds == 3, then "03"
    

    return (
      <div>
        <h3> - built by a single video object - </h3>
        <a href={"https://www.youtube.com/watch?v="+id} >
          <img src={thumbnail} /> 
        </a>

        <div> {pubAt.toString()} </div>
        <div> {title} </div>
        <div> channel: {channelName} </div>
        <div> relative: {fromNowDate} </div>
        <div> Views: {viewCount} </div>
        <div> duration: {vidDuration } </div>
        <div> id: {id} </div>
      </div>
    );
  }
  console.log('//////////video json /////////////////////////')
  console.log(videoJ)

    
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
  
  const XxxVideoShelf2 = (props) => {
    console.log("map vidShelf")
    console.time("map vidShelf")
    console.log(props)
    console.log(props.shelfInfo.subscriptions)
    const shelfActs_Promises = props.shelfInfo.subscriptions.map(sub => {
      console.log(sub.channelId)
      youtubeApi._getActivities(sub.channelId)
    }) 
    console.timeEnd("map vidShelf")

    console.time("Acts getting")
//    const allActivities_response = await Promise.all(shelfActs_Promises)
    console.timeEnd("Acts getting")
  //  console.log(shelfActs_Promises)
  //  console.log(allActivities_response)
    return(
      <div>
        <h2> props.shelfInfo.subscriptions[0].channelId </h2>
      </div>
    )
  }
  
   
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

   
   //let profile = new Profile()

   let shelf1 = new Shelf()
   shelf1.title = "Politics"
   shelf1.subscriptions.push(sub1)
   shelf1.subscriptions.push(sub2)
   shelf1.subscriptions.push(sub3)
   console.log(shelf1)
   let shelf2 = new Shelf();
   shelf2.title = "Babes"
   shelf2.subscriptions.push(sub4)
   shelf2.subscriptions.push(sub5)
   console.log(shelf2)
  return(
      <div>
        <h1>Youtube</h1>
        <div>Note, the app must ALWAYS do loadClient before any API call</div>
      <h3>Common</h3>
      <button onClick={Common.authenticate}>authorize </button>
      <button onClick={Common.signOut} > Log Out </button>
      <button onClick={Common.getAuthCodeForServerSideShit} >Auth Code For Server</button>
      <div></div>
      <button onClick={Common.isHeSignedIn}> isHeSignedIn</button>
      <button onClick={Common.printShit}> print shit</button>

      <div></div>      
      <button onClick={Common.testAuthcode} > get your logged in profile </button>
      <button onClick={Common.testWithXML} > "Ping" server with xml </button>
      <div></div>
      <h3> youtube api </h3>
      <button onClick={getAllSubs}> Get All Subs  </button>
      <div/>
      <button onClick={getActivitesOfChannels}> Get All Subs, then get activites of 1 of your subs  </button>
      <button onClick={XXXgetActivitesOfChannels_2}> 2.0: Get All Subs, then get activites of 1 of your subs  </button>
      
      <div></div>
      <XxxVideoShelf2 shelfInfo={shelf1} />
      
      {/*<button onClick={doPromiseAwaitStuff}> Do Promise await stuff </button>*/}
      <div></div> 

      <form onSubmit={youtubeApi.getChannelInfo}>
        <input type='text' onChange={updateChannel} />
        <button>Channel get</button>
      </form>
      
      <VideoShelf videoList={videoJ.items}/>
      <Video video={videoJ.items[0]} />


      </div>
    );
}

  /*
  let userzzz = { name: "dmx", hobbies: "giving it to ya" }
  const VideoLOL = ({ name, price }) => {
    return (
      <div>
        <p> {name} : {price} </p>
      </div>
    );
  }
  const Video3 = (props) => {
    return (
      <div> video 3
        <p> info.name:  {props.info.name}       </p>
      </div>
    );
  }
  const Store = (info) => {
      //const info = { name: "Luigi", price: "green"};
    return( 
        <div>
          <h3>Tell me about this person</h3>
          <VideoLOL  man={info} />
        </div>
      );
  } 
  */
