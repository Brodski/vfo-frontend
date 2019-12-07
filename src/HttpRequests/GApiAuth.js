import * as Common from '../BusinessLogic/Common';

import { SECRET_KEYS } from '../api-key';
import axios from 'axios';

var GoogleAuth;
var isSigned;
const SCOPE = "https://www.googleapis.com/auth/youtube.readonly"

export async function check(gapiObj, gapiString) {
  let wait = 500;
  while (!window.gapi.client.youtube) {
    wait = wait * 2
    console.log("GApi: NOT EXISTS: gapi.client.youtube")
    await Common.sleep(wait)
  }
  while (!window.gapi.auth2) {
    wait = wait * 2
    console.log("GApi: NOT EXISTS: gapi.auth2 not found");
    await Common.sleep(wait); //sleep 100 ms
  }
  while (!window.gapi) {
    wait = wait * 2
    console.log("GApi: NOT EXISTS: window.gapi not found");
    await Common.sleep(wait)
  }
}

export async function initGoogleAPI() {
  let wait = 100
  while (!window.gapi) {
    wait = wait * 2
    console.log("GApi: NOT EXISTS: window.gapi not found");
    await Common.sleep(wait)
  }
  console.log("GApi: :) EXISTS: window.gapi found");
  
  await window.gapi.load("client:auth2", _initClient) //initClientWithAuth

  wait = 100
  while (!window.gapi.auth2) {
    wait = wait * 2
    console.log("NOT EXISTS: gapi.auth2 not found");
    await Common.sleep(wait); //sleep 100 ms
  }
  console.time("await window.gapi.auth2.getAuthInstance()")
  console.log("In GapiAuth: about to await window.gapi.auth2.getAuthInstance() ")
  GoogleAuth = await window.gapi.auth2.getAuthInstance();
  console.timeEnd("await window.gapi.auth2.getAuthInstance()")
  return GoogleAuth
  }

async function _initClient() {
  await window.gapi.auth2.init({
    client_id: SECRET_KEYS.clientId,
    apyKey: SECRET_KEYS.apiKey,
    scope: SCOPE,
    //returns gapi.auth2.GoogleAuth
  })
  _loadClient();
}

async function _loadClient() {
   return window.gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
    .then(function (res2) {
      console.log("GAPI client loaded for API");
//      isHeSignedIn()
    }).catch(
      function (err) { console.error("Error loading GAPI client for API", err); });
}

export function login() {
  return window.gapi.auth2.getAuthInstance()
    .signIn()
    .then(function () {
      console.log("Sign-in successful");
      return true
    })
      .catch(function (err) { console.error("Error signing in", err); });
}
export function logout() {
  if (GoogleAuth) {
    return GoogleAuth.signOut().then(function () { 
        console.log("Sign-out successful");
        return true }
      )
      .catch( function (err) { console.error("Error signing in", err); });
  }
}

export function isHeSignedIn() {
console.log('isHeSignedIn() ')
  if (GoogleAuth) {
    console.log('GoogleAuth.currentUser.get().hasGrantedScopes(SCOPE)')
    console.log(GoogleAuth.currentUser.get().hasGrantedScopes(SCOPE))
    console.log('GoogleAuth.currentUser.get()')
    console.log(GoogleAuth.currentUser.get())
    console.log('GoogleAuth.isSignedIn ???')
    console.log(GoogleAuth.isSignedIn.get())
    return GoogleAuth.isSignedIn.get()
  }
  else {
    console.log("GoogleAuth doesnt exist")
    return false
  }
}

export function printShit() {
  console.log("print shit")
  if (!GoogleAuth) {
    console.log("GoogleAuth doesnt exist")
    return
  }
  var user = GoogleAuth.currentUser.get()
  console.log("---------------------------------")
  isHeSignedIn()

  console.log(user.getBasicProfile())
  console.log(user.getGrantedScopes())
  console.log(user.getHostedDomain())
  console.log(user.getId())

}


export function testWithXML() {
  var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance 
  var theUrl = "http://localhost:8080/user/authorize";
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

export function getProfile() {
  console.log("getProfile")
  console.log(getProfile)
  if (GoogleAuth) {
     console.log('GoogleAuth.currentUser.get()')
     console.log(GoogleAuth.currentUser.get())
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
    //axios.post('http://localhost:8080/userDebug', { authcode: someId }).then(res => { (console.log(res)) })
    axios.post('http://localhost:8080/user/authorize', { authcode: someId }).then(res => { (console.log(res)) })
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
      axios.post('http://localhost:8080/userDebug', { authcode: resp.code } ) .then(res => { (console.log(res)) })
      axios.post('http://localhost:8080/user/authorize', { authcode: resp.code } ) .then(res => { (console.log(res)) })
      var authcode22 = resp.poopy;
      console.log("RESPONSE AND CODE FROM AUTHCODE")
      console.log(resp)
      console.log("------------")
      console.log(resp.code)
    }
    
  })
}
