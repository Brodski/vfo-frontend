

import { SECRET_KEYS } from '../api-key';
import axios from 'axios';

var GoogleAuth;
var isSigned;

function testshit() {
  console.log("testshit")
}

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function initGoogleAPI() {
/*
  while (!window.gapi) {
    console.log("!-!-!-!-!-!-!-!-!-!-!-! window.gapi not found >:(");
    await sleep(10)
  } 
  if (window.gapi) {
    console.log("!-!-!-!-!-!-!-!-!-!-!-!- window.gapi found :)");
  } else {
    console.log("WWWWWWWWWWWWHAT THE FLIP")
   }
   */

  
  await window.gapi.load("client:auth2", _initClient) //initClientWithAuth
  
  while (!window.gapi.auth2) {
    console.log("-------------------------auth2 not found");
    await sleep(10); //sleep 10 ms
  }
  console.log("!!!!!!!!!!!!!!!!!!!!!!!! auth2 found");
  GoogleAuth = await window.gapi.auth2.getAuthInstance();
  return GoogleAuth
  }

async function _initClient() {
  await window.gapi.auth2.init({
    client_id: SECRET_KEYS.clientId,
    apyKey: SECRET_KEYS.apiKey,
    scope: "https://www.googleapis.com/auth/youtube.readonly",
    //returns gapi.auth2.GoogleAuth
  })
  _loadClient();
}

async function _loadClient() {
   return window.gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
    .then(function (res2) {
      console.log("GAPI client loaded for API");
      isHeSignedIn()
    }).catch(
      function (err) { console.error("Error loading GAPI client for API", err); });
}

export function authenticate() {
  return window.gapi.auth2.getAuthInstance()
    .signIn()
    .then(function () {
      console.log("Sign-in successful");
      printShit()
    },
      function (err) { console.error("Error signing in", err); });
}
export function signOut() {
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

export function isHeSignedIn() {
  if (GoogleAuth) {
    var isSigned = GoogleAuth.isSignedIn.get()
    console.log("isSigned???")
    console.log(isSigned)
  }
  else
    console.log("NOPE")
}

export function printShit() {
  var user = GoogleAuth.currentUser.get()
  console.log("---------------------------------")
  isHeSignedIn()

  console.log(user.getBasicProfile())
  console.log(user.getGrantedScopes())
  console.log(user.getHostedDomain())
  console.log(user.getId())
  var isAuthorized = user.hasGrantedScopes("https://www.googleapis.com/auth/youtube.readonly");
  var isAuthorized2 = user.hasGrantedScopes("https://www.googleapis.com/auth/youtube.force-ssl");

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
  if (GoogleAuth) {
    var user = GoogleAuth.currentUser.get()
    var profile = user.getBasicProfile();
    return profile
    }
}

export function testAuthcode() {
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
