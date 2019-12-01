import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import { SECRET_KEYS } from '../api-key';
import * as Common from './Common.js';
import { SubscriptionActivitys } from '../Classes/SubscriptionActivitys';
import * as videoJ from '../Scratch/api_video.json';
import * as moment from 'moment';
import * as youtubeApi from "./youtubeApi";

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


  useEffect(() => {
    console.log("HELLO YOU SHOULD ONLY SEE ME ONCE!!!!!!!!!!!!!!!!!!")
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://apis.google.com/js/client.js";
    document.body.appendChild(script)
    script.onload = () => {
      Common.initGoogleAPI()
    }
  }, [])

  /////////////////////  Rest - 1 channel's activities  ///////////////////////////
  /*
  function _getActivities(channel) {
    return window.gapi.client.youtube.activities.list({
      "part": "snippet,contentDetails",
      "channelId": channel,
      "maxResults": 35,
      "fields": "nextPageToken, items(contentDetails/*, snippet/*)"
    })
  }
  */
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
  /*
  function _getThisUsersSubs(pageToken) {
    return window.gapi.client.youtube.subscriptions.list({
      "part": "snippet",
      "maxResults": 50,
      "mine": true,
      "pageToken": pageToken,
      "fields": "pageInfo, nextPageToken, items(snippet/title, snippet/publishedAt, snippet/resourceId/channelId, snippet/thumbnails/default/url )"
    })
  }
  */


 // async function doPromiseAwaitStuff() {
//    let subsOfUserList = getAllSubs()
    //let profile = Common.getProfile()
   // const doubleTrouble = await Promise.all([subsOfUserList, profile])
 ///   console.log(doubleTrouble)
//  }

  //////////////////////////////////////////////////////
  const [channel, setChannel] = useState('')
  const updateChannel = (e) => {
    setChannel(e.target.value)
  }
   

  function getChannelInfo(e) {
    e.preventDefault();
    console.log("CLICKEDDD! - channel: " + channel)
    let id = "UCPWXiRWZ29zrxPFIQT7eHSA, UCeMFHOzX9MDWbr-pu2WdmVw, UC3IngBBUGFUduHp-7haK1lw, UCA-8h5uCH5RE-1r6gskkbTw, UC0CeYMTh57zSsbUKhsyOPfw"
    return window.gapi.client.youtube.channels.list({
      "part": "snippet",
      "id": id,
      "maxResults": 50,
      "fields": "items(id, snippet/title,snippet/thumbnails/default)",
    })
      .then(function (response) {
        console.log("Response", response.result);  //console.log("Response", JSON.stringify(response.result, null, 2)); 
      })
  }
  ///////////////////////////////////////////////////////
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
  } */
  

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
      
      {/*<button onClick={doPromiseAwaitStuff}> Do Promise await stuff </button>*/}
      <div></div> 

      <form onSubmit={getChannelInfo}>
        <input type='text' onChange={updateChannel} />
        <button>Channel get</button>
      </form>
      
      <VideoShelf videoList={videoJ.items}/>
      <Video video={videoJ.items[0]} />


      </div>
    );
}

/*

  function getUploads() {
    return window.gapi.client.youtube.search.list({
      "part": "snippet",
      "channelId": "UCb--64Gl51jIEVE-GLDAVTg",
      "maxResults": 50,
      "order": "date",
      "safeSearch": "none",
      "type": "video"
    })
      .then(function (response) {
        console.log("Response", response.result);
      }).catch(function (err) { console.error("Execute error", err); });
  }
 
  function momentLearning() {
    console.log("============================================================")
    console.log(moment())
    var sec = moment().subtract(1, 'days').fromNow()
    console.log(sec)
    var sec = moment().subtract(1.5, 'days').fromNow()
    console.log(sec)
    var sec = moment().subtract(2, 'days').fromNow()
    console.log(sec)
    var sec = moment().subtract(.5, 'days').fromNow()
    console.log(sec)

    var sec = moment().subtract(1, 'seconds').fromNow()
    console.log(sec)
    var sec = moment().subtract(5, 'seconds').fromNow()
    console.log(sec)
    var sec = moment().subtract(25, 'seconds').fromNow()
    console.log(sec)
    var sec = moment().subtract(60, 'seconds').fromNow()
    console.log(sec)
    var sec = moment().subtract(105, 'seconds').fromNow()
    console.log(sec)
    var sec = moment().subtract(119, 'seconds').fromNow()
    console.log(sec)
    var sec = moment().subtract(120, 'seconds').fromNow()
    console.log(sec)
    var sec = moment().subtract(121, 'seconds').fromNow()
    console.log(sec)
    var sec = moment().subtract(149, 'seconds').fromNow()
    console.log(sec)
    var sec = moment().subtract(150, 'seconds').fromNow()
    console.log(sec)

    var sec = moment().subtract(5, 'minutes').fromNow()
    console.log(sec)
    var sec = moment().subtract(5, 'hours').fromNow()
    console.log(sec)
    var sec = moment().subtract(1, 'years').fromNow()
    console.log(sec)
    var sec = moment().subtract(5, 'years').fromNow()
    console.log(sec)
    var sec = moment().subtract(1.55, 'years').fromNow()
    console.log(sec)
    console.log("============================================================")
  } 
 
 */

  /*  const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://apis.google.com/js/client.js";
    document.body.appendChild(script)
    script.onload = () => {
      Common.initGoogleAPI()
    }
  */