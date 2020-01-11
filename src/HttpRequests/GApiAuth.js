import * as Common from '../BusinessLogic/Common';

import { SECRET_KEYS } from '../api-key';
import axios from 'axios';

let GoogleAuth;
const SCOPE = "https://www.googleapis.com/auth/youtube.readonly"
const SPRING_BACKEND= 'http://' + process.env.REACT_APP_SPRINGB_DOMAIN // localhost:8080


//////////////////////////////////////////////////////////////////
//////////////////     INITIALIZE CLIENT     /////////////////////
//////////////////////////////////////////////////////////////////
/* Google Sign In For Web
 * https://developers.google.com/identity/sign-in/web/reference
 * 
 * Authentication:
 * 
 * "GoogleAuth" is a singleton class that provides methods to allow the user to sign in with 
 * a Google account, get the user's current sign-in status, get specific data from the user's 
 * Google profile, request additional scopes, and sign out from the current account.
 */
////////////////////////////////////////////////////////////////

export async function initGoogleAPI() {
  // Wait until googleApi is loaded: "script.src = "https://apis.google.com/js/client.js"
  console.log('=== 1 ===')
  await waitForGApiLoad()
  
  // Wait until client is loaded
  console.log('=== 2 ===')
  await window.gapi.load("client:auth2", _initClient) 
    
  //Wait until client is authenticated  
  console.log('=== 3 ===')
  await waitForAuthLoad()

  //Wait until GoogleAuth object is loaded
  console.log('=== 4 ===')
  
  GoogleAuth = await window.gapi.auth2.getAuthInstance(); 
  return GoogleAuth
}

// "You can also now use gapi.client to perform authenticated requests."  instead of auth.init
// https://developers.google.com/identity/sign-in/web/reference#example
async function _initClient() {
  let discoveryUrl = 'https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'
  await window.gapi.client.init({
    clientId: SECRET_KEYS.clientId,
    apiKey: SECRET_KEYS.apiKey,
    discoveryDocs: [discoveryUrl],
    scope: SCOPE,
  })   
}

// Pass-by-value issues prevent me from abstracting out the 3 'wait loop function' below
async function waitForGApiLoad() {
  let wait = 100
  while (!window.gapi) {
    wait = wait * 2
    console.log("GApi 1 :( GApi NOT EXISTS ");
    await Common.sleep(wait)
  }
  console.log("GApi 1 :) GApi EXISTS ");
}

async function waitForAuthLoad() {
  let wait = 100
  while (!window.gapi.auth2) {
    wait = wait * 2
    console.log("GAPI 2 :( gapi.auth2 NOT EXISTS");
    await Common.sleep(wait); //sleep 100 ms
  }
  console.log("GAPI 2 :) gapi.auth2 EXISTS");
}

export async function getGoogleAuth() {
  let wait = 100;
  while (!GoogleAuth) {
    await Common.sleep(wait)
    wait = wait * 1.5
  }
  return GoogleAuth
}

export async function checkAll() {
  if (!window.gapi.auth2 || !window.gapi || !GoogleAuth) {
    return false
  }
  return true
}

//////////////////////////////////////////////////////////////////
////////////////////   LOGIN - LOG OUT   ////////////////////////
/////////////////////////////////////////////////////////////////

export function login() {
  if (GoogleAuth)
    return GoogleAuth.signIn().then(function (res) {
      console.log("Sign-in successful")
      return true
    })
      .catch(function (err) { console.error("Error signing in", err); });
}
export function logout() {
  if (GoogleAuth) {
    return GoogleAuth.signOut().then(function (res) { 
        console.log("Sign-out successful");
        return true 
    })
      .catch( function (err) { console.error("Error signing in", err); });
  }
}

export function isHeSignedIn() {
  if (GoogleAuth) {
    return GoogleAuth.isSignedIn.get()
  }
  else {
    console.log("GoogleAuth doesnt exist")
    return false
  }
}

export function getToken() {
  if (GoogleAuth) {
    let idtoken =  GoogleAuth.currentUser.get().getAuthResponse().id_token;
    return idtoken
  }
}

//////////////////////////////////////////////////////////
///////////////////   helper stuff ///////////////////
//////////////////////////////////////////////////////////
export function printInfo() {
  console.log("print Info")
  console.log("---------------------------------")
  if (!GoogleAuth) {
    console.log("GoogleAuth doesnt exist")
    return
  }
  let user = GoogleAuth.currentUser.get()
  let profile = user.getBasicProfile()
  console.log('ID: ' + profile.getId());
  console.log('Full Name: ' + profile.getName());
  console.log('Given Name: ' + profile.getGivenName());
  console.log('Family Name: ' + profile.getFamilyName());
  console.log('Image URL: ' + profile.getImageUrl());
  console.log('Email: ' + profile.getEmail());

  console.log(user.getBasicProfile())
  console.log(user.getGrantedScopes())
  console.log(user.getHostedDomain())
  console.log(user.getId())
}

//https://developers.google.com/identity/sign-in/web/server-side-flow
export function getAuthCodeForServerSideShit() {
  var user = GoogleAuth.currentUser.get()
  user.grantOfflineAccess({
    scope: "https://www.googleapis.com/auth/youtube.readonly"
  }).then(function (resp) {
    if (resp.code) {
      axios.post(SPRING_BACKEND + '/userDebug', { authcode: resp.code } ) .then(res => { (console.log(res)) })
      axios.post(SPRING_BACKEND + '/user/authorize', { authcode: resp.code } ) .then(res => { (console.log(res)) })

      console.log("RESPONSE AND CODE FROM AUTHCODE")
      console.log(resp)
      console.log("------------")
      console.log(resp.code)
    }
    
  })
}

export function testWithXML() {
  var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance 
  var theUrl = SPRING_BACKEND + "/user/authorize";
  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState === 4) {
      console.log(xmlhttp.response);
      console.log(xmlhttp.responseText);
    }
  }
  xmlhttp.open("POST", theUrl);
  xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xmlhttp.send(JSON.stringify({ "email": "hello@user.com", "response": { "name": "Tester" } }));


}
