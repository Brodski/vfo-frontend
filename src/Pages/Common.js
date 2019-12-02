

import { SECRET_KEYS } from '../api-key';
import axios from 'axios';

var GoogleAuth;
var isSigned;

function testshit() {
  console.log("testshit")
}

export function initGoogleAPI() {
  //Without OAuth
  //window.gapi.load("client", function () { console.log("Not Load Script OAuth???"); });
  //With OAuth
  window.gapi.load("client:auth2", function () { //loads the gapi.client libraries, need to do this b/c!
    window.gapi.auth2.init({
      client_id: SECRET_KEYS.clientId,
      apyKey: SECRET_KEYS.apiKey,
      scope: "https://www.googleapis.com/auth/youtube.readonly",
      //returns gapi.auth2.GoogleAuth
    })
      .then(function (response) {
        console.log("g api Response", response);
        loadClient();
      })
  }); 
}

//https://www.youtube.com/channel/UCA-8h5uCH5RE-1r6gskkbTw
export function loadClient() {
  return window.gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
    .then(function (res2) {
      console.log("GAPI client loaded for API");
      console.log("res2 ", res2)
      GoogleAuth = window.gapi.auth2.getAuthInstance();
      isHeSignedIn()
    },
      function (err) { console.error("Error loading GAPI client for API", err); });
}

export function authenticate() {
  return window.gapi.auth2.getAuthInstance()
    .signIn()
    .then(function () {
      //getAuthCodeForServerSideShit(user); // This calls the sign in thing again
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












//https://www.youtube.com/channel/UCA-8h5uCH5RE-1r6gskkbTw
export async function loadClient2() {
  return window.gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
    .then(function (res2) {
      console.log("GAPI client loaded for API");
      console.log("res2 ", res2)
      GoogleAuth = window.gapi.auth2.getAuthInstance();
      isHeSignedIn()
    },
      function (err) { console.error("Error loading GAPI client for API", err); });
}



export async function initGoogleAPI2() {
  //Without OAuth
  //window.gapi.load("client", function () { console.log("Not Load Script OAuth???"); });
  //With OAuth
  let x = await window.gapi.load("client:auth2", 
    function () { //loads the gapi.client libraries, need to do this b/c!
      window.gapi.auth2.init({
        client_id: SECRET_KEYS.clientId,
        apyKey: SECRET_KEYS.apiKey,
        scope: "https://www.googleapis.com/auth/youtube.readonly",
        //returns gapi.auth2.GoogleAuth
      }).then(function (gAuth) {
        console.log('gAuth')
        console.log(gAuth)
        console.log('x')
        console.log(x)
        let y = loadClient2();
        console.log('y')
        console.log(y)
      })
  }); 
}
