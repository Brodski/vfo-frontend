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

export async function initGoogleAPI() {
  // Wait until googleApi is loaded: "script.src = "https://apis.google.com/js/client.js"
  console.log('=== 1 ===')
  await waitForGApiLoad()
  
  // Wait until client is loaded
  console.time('2')
  console.log('=== 2 ===')
  await window.gapi.load("client:auth2", _initClient) //initClientWithAuth
  console.timeEnd('2')
    
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
  /*await window.gapi.auth2.init({
    client_id: SECRET_KEYS.clientId,
    //apiKey: SECRET_KEYS.apiKey,
    scope: SCOPE,
  })
  */
  let discoveryUrl = 'https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'
  await window.gapi.client.init({
    clientId: SECRET_KEYS.clientId,
    apiKey: SECRET_KEYS.apiKey,
    discoveryDocs: [discoveryUrl],
    scope: SCOPE,
  })   
  //await _loadClient();
}

/*
async function _loadClient() {
   window.gapi.client.setApiKey(SECRET_KEYS.apiKey);
   return window.gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
    .then(function (res2) {
      console.log("GApi client loaded for API");
    }).catch(
      function (err) { console.error("Error loading GAPI client for API", err); });
}
*/




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
    /*console.log('window.gapi.auth2' )
    console.log(window.gapi.auth2 )
    console.log('window.gapi' )
    console.log(window.gapi )
    console.log('GoogleAuth' )
    console.log(GoogleAuth )*/
    return false
  }
  return true
}

//////////////////////////////////////////////////////////////////
////////////////////   LOGIN - LOG OUT   ////////////////////////
/////////////////////////////////////////////////////////////////
export async function check(gapiObj, gapiString) {
  let wait = 500;
  while (!window.gapi.client.youtube) {
    wait = wait * 2
    console.log("1 check GApi: NOT EXISTS: gapi.client.youtube")
    await Common.sleep(wait)
  }
  while (!window.gapi.auth2) {
    wait = wait * 2
    console.log("2 check GApi: NOT EXISTS: gapi.auth2 not found");
    await Common.sleep(wait); //sleep 100 ms
  }
  while (!window.gapi) {
    wait = wait * 2
    console.log("3 check GApi: NOT EXISTS: window.gapi not found");
    await Common.sleep(wait)
  }
}

export function login() {
  if (GoogleAuth)
    return GoogleAuth.signIn().then(function (res) {
      console.log("Sign-in successful");
      console.log(res);
      return true
    })
      .catch(function (err) { console.error("Error signing in", err); });
}
export function logout() {
  if (GoogleAuth) {
    return GoogleAuth.signOut().then(function (res) { 
        console.log("Sign-out successful");
        console.log(res);
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
export function printShit() {
  console.log("print shit")
  console.log("---------------------------------")
  if (!GoogleAuth) {
    console.log("GoogleAuth doesnt exist")
    return
  }
  let user = GoogleAuth.currentUser.get()
  let profile = user.getBasicProfile()
  console.log(profile.getId())
  console.log(profile.getName()) // USE THIS!!!! for user name
  console.log(profile.getGivenName()) //first naem
  console.log(profile.getFamilyName()) // last name
  console.log(profile.getImageUrl())
  console.log(profile.getEmail())
  console.log(profile.getId()) //dont use this
  console.log(user.getBasicProfile())
  console.log(user.getGrantedScopes())
  console.log(user.getHostedDomain())
  console.log(user.getId())

}

////////////////////////// https://developers.google.com/identity/sign-in/web/reference#googleusergetid
export function getProfile() {
  console.log("getProfile")
  if (GoogleAuth) {
    var user = GoogleAuth.currentUser.get()
    var profile = user.getBasicProfile();
    return profile 
    }
}

export function testAuthcode() {
  console.log('testAuthcode')
  var user = GoogleAuth.currentUser.get()
  var profile = user.getBasicProfile();
  var someId = user.getId();
  if (someId) {
    //axios.post(SPRING_BACKEND +'/userDebug', { authcode: someId }).then(res => { (console.log(res)) })
    axios.post(SPRING_BACKEND + '/user/authorize', { authcode: someId }).then(res => { (console.log(res)) })
    console.log("SOME ID")
    console.log(someId)

    console.log('ID: ' + profile.getId());
    console.log('Full Name: ' + profile.getName());
    console.log('Given Name: ' + profile.getGivenName());
    console.log('Family Name: ' + profile.getFamilyName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail());

    //var profile = auth2.currentUser.get().getBasicProfile();
  }
}

//https://developers.google.com/identity/sign-in/web/server-side-flow
export function getAuthCodeForServerSideShit() {
  var user = GoogleAuth.currentUser.get()
  user.grantOfflineAccess({
    scope: "https://www.googleapis.com/auth/youtube.readonly"
  }).then(function (resp) {
    var authcode = resp.code;
    if (resp.code) {
      axios.post(SPRING_BACKEND + '/userDebug', { authcode: resp.code } ) .then(res => { (console.log(res)) })
      axios.post(SPRING_BACKEND + '/user/authorize', { authcode: resp.code } ) .then(res => { (console.log(res)) })
      var authcode22 = resp.poopy;
      console.log("RESPONSE AND CODE FROM AUTHCODE")
      console.log(resp)
      console.log("------------")
      console.log(resp.code)
    }
    
  })
}


/////////////////////////////////////////////////////

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
