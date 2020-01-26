// ////////////////////////////////////////////////////////////////
// ////////////////     INITIALIZE CLIENT     /////////////////////
// ////////////////////////////////////////////////////////////////
/* Google Sign In For Web
 * https://developers.google.com/identity/sign-in/web/reference
 * 
 * Authentication:
 * 
 * "GoogleAuth" is a singleton class that provides methods to allow the user to sign in with 
 * a Google account, get the user's current sign-in status, get specific data from the user's 
 * Google profile, request additional scopes, and sign out from the current account.
 *
 * Scope https://developers.google.com/identity/protocols/googlescopes
 * Get profile info (id): https://developers.google.com/identity/sign-in/web/people
 * Serverside Auth https://developers.google.com/identity/protocols/OAuth2WebServer
 * Serverside Auth https://developers.google.com/identity/sign-in/web/server-side-flow <--- backend
 * Serverside Auth https://developers.google.com/youtube/v3/guides/authentication
 * 
 * REFRENCES: 
 *
 *  Github JS API DOCS. https://github.com/google/google-api-javascript-client/blob/master/docs/reference.md
 *  OTHER JS API DOCS:  https://developers.google.com/identity/sign-in/web/reference 
 */
// Keeping func-names to stay consistent w/ the code from the google API ref
// //////////////////////////////////////////////////////////////

import { SECRET_KEYS } from '../api-key';

const SCOPE = "https://www.googleapis.com/auth/youtube.readonly"
const SPRING_BACKEND = `http://${process.env.REACT_APP_SPRINGB_DOMAIN}` 
let GoogleAuth;


// Had to get out of Dep. cycle,
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Pass-by-value issues prevent me from abstracting out the 3 'wait loop function' below
async function waitForGApiLoad() {
  let wait = 100
  while (!window.gapi) {
    wait = wait * 2
    console.log("GApi 1 :( GApi NOT EXISTS ");
    await sleep(wait)
  }
  console.log("GApi 1 :) GApi EXISTS ");
}

async function waitForAuthLoad() {
  let wait = 100
  while (!window.gapi.auth2) {
    wait = wait * 2
    console.log("GAPI 2 :( gapi.auth2 NOT EXISTS");
    await sleep(wait); 
  }
  console.log("GAPI 2 :) gapi.auth2 EXISTS");
}

async function _initClient() {
  let discoveryUrl = 'https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'
  await window.gapi.client.init({
    clientId: SECRET_KEYS.clientId,
    apiKey: SECRET_KEYS.apiKey,
    discoveryDocs: [discoveryUrl],
    scope: SCOPE,
  })
}

export async function initGoogleAPI() {
  // Wait until googleApi is loaded: "script.src = "https://apis.google.com/js/client.js"
  console.log('=== 1 ===')
  await waitForGApiLoad()

  // Wait until client is loaded
  console.log('=== 2 ===')
  await window.gapi.load("client:auth2", _initClient)

  // Wait until client is authenticated  
  console.log('=== 3 ===')
  await waitForAuthLoad()

  // Wait until GoogleAuth object is loaded
  console.log('=== 4 ===')

  GoogleAuth = await window.gapi.auth2.getAuthInstance();
  return GoogleAuth
}

export async function getGoogleAuth() {
  let wait = 100;
  while (!GoogleAuth) {
    await sleep(wait)
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
  if (GoogleAuth) {
    return GoogleAuth.signIn().then(res => {
      console.log("Sign-in successful")
      return res
    })
      .catch(function (err) { console.error("Error signing in", err); });
  }
}

export function logout() {
  if (GoogleAuth) {
    return GoogleAuth.signOut().then(res => {
      console.log("Sign-out successful");
      return res
    })
      .catch(function (err) { console.error("Error signing in", err); });
  }
}

export function isHeSignedIn() {
  if (GoogleAuth) {
    return GoogleAuth.isSignedIn.get()
  }
  console.log("GoogleAuth doesnt exist")
  return false
}

export function getToken() {
  if (GoogleAuth) {
    let idtoken = GoogleAuth.currentUser.get().getAuthResponse().id_token;
    return idtoken
  }
}

// ////////////////////////////////////////////////////////
// /////////////////   helper stuff ///////////////////
// ////////////////////////////////////////////////////////

export function printInfo() {
  console.log("print Info")
  console.log("---------------------------------")
  if (!GoogleAuth) {
    console.log("GoogleAuth doesnt exist")
    return
  }
  let user = GoogleAuth.currentUser.get()
  let profile = user.getBasicProfile()
  console.log(`ID: ${profile.getId()}`);
  console.log(`Full Name: ${profile.getName()}`);
  console.log(`Given Name: ${profile.getGivenName()}`);
  console.log(`Family Name: ${profile.getFamilyName()}`);
  console.log(`Image URL: ${profile.getImageUrl()}`);
  console.log(`Email: ${profile.getEmail()}`);

  console.log(user.getBasicProfile())
  console.log(user.getGrantedScopes())
  console.log(user.getHostedDomain())
  console.log(user.getId())
}

// // https://developers.google.com/identity/sign-in/web/server-side-flow
// export function getAuthCodeForServerSideShit() {
//   let user = GoogleAuth.currentUser.get()
//   user.grantOfflineAccess({
//     scope: "https://www.googleapis.com/auth/youtube.readonly"
//   }).then(function (resp) {
//     if (resp.code) {
//       axios.post(SPRING_BACKEND + '/userDebug', { authcode: resp.code } ) .then(res => { (console.log(res)) })
//       axios.post(SPRING_BACKEND + '/user/authorize', { authcode: resp.code } ) .then(res => { (console.log(res)) })

//       console.log("RESPONSE AND CODE FROM AUTHCODE")
//       console.log(resp)
//       console.log("------------")
//       console.log(resp.code)
//     }

//   })
// }

// export function testWithXML() {
//   var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance 
//   var theUrl = SPRING_BACKEND + "/user/authorize";
//   xmlhttp.onreadystatechange = function () {
//     if (xmlhttp.readyState === 4) {
//       console.log(xmlhttp.response);
//       console.log(xmlhttp.responseText);
//     }
//   }
//   xmlhttp.open("POST", theUrl);
//   xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
//   xmlhttp.send(JSON.stringify({ "email": "hello@user.com", "response": { "name": "Tester" } }));


// }
