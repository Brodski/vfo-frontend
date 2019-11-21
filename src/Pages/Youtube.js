import React, { useState } from 'react';
import axios from 'axios';
import { SECRET_KEYS } from '../api-key';

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

  script.onload = () => {
    //With OAuth
    window.gapi.load("client:auth2", function () { //loads the gapi.client libraries, need to do this b/c!
      window.gapi.auth2.init({
        client_id: SECRET_KEYS.clientId,
        apyKey: SECRET_KEYS.apiKey,
        //scope: "https://www.googleapis.com/auth/youtube.force-ssl",
        scope: "https://www.googleapis.com/auth/youtube.readonly",
        //scope: "https://www.googleapis.com/auth/youtubepartner-channel-audit",
      });
      loadClient();
    }); 
    //Without OAuth
    //window.gapi.load("client", function () { console.log("Not Load Script OAuth???"); });
  }
  //https://www.youtube.com/channel/UCA-8h5uCH5RE-1r6gskkbTw
  function loadClient() {
    return window.gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
      .then(function () {
        console.log("GAPI client loaded for API");
        GoogleAuth = window.gapi.auth2.getAuthInstance();
        console.log(GoogleAuth)
        isHeSignedIn()
      },
        function (err) { console.error("Error loading GAPI client for API", err); });
  }

  function printShit() {
    var user = GoogleAuth.currentUser.get()
    console.log("---------------------------------")
    console.log("isSigned:")
    console.log(isSigned)
    console.log("GoogleAuth")
    console.log(GoogleAuth)
    console.log("user")
    console.log(user)

    console.log(user.getBasicProfile())
    console.log(user.getGrantedScopes())
    console.log(user.getHostedDomain())
    console.log(user.getId())
    var isAuthorized = user.hasGrantedScopes("https://www.googleapis.com/auth/youtube.readonly");
    var isAuthorized2 = user.hasGrantedScopes("https://www.googleapis.com/auth/youtube.force-ssl");
    var isSigned = GoogleAuth.isSignedIn.get()

  }

  function authenticate() {
    return window.gapi.auth2.getAuthInstance()
      .signIn()
      .then(function () {
        //getAuthCodeForServerSideShit(user); // This calls the sign in thing again
        console.log("Sign-in successful");
        printShit()
      },
        function (err) { console.error("Error signing in", err); });
  }
  function signOut() {
    if (GoogleAuth) {
      var isSigned = GoogleAuth.isSignedIn.get()
      console.log("before: GoogleAuth.isSignedIn.get()")
      console.log(isSigned)
      GoogleAuth.signOut().then(function () {
        console.log("after: GoogleAuth.isSignedIn.get()")
        isSigned = GoogleAuth.isSignedIn.get()
        console.log(isSigned)
      })
    }
  }



  function getAuthCodeForServerSideShit(user) {
    var user = GoogleAuth.currentUser.get()
    user.grantOfflineAccess({
      scope: "https://www.googleapis.com/auth/youtube.readonly"
    }).then(function (resp) {
      var authcode = resp.code;
      console.log("RESPONSE AND CODE FROM AUTHCODE")
      console.log(resp)
      console.log("------------")
      console.log(resp.code)
    })
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
        // Handle the results here (response.result has the parsed body).
        console.log("Response", response.result);
      },
        function (err) { console.error("Execute error", err); });
    
  }

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


  function isHeSignedIn() {
    if (GoogleAuth) {
      var isSigned = GoogleAuth.isSignedIn.get()
      console.log("isSigned???")
      console.log(isSigned)
    }
    else
      console.log("NOPE")
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
        }
      ).catch(function (err) {
        console.error("Execute error", err)
      });
      
  }

  function disconnect() {
    if (GoogleAuth)
    GoogleAuth.disconnect()
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


      <button onClick={authenticate}>authorize </button>
      <button onClick={signOut} > Log Out </button>
      <div></div>
      <button onClick={getAuthCodeForServerSideShit} >Auth Code For Server</button>
      <div></div>
      {/* <button onClick={execCaptionsForVolvo} > Captions for some commercial </button>]
           <button onClick={getSubs} > getSubs (subscriptions.list) </button>*/}
      <button onClick={execCrunksSubs} > Crunk's subs </button>
      <button onClick={execListUserShit} > List User Shit  (channels.list)</button>
      <div></div>

      <button onClick={getAllSubs}> getAllSubs  </button>
      <button onClick={auditMe}> audit?  (channels.list) </button>
      <button onClick={getUploads}> get Uploads   (channels.list) </button>

      <div></div>
      <button onClick={isHeSignedIn} > isHeSignedIn</button>
      <button onClick={printShit} > print shit</button>
      <div></div>
      <button onClick={disconnect}>Disconnect! </button>
      </div>
    );
}

/*
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