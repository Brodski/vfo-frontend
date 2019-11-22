

import { SECRET_KEYS } from '../api-key';

var GoogleAuth;
var isSigned;
export function initGoogleAPI() {
  //With OAuth
  window.gapi.load("client:auth2", function () { //loads the gapi.client libraries, need to do this b/c!
    window.gapi.auth2.init({
      client_id: SECRET_KEYS.clientId,
      apyKey: SECRET_KEYS.apiKey,
      //scope: "https://www.googleapis.com/auth/youtube.force-ssl",
      scope: "https://www.googleapis.com/auth/youtube.readonly",
      //scope: "https://www.googleapis.com/auth/youtubepartner-channel-audit",
    });
    //Without OAuth
    //window.gapi.load("client", function () { console.log("Not Load Script OAuth???"); });
    loadClient();
  }); 
}

//https://www.youtube.com/channel/UCA-8h5uCH5RE-1r6gskkbTw
export function loadClient() {
  return window.gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
    .then(function () {
      console.log("GAPI client loaded for API");
      GoogleAuth = window.gapi.auth2.getAuthInstance();
      console.log(GoogleAuth)
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

}



export function getAuthCodeForServerSideShit(user) {
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