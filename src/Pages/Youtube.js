import React, { useState } from 'react';
import axios from 'axios';
import { SECRET_KEYS } from '../api-key';
import * as Common from './Common.js';

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

  
  function getActivities() {
    return window.gapi.client.youtube.activities.list({
      "part": "snippet,contentDetails",
      "channelId": "UC5bcPvIBATOx_tZKSpQCOhQ",
      "maxResults": 25
    })
      .then(function (response) {
        console.log("Response", response.result);
      }).catch(function (err) { console.error("Execute error", err); });
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


  async function getAllSubs() {
    let pageToken = null;
    let fullResponse = null;
//    getAllSubs_rec(pageToken, fullResponse)
 //     .then(function (result) { console.log(result); doStuffWithSubz(result) })
  //    .catch(function (err) { console.error("Execute error", err); });

    var response = await getAllSubs_rec2(pageToken, fullResponse)
    fullResponse = !fullResponse ? response.result.items : fullResponse.concat(response.result.items)
    while (response.result.nextPageToken) {
    //for (let i = 0; i < 5; i++) {
      console.log("GOING IN!")
      response = await getAllSubs_rec2(response.result.nextPageToken, fullResponse)
      console.log(response.result.nextPageToken)
      console.log("WE DON WAITED")
      fullResponse = !fullResponse ? response.result.items : fullResponse.concat(response.result.items)
    }
    console.log('fullResponse')
    console.log(fullResponse)
    
    
  }
  function getAllSubs_rec2(pageToken, fullResponse) {
    console.log("======2222222222222222222======================================")
    return window.gapi.client.youtube.subscriptions.list({
      "part": "snippet",
      "maxResults": 15,
      "mine": true,
      "pageToken": pageToken,
      "fields": "pageInfo, nextPageToken, items(snippet/title, snippet/publishedAt, snippet/resourceId/channelId, snippet/thumbnails/default/url )"
    })
  }

  function doStuffWithSubz(allSubz) {
    console.log("allSubz")
    console.log(allSubz)
  }

  function getAllSubs_rec(pageToken, fullResponse) {
    console.log("============================================")
    return window.gapi.client.youtube.subscriptions.list({
      "part": "snippet",
      "maxResults": 15,
      "mine": true,
      "pageToken": pageToken,
      "fields": "pageInfo, nextPageToken, items(snippet/title, snippet/publishedAt, snippet/resourceId/channelId, snippet/thumbnails/default/url )"
    })
      .then(function (response) {
        fullResponse = !fullResponse ? response.result.items : fullResponse.concat(response.result.items)
        console.log("next page " + response.result.nextPageToken)
        if (response.result.nextPageToken) {
          console.log("fullResponse", fullResponse);
          console.log("IN");
          return getAllSubs_rec(response.result.nextPageToken, fullResponse)
        }
        else {
          console.log("fullResponse", fullResponse);
          console.log("OUT");
        return fullResponse
        }
      })
      .then(function (result) { console.log("SHIIIIIIIIIIIT");console.log(result); doStuffWithSubz(result) })
      .catch(function (err) { console.error("Execute error", err); });
      
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
      <button onClick={getActivities}> get Activities   (activities.list) </button>

      <div></div>
      <button onClick={Common.isHeSignedIn}> isHeSignedIn</button>
      <button onClick={Common.printShit}> print shit</button>
      <div></div>
      </div>
    );
}
