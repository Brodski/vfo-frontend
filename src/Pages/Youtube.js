import React, { useState } from 'react';
import axios from 'axios';
import { SECRET_KEYS } from '../api-key';
import * as Common from './Common.js';
import { SubscriptionActivitys } from '../Classes/SubscriptionActivitys';


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

  const script = document.createElement("script");
  script.type = "text/javascript";
  script.src = "https://apis.google.com/js/client.js";
  document.body.appendChild(script)
  script.onload = () => {
    Common.initGoogleAPI()
  }

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

  
  function getAChannelsActivities(channel = "UC5bcPvIBATOx_tZKSpQCOhQ", maxResults = 5) {
    console.log("--- Getting activities for: " + channel)
    return window.gapi.client.youtube.activities.list({
      "part": "snippet,contentDetails",
      "channelId": channel,
      "maxResults": maxResults,
      "fields": "nextPageToken, items(contentDetails/*, snippet/*)"
    })
  }
  


  async function getActivitesOfChannels() {
    let subList = await getAllSubs()
    let count = 0;
    let subActivityList = []
    for (let s of subList) {
      console.log(count)
      count++
      let response = await getAChannelsActivities(s.snippet.resourceId.channelId)
      let fewActs = response.result
      let subActivity = new SubscriptionActivitys()      
      subActivity.channelId = s.snippet.resourceId.channelId
      subActivity.activityList = fewActs;
      subActivityList.push(subActivity)

      console.log(subActivity)
    }
    console.log("WERE OUT! subActivityList: ")
    console.log(subActivityList)

  }
  async function getAllSubs() {
    //let pageToken = null;
    //var response = await getSubsFromYoutube(pageToken)
    var response = await _getSubsFromYoutube()
    let subscriptionList = response.result.items

    while (response.result.nextPageToken) {
      response = await _getSubsFromYoutube(response.result.nextPageToken)
      subscriptionList = !subscriptionList ? response.result.items : subscriptionList.concat(response.result.items)      
    }
    console.log('getAllSubs(), returning subscriptionList: ')
    console.log(subscriptionList)
    return subscriptionList
    
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

  async function doStuff() {
  let subscriberList = getAllSubs()
  let profile = Common.getProfile()

  console.log(subscriberList)
  console.log(profile)
  const doubleTrouble = await Promise.all([subscriberList, profile])
  console.log(doubleTrouble)

  }
  
  return(
      <div>
        <h1>Youtube</h1>
        <div>Note, the app must ALWAYS do loadClient before any API call</div>
        <div>App now auto loads Client</div>
      
      <button onClick={Common.authenticate}>authorize </button>
      <button onClick={Common.signOut} > Log Out </button>
      <div></div>

      <button onClick={Common.getAuthCodeForServerSideShit} >Auth Code For Server</button>
      <button onClick={Common.testAuthcode} > TEST </button>
      <button onClick={Common.testWithXML} > TEST2 </button>
      <div></div>

      <button onClick={getAllSubs}> getAllSubs  </button>
      <button onClick={getUploads}> get Uploads   (channels.list) </button>
      <button onClick={() => getAChannelsActivities()}> get Activities   (activities.list) </button>

      <div></div>
      <button onClick={getActivitesOfChannels}> get activites of subscriptions  </button>
      <button onClick={doStuff}> Do important stuff </button>
      <div></div>
      <button onClick={Common.isHeSignedIn}> isHeSignedIn</button>
      <button onClick={Common.printShit}> print shit</button>
      <div></div>
      </div>
    );
}
