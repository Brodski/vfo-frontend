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
// BIGGER DOCS: https://developers.google.com/identity/sign-in/web/reference
// It is  generally a best practice to request scopes incrementally, at the time access is required, rather than up front. https://developers.google.com/identity/protocols/OAuth2
//      

//OAuth https://developers.google.com/youtube/v3/guides/authentication

/// FIELD THINGY: https://developers.google.com/youtube/v3/getting-started
//    URL: https://www.googleapis.com/youtube/v3/videos?id=7lCDEYXw3mM&key=YOUR_API_KEY
//         &part=snippet, statistics & fields=items(id,snippet,statistics)
///
// Pagination: https://developers.google.com/youtube/v3/guides/implementation/pagination
// next page token

//Scope https://developers.google.com/identity/protocols/googlescopes

export function Youtube() {

  const script = document.createElement("script");
  script.type = "text/javascript";
  script.src = "https://apis.google.com/js/client.js";
  document.body.appendChild(script)
  var GoogleAuth;
  var isSigned;
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


  function getAllSubs() {
    let pageToken = null;
    let fullResponse = [];
    getAllSubs_rec(pageToken, fullResponse)
  }

  function getAllSubs_rec(pageToken, fullResponse) {
    console.log("============================================")
    return window.gapi.client.youtube.subscriptions.list({
      "part": "snippet",
      "maxResults": 30,
      "mine": true,
      "pageToken": pageToken,
      "fields": "pageInfo, nextPageToken, items(snippet/title, snippet/publishedAt, snippet/resourceId/channelId, snippet/thumbnails/default/url )"
    })
      .then(function (response) {
        fullResponse.push(response.result)
        console.log("Response", response.result);
        console.log("fullResponse", fullResponse);
        console.log("next page " + response.result.nextPageToken)
        if (response.result.nextPageToken) {
          return getAllSubs_rec(response.result.nextPageToken, fullResponse)
          }
      }).catch (function (err) { console.error("Execute error", err); });
      
  }
  
  return(
      <div>
        <h1>Youtube</h1>
      <h3>{SECRET_KEYS.apiKey}</h3>
        <div>Note, the app must ALWAYS do loadClient before any API call</div>
        <div>App now auto loads Client</div>
        <form >
          <input type="text" name="username" />
          <button>Submit</button>
      </form>


      <button onClick={Common.authenticate}>authorize </button>
      <button onClick={Common.signOut} > Log Out </button>
      <div></div>
      <button onClick={Common.getAuthCodeForServerSideShit} >Auth Code For Server</button>
      <div></div>
      
      <button onClick={getAllSubs}> getAllSubs  </button>
      <button onClick={getUploads}> get Uploads   (channels.list) </button>
      <button onClick={getActivities}> get Activities   (channels.list) </button>

      <div></div>
      <button onClick={Common.isHeSignedIn}> isHeSignedIn</button>
      <button onClick={Common.printShit}> print shit</button>
      <div></div>
      </div>
    );
}

/*
  function disconnect() {
    if (GoogleAuth)
    GoogleAuth.disconnect()
  }


  function getSubs() {
    return window.gapi.client.youtube.subscriptions.list({
      "part": "snippet",
      "maxResults": 30,
      "mine": true,
      "pageToken": "",
      "fields": "pageInfo, nextPageToken, items(snippet/title, snippet/publishedAt, snippet/resourceId/channelId, snippet/thumbnails/default/url )"
    })
      .then(function (response) {
        console.log("Response", response.result);
        console.log("next page")
        console.log(response.result.nextPageToken)
      },
        function (err) { console.error("Execute error", err); });
  }
 */


/*
  function execCaptionsForVolvo() {
    return window.gapi.client.youtube.captions.list({
      "part": "snippet",
      "videoId": "M7FIvfx5J10"
    })
      .then(function (response) {
        console.log("Response", response.body);
      },
        function (err) { console.error("Execute error", err); });
  }
*/

/*
function logShit(res) {
  console.log('----------------------------------------')
  console.log(`Status code: ${res.status}`);
  console.log(`Status text: ${res.statusText}`)
  console.log(`Request method: ${res.request.method}`)
  console.log(`Path: ${res.request.path}`)

  console.log(`Date: ${res.headers.date}`)
  console.log(`Date: ${res.headers}`)
  console.log(`Data: ${res.data}`)
  console.log(`Config: ${res.config}`)

  console.log(res.config);
}
*/

//export default Youtube;







/* <button onClick={execCaptionsForVolvo} > Captions for some commercial </button>]
           <button onClick={getSubs} > getSubs (subscriptions.list) </button>
           <button onClick={execListUserShit} > List User Shit  (channels.list)</button>
      <button onClick={auditMe}> audit?  (channels.list) </button>
      <button onClick={execCrunksSubs} > Crunk's subs </button>
      <button onClick={disconnect}>Disconnect! </button>
      */

/*
  function auditMe() {
    return window.gapi.client.youtube.channels.list({
      "part": "snippet, contentDetails, status, localizations",
      //"id": "UC_x5XG1OV2P6uZZ5FSM9Ttw",
      "id": "UCA-8h5uCH5RE-1r6gskkbTw, UC_x5XG1OV2P6uZZ5FSM9Ttw",
    })
      .then(function (response) {
        console.log("Response", response.result);
      },
        function (err) { console.error("Execute error", err); });
  }

  function execCrunksSubs() {
    return window.gapi.client.youtube.subscriptions.list({
      "part": "snippet,contentDetails",
      "channelId": "UCA-8h5uCH5RE-1r6gskkbTw", //crunk id
      "fields": "kind, nextPageToken, pageInfo, items(id,kind,snippet/title)",
      "maxResults": 30,
      "pageToken": "CB4QAA",

    })
      .then(function (response) {
        console.log("Response", response.body);
      },
        function (err) { console.error("Execute error", err); });
  }


  function execListUserShit() {
    return window.gapi.client.youtube.channels.list({
      "part": "snippet,contentDetails,statistics",
      "mine": true,
      //"fields": "items(id,kind,snippet/title)"
    })
      .then(function (response) {
        console.log("Response", response.body);
      },
        function (err) { console.error("Execute error", err); });
  }

 
 
 
 */