import React, { useState } from 'react';
import axios from 'axios';
//import { SECRET_KEYS.apiKey } from '../api-key';
import { SECRET_KEYS } from '../api-key';
//import { secretValues } from '../api-key';
// Github: JS Client https://github.com/google/google-api-javascript-client
//
//MAIN https://developers.google.com/youtube/v3/getting-started
//       OAUTH https://developers.google.com/youtube/v3/libraries
//       JS API https://github.com/google/google-api-javascript-client

//ACTUAL GOOD. gapi objects & methods: https://github.com/google/google-api-javascript-client/blob/master/docs/reference.md
// It is  generally a best practice to request scopes incrementally, at the time access is required, rather than up front. https://developers.google.com/identity/protocols/OAuth2
//      

//OAuth https://developers.google.com/youtube/v3/guides/authentication

//Consider: ETags??

/// FIELD THINGY: https://developers.google.com/youtube/v3/getting-started
//    URL: https://www.googleapis.com/youtube/v3/videos?id=7lCDEYXw3mM&key=YOUR_API_KEY
//         &part=snippet, statistics & fields=items(id,snippet,statistics)
///

export function Youtube() {

  const script = document.createElement("script");
  script.type = "text/javascript";
  script.src = "https://apis.google.com/js/client.js";

  document.body.appendChild(script)

  script.onload = () => {
    //console.log(secretValues.value1)
    ////console.log(secretValues.value2)
    //With OAuth
    // TODO: Do this ONLY when user clicks an OAuth operation
    window.gapi.load("client:auth2", function () {
      window.gapi.auth2.init({ client_id: SECRET_KEYS.clientId });
      console.log("OnLoad Script OAuth");
    });
    //Without OAuth
    //window.gapi.load("client", function () {
     // console.log("Not Load Script OAuth???");
    //});
  }

  function authenticate() {
    return window.gapi.auth2.getAuthInstance()
      .signIn({ scope: "https://www.googleapis.com/auth/youtube.readonly" })
      .then(function () { console.log("Sign-in successful"); },
        function (err) { console.error("Error signing in", err); });
  }
  function loadClient() {
    window.gapi.client.setApiKey(SECRET_KEYS.apiKey);
    return window.gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
      .then(function () { console.log("GAPI client loaded for API"); },
        function (err) { console.error("Error loading GAPI client for API", err); });
  }
  // Make sure the client is loaded and sign-in is complete before calling this method.
  function execListCrunkChannel() {
  console.log("LOG EXECUTE!!!!")
    return window.gapi.client.youtube.channels.list({
      "part": "snippet,contentDetails,statistics",
      "id": "UC_x5XG1OV2P6uZZ5FSM9Ttw",  //https://www.youtube.com/channel/UCA-8h5uCH5RE-1r6gskkbTw
      //"prettyPrint": true
    })
      .then(function (response) {
        // Handle the results here (response.result has the parsed body).
        console.log("Response", response.body);
      },
        function (err) { console.error("Execute error", err); });
  }

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

  function execCrunksSubs() {
    return window.gapi.client.youtube.subscriptions.list({
      "part": "snippet,contentDetails",
      "channelId": "UCA-8h5uCH5RE-1r6gskkbTw", //crunk id
      "fields": "kind, nextPageToken, pageInfo, items(id,kind,snippet/title)",
      "maxResults": 30,
      "pageToken": "CB4QAA",

    })
      .then(function (response) {
        // Handle the results here (response.result has the parsed body).
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
        // Handle the results here (response.result has the parsed body).
        console.log("Response", response.body);
      },
        function (err) { console.error("Execute error", err); });
  }



  return(
      <div>
        <h1>Youtube</h1>
      <h3>{SECRET_KEYS.apiKey}</h3>
        <div>Note, the app must ALWAYS do loadClient before any API call</div>

        <form >
          <input type="text" name="username" />
          <button>Submit</button>
      </form>


      <button onClick={authenticate}>authorize </button>
      <button onClick={loadClient} > loadClient</button>
      <div></div>
      <button onClick={execListCrunkChannel} > Stats on GoogleDevelopers Channel</button>
      <button onClick={execCaptionsForVolvo} > Captions for some commercial </button>
      <button onClick={execCrunksSubs} > Crunk's subs </button>
      <button onClick={execListUserShit} > List User Shit  (channels.list)</button>

      </div>
    );
}










/*
function whatever() {

  function authenticate() {
    return window.gapi.auth2.getAuthInstance()
      .signIn({ scope: "https://www.googleapis.com/auth/youtube.readonly" })
      .then(function () { console.log("Sign-in successful"); },
        function (err) { console.error("Error signing in", err); });
  }
  function loadClient() {
    window.gapi.client.setApiKey("YOUR_API_KEY");
    return window.gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
      .then(function () { console.log("GAPI client loaded for API"); },
        function (err) { console.error("Error loading GAPI client for API", err); });
  }
  // Make sure the client is loaded and sign-in is complete before calling this method.
  function execute() {
    return window.gapi.client.youtube.channels.list({
      "part": "snippet,contentDetails,statistics",
      "forUsername": "GoogleDevelopers"
    })
      .then(function (response) {
        // Handle the results here (response.result has the parsed body).
        console.log("Response", response);
      },
        function (err) { console.error("Execute error", err); });
  }

 
  window.gapi.load("client:auth2", function () {
    window.gapi.auth2.init({ client_id: "YOUR_CLIENT_ID" });
  });
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