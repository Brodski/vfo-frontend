import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import { SECRET_KEYS } from '../api-key';
import * as Common from './Common.js';
import { SubscriptionActivitys } from '../Classes/SubscriptionActivitys';
import * as videoJ from '../Scratch/api_video.json'

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
  /*  const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://apis.google.com/js/client.js";
    document.body.appendChild(script)
    script.onload = () => {
      Common.initGoogleAPI()
    }
  */
  function getAChannelsActivities(channel = "UC5bcPvIBATOx_tZKSpQCOhQ", maxResults = 5) {
    return window.gapi.client.youtube.activities.list({
      "part": "snippet,contentDetails",
      "channelId": channel,
      "maxResults": maxResults,
      "fields": "nextPageToken, items(contentDetails/*, snippet/*)"
    })
  }



  async function getActivitesOfChannels() {
    let subsOfUserList = await getAllSubs()
    let count = 0;
    let subActivityList = []
    for (let s of subsOfUserList) {
      console.log(count)
      count++
      let response = await getAChannelsActivities(s.snippet.resourceId.channelId)
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
    var response = await _getSubsFromYoutube()
    let subsOfUserList = response.result.items

    while (response.result.nextPageToken) {
      response = await _getSubsFromYoutube(response.result.nextPageToken)
      subsOfUserList = !subsOfUserList ? response.result.items : subsOfUserList.concat(response.result.items)
    }
    console.log('getAllSubs(), subsOfUserList: ')
    console.log(subsOfUserList)
    return subsOfUserList

  }
  function _getSubsFromYoutube(pageToken) {
    return window.gapi.client.youtube.subscriptions.list({
      "part": "snippet",
      "maxResults": 15,
      "mine": true,
      "pageToken": pageToken,
      "fields": "pageInfo, nextPageToken, items(snippet/title, snippet/publishedAt, snippet/resourceId/channelId, snippet/thumbnails/default/url )"
    })
  }


  async function doPromiseAwaitStuff() {
    let subsOfUserList = getAllSubs()
    let profile = Common.getProfile()
    const doubleTrouble = await Promise.all([subsOfUserList, profile])
    console.log(doubleTrouble)
  }

  //////////////////////////////////////////////////////
  const [channel, setChannel] = useState('')

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

  const updateChannel = (e) => {
    setChannel(e.target.value)
  }

  //////////////////////////////////

  const Video = ({ name, price }) => {
    return (
      <div>
        <p> {name} : {price} </p>
      </div>
    );
  }
  console.log('///////////////////////////////////////////')
  console.log(videoJ)
  console.log(videoJ.items)
  console.log(videoJ.items[0].id)

  const Video2 = ({ thumbnail, title, publishedAt, id, viewCount, duration }) => {
    let pubAt = new Date(publishedAt)
    return (
      <div>
        <a href={"https://www.youtube.com/watch?v="+id} >
          <img src={thumbnail} /> 
        </a>

        <p> {pubAt.toString()} </p>
        <p> {title} </p>
        <p> {viewCount} </p>
        <p> {duration } </p>
        <p> {id } </p>
      </div>
    );
  }

  
  const Store = (info) => {
      //const info = { name: "Luigi", price: "green"};
    return( 
        <div>
          <h3>Tell me about this person</h3>
          <Video man={info} />
        </div>
      );
  }
  
  
  /////////////////////////////////////////

  return(
      <div>
        <h1>Youtube</h1>
        <div>Note, the app must ALWAYS do loadClient before any API call</div>
        <div>App now auto loads Client</div>
      
      <button onClick={Common.authenticate}>authorize </button>
      <button onClick={Common.signOut} > Log Out </button>
      <button onClick={Common.getAuthCodeForServerSideShit} >Auth Code For Server</button>

      <div></div>      
      <button onClick={Common.testAuthcode} > get your logged in profile </button>
      <button onClick={Common.testWithXML} > "Ping" server with xml </button>
      <div></div>

      <button onClick={getAllSubs}> Get All Subs  </button>
      <div/>
      <button onClick={getActivitesOfChannels}> Get All Subs, then get activites of 1 of your subs  </button>
      {/*<button onClick={getUploads}> get Uploads   (channels.list) </button>
       <button onClick={() => getAChannelsActivities()}> get Activities   (activities.list) </button>*/}
      

      <div></div>
      
      <button onClick={doPromiseAwaitStuff}> Do Promise await stuff </button>
      <div></div>
      <button onClick={Common.isHeSignedIn}> isHeSignedIn</button>
      <button onClick={Common.printShit}> print shit</button>
      <div></div> 

      <form onSubmit={getChannelInfo}>
        <input type='text' onChange={updateChannel} />
        <button>Channel get</button>
      </form>
      <Video name={"DMX"} price={"$1,000"} />
      <Video2 thumbnail={videoJ.items[0].snippet.thumbnails.medium.url}
        id={videoJ.items[0].id}
        title={videoJ.items[0].snippet.title}
        publishedAt={videoJ.items[0].snippet.publishedAt}
        views={videoJ.items[0].statistics.viewCount}
        duration={videoJ.items[0].contentDetails.duration}
      />


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
*/
