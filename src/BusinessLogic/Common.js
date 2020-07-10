import * as GApiAuth from '../HttpRequests/GApiAuth';
import * as ServerEndpoints from "../HttpRequests/ServerEndpoints";
import * as ytLogic from "./YtLogic.js";
import CustomShelf from "../Classes/CustomShelf";
import Pic from "../Images/profile-pic.png";
import Subscription from "../Classes/Subscription";
import User from "../Classes/User";

window.$isCYTLogging = false
window.$isCYTFinshedLogging = false

// Had to get out of Dep. cycle,
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function logoutUser(){

}

// Goes through every sub from the backend, if a sub does not match any subs from YT, then we found a sub that was removed from YT user.
export function checkForRemovedSubs(subsFromYt, subsFromBackend) {
  let removedSubs = [];
  let doesMatches = false;
  let allBackendSubz = [];
  subsFromBackend.customShelfs.forEach(sh => {
    allBackendSubz.push(...sh.fewSubs);
  });
  allBackendSubz.forEach(backS => {
    doesMatches = false;
    subsFromYt.forEach(ytS => {
      if (ytS.snippet.resourceId.channelId === backS.channelId) {
        doesMatches = true;
        return;
      }
    });
    // if this sub from backend doesnt exist in subsFrom Yt, then it was removed
    if (!doesMatches) {
      removedSubs.push(backS);
    }
  });
  return removedSubs;
}

// TODO could be cleaner, pretty confusing.
// Goes through every sub from YT, if a sub does not match any subs from the backend, then we found a new sub.
export function checkForNewSubs(subsFromYt, subsFromBackend) {
  let newSubs = [];
  subsFromYt.forEach(ytS => {
    let doesMatches = false;
    subsFromBackend.customShelfs.forEach(uSh => {
      uSh.fewSubs.forEach(sub => {
        if (ytS.snippet.resourceId.channelId === sub.channelId) {
          doesMatches = true;
          return;
        }
      });
    });
    if (!doesMatches) {
      newSubs.push(ytS);
    }
  });
  return newSubs;
}

export async function processUserFromServer(res, doSync) {
  let u = new User();
  let subzPromise = ytLogic.getAllSubs();
  if (res.data.customShelfs == null) {
    // null implies new user
    u.initNewUser(await subzPromise, res.data);
    ServerEndpoints.saveUser(u);
  } else {
    u.customShelfs = res.data.customShelfs;
    u.googleId = res.data.googleId;
    u.pictureUrl = res.data.pictureUrl;
    u.username = res.data.username;
    u.isDemo = false;
    console.log(doSync)
    if (doSync){
      console.log("WE GONIG IN")
      console.log("WE GONIG IN")
      console.log("WE GONIG IN")
      console.log("WE GONIG IN")
      console.log("WE GONIG IN")
      console.log("WE GONIG IN")
      console.log("WE GONIG IN")
      console.log("WE GONIG IN")
      console.log("WE GONIG IN")
      console.log("WE GONIG IN")
      console.log("WE GONIG IN")
      console.log("WE GONIG IN")
      console.log("WE GONIG IN")
      console.log("WE GONIG IN")
      console.log("WE GONIG IN")
      console.log("WE GONIG IN")
      console.log("WE GONIG IN")
      console.log("WE GONIG IN")
      console.log("WE GONIG IN")
      console.log("WE GONIG IN")
      console.log("WE GONIG IN")
      console.log("WE GONIG IN")
      console.log("WE GONIG IN")
      console.log("WE GONIG IN")
      console.log("WE GONIG IN")
      console.log("WE GONIG IN")
      console.log("WE GONIG IN")
      console.log("WE GONIG IN")
      console.log("WE GONIG IN")
      console.log("WE GONIG IN")
      console.log("WE GONIG IN")
      console.log("WE GONIG IN")
      console.log("WE GONIG IN")
      console.log("WE GONIG IN")
      console.log("WE GONIG IN")
      console.log("WE GONIG IN")
      console.log("WE GONIG IN")
      console.log("WE GONIG IN")
      console.log("WE GONIG IN")
      console.log("WE GONIG IN")
      console.log("WE GONIG IN")
      console.log("WE GONIG IN")
      console.log("WE GONIG IN")
      console.log("WE GONIG IN")
      console.log("WE GONIG IN")
      console.log("WE GONIG IN")
      console.log("WE GONIG IN")
      console.log("WE GONIG IN")
      console.log("WE GONIG IN")
      console.log("WE GONIG IN")
      console.log("WE GONIG IN")
      console.log("WE GONIG IN")
      console.log("WE GONIG IN")
      console.log("WE GONIG IN")
      console.log("WE GONIG IN")
      console.log("WE GONIG IN")
      console.log("WE GONIG IN")
      console.log("WE GONIG IN")
      console.log("WE GONIG IN")
      console.log("WE GONIG IN")
      console.log("WE GONIG IN")
      console.log("WE GONIG IN")
      console.log("WE GONIG IN")
      console.log("WE GONIG IN")
      console.log("WE GONIG IN")
      console.log("WE GONIG IN")
      console.log("WE GONIG IN")
      console.log("WE GONIG IN")
      console.log("WE GONIG IN")
      console.log("WE GONIG IN")
      console.log("WE GONIG IN")
      console.log("WE GONIG IN")
      console.log("WE GONIG IN")
      console.log("WE GONIG IN")
      console.log("WE GONIG IN")
      console.log("WE GONIG IN")
      console.log("WE GONIG IN")
      console.log("WE GONIG IN")
      console.log("WE GONIG IN")
      console.log("WE GONIG IN")
      console.log("WE GONIG IN")
      console.log("WE GONIG IN")
      console.log("WE GONIG IN")
      console.log("WE GONIG IN")
      console.log("WE GONIG IN")
      console.log("WE GONIG IN")
      console.log("WE GONIG IN")
      console.log("WE GONIG IN")
      console.log("WE GONIG IN")
      // Below: Sync subs from the User's YT account and this app's database.
      let newSubs = checkForNewSubs(await subzPromise, res.data);
      let removedSubArr = checkForRemovedSubs(await subzPromise, res.data);
      u.addArrayOfSubs(newSubs);
      u.removeSubs(removedSubArr);
      if (removedSubArr[0] || newSubs[0]) {
        ServerEndpoints.saveUser(u);
      }
    }
  }
  return u;
}

export async function loginAndSet(setUser, setUserSettings, doSync) {
  console.log("doSync")
  console.log(doSync)
  let res = await ServerEndpoints.loginToBackend();
  console.log("GOT RES")
  console.log(res)
  let u;
  if (res.status > 199 && res.status < 300) {
    u = await processUserFromServer(res, doSync);
    //TODO could be better
    setUser(prev => {
      prev.customShelfs = u.customShelfs;
      prev.googleId = u.googleId;
      prev.pictureUrl = u.pictureUrl;
      prev.username = u.username;
      prev.isDemo = false;
      return prev;
    });
    setUserSettings(prev => {
      prev.customShelfs = u.customShelfs;
      prev.googleId = u.googleId;
      prev.pictureUrl = u.pictureUrl;
      prev.username = u.username;
      prev.isDemo = false;
      return prev;
    });
  }
  return u;
}


export async function betterLogout() {
  GApiAuth.logout()
}


// window.$isCYTLogging is the global to prevent multi login attempts, default is 'false'
// could be better
export async function betterLogin(setUser, setUserSettings, doSync) {
  let antiInfLoop = 0
  
  await GApiAuth.getGoogleAuth() 

  if (GApiAuth.isHeSignedIn() && !window.$isCYTLogging) {
    window.$isCYTLogging = true
    await loginAndSet(setUser, setUserSettings, doSync)
    window.$isCYTFinshedLogging = true
  }
  else if ( GApiAuth.isHeSignedIn() && doSync){
    await loginAndSet(setUser, setUserSettings, doSync)

  }
  if (GApiAuth.isHeSignedIn() ) {
    while (!window.$isCYTFinshedLogging) {
      antiInfLoop = antiInfLoop + 500
      await sleep(500)
      if (antiInfLoop >= 13000 ) {
        console.log("Failure to login :(")
        break
      }
    }
  }
}

export function getMockUser() {
  let u = new User();
  u.googleId = "123-UserId";
  u.username = "Demo Profile";
  u.pictureUrl = Pic;
  u.isDemo = true;

  //  /////////////////////////////////////////////////////////////
  //  ////////////             Movies & Stiff             /////////
  //  /////////////////////////////////////////////////////////////
  
  let uSubM0 = new Subscription();
  uSubM0.channelName = "Movieclips Trailers";
  uSubM0.channelId = "UCi8e0iOVk1fEOogdfu4YgfA";
  uSubM0.filter.channelId = "UCi8e0iOVk1fEOogdfu4YgfA";

  let uSubM = new Subscription();
  uSubM.channelName = "Vanity Fair";
  uSubM.channelId = "UCIsbLox_y9dCIMLd8tdC6qg";
  uSubM.filter.channelId = "UCIsbLox_y9dCIMLd8tdC6qg";

  let uSubM2 = new Subscription();
  uSubM2.channelName = "Chris Stuckmann";
  uSubM2.channelId = "UCCqEeDAUf4Mg0GgEN658tkA";
  uSubM2.filter.channelId = "UCCqEeDAUf4Mg0GgEN658tkA";

  let uSubM3 = new Subscription();
  uSubM3.channelName = "Jeremy Jahns";
  uSubM3.channelId = "UC7v3-2K1N84V67IF-WTRG-Q";
  uSubM3.filter.channelId = "UC7v3-2K1N84V67IF-WTRG-Q";

  


  // let uSubM4 = new Subscription();
  // uSubM4.channelName = "Flashback FM";
  // uSubM4.channelId = "UC-GAhNmY6bkuuRPUSaRI_oQ";
  // uSubM4.filter.channelId = "UC-GAhNmY6bkuuRPUSaRI_oQ";

  let uSubM4b = new Subscription();
  uSubM4b.channelName = "ONE Media";
  uSubM4b.channelId = "UCzcRQ3vRNr6fJ1A9rqFn7QA";
  uSubM4b.filter.channelId = "UCzcRQ3vRNr6fJ1A9rqFn7QA";


  let cShelfM = new CustomShelf();
  cShelfM.title = "Movies and stuff";
  cShelfM.fewSubs.push(uSubM, uSubM2, uSubM3, uSubM0);
  cShelfM.isSorted = true;
  u.customShelfs.push(cShelfM);
  
  // ///////////////////////////////////////////////////////////
  // //////////             Cool stuff             /////////////
  // ///////////////////////////////////////////////////////////

  let uSubStuff = new Subscription();
  uSubStuff.channelName = "The Atlantic";
  uSubStuff.channelId = "UCK0z0_5uL7mb9IjntOKi5XQ";
  uSubStuff.filter.channelId = "UCK0z0_5uL7mb9IjntOKi5XQ";

  let uSubStuff2 = new Subscription();
  uSubStuff2.channelName = "Vox";
  uSubStuff2.channelId = "UCLXo7UDZvByw2ixzpQCufnA";
  uSubStuff2.filter.channelId = "UCLXo7UDZvByw2ixzpQCufnA";

  let uSubStuff3 = new Subscription();
  uSubStuff3.channelName = "Dude Perfect";
  uSubStuff3.channelId = "UCRijo3ddMTht_IHyNSNXpNQ";
  uSubStuff3.filter.channelId = "UCRijo3ddMTht_IHyNSNXpNQ";

  let cShelfCool = new CustomShelf();
  cShelfCool.title = "Cool stuff";
  cShelfCool.fewSubs.push(uSubStuff, uSubStuff2, uSubStuff3);
  cShelfCool.isSorted = true;
  u.customShelfs.push(cShelfCool);
  
  // ///////////////////////////////////////////////////////////
  // //////////             Some Music              /////////////
  // ///////////////////////////////////////////////////////////

  // let uSubMusic5 = new Subscription()
  // uSubMusic5.channelName = 'Shine Music'
  // uSubMusic5.channelId = 'UCz24srq31kr8CyNT-oN1Dqw';
  // uSubMusic5.filter.channelId = "UCz24srq31kr8CyNT-oN1Dqw";

  // let uSubMusic6 = new Subscription()
  // uSubMusic6.channelName = 'Clap Your Hands'
  // uSubMusic6.channelId = 'UC5wbJ7XVrANgnq6M-Rgy8GQ';
  // uSubMusic6.filter.channelId = "UC5wbJ7XVrANgnq6M-Rgy8GQ";

  let uSubMusic3 = new Subscription();
  uSubMusic3.channelName = "COLORS";
  uSubMusic3.channelId = "UC2Qw1dzXDBAZPwS7zm37g8g";
  uSubMusic3.filter.channelId = "UC2Qw1dzXDBAZPwS7zm37g8g";

  let uSubMusicY = new Subscription();
  uSubMusicY.channelName = "Selected.";
  uSubMusicY.channelId = "UCFZ75Bg73NJnJgmeUX9l62g";
  uSubMusicY.filter.channelId = "UCFZ75Bg73NJnJgmeUX9l62g";

  // let uSubMusic7 = new Subscription()
  // uSubMusic7.channelName = 'Defected Records'
  // uSubMusic7.channelId = 'UCnOxaDXBiBXg9Nn9hKWu6aw';
  // uSubMusic7.filter.channelId = "UCnOxaDXBiBXg9Nn9hKWu6aw";

  // let uSubMusic8 = new Subscription()
  // uSubMusic8.channelName = "Tommy Boy"
  // uSubMusic8.channelId = "UCnSR7_Oq-MdsZxfogsfk-Ug";
  // uSubMusic8.filter.channelId = "UCnSR7_Oq-MdsZxfogsfk-Ug";

  let uSubMusicX2 = new Subscription();
  uSubMusicX2.channelName = "Touché";
  uSubMusicX2.channelId = "UCpSMOn2qG_smhVFhInoxaVg";
  uSubMusicX2.filter.channelId = "UCpSMOn2qG_smhVFhInoxaVg";

  let uSubMusicX3 = new Subscription();
  uSubMusicX3.channelName = "Majestic Casual";
  uSubMusicX3.channelId = "UCXIyz409s7bNWVcM-vjfdVA";
  uSubMusicX3.filter.channelId = "UCXIyz409s7bNWVcM-vjfdVA";

  let uSubMusicX4 = new Subscription();
  uSubMusicX4.channelName = "MrSuicideSheep";
  uSubMusicX4.channelId = "UC5nc_ZtjKW1htCVZVRxlQAQ";
  uSubMusicX4.filter.channelId = "UC5nc_ZtjKW1htCVZVRxlQAQ";

  let cShelfMusic2 = new CustomShelf();
  cShelfMusic2.title = "Some music";
  cShelfMusic2.fewSubs.push(
    uSubMusic3,
    uSubMusicY,
    uSubMusicX2,
    uSubMusicX3,
    uSubMusicX4
  );
  cShelfMusic2.isSorted = true;
  u.customShelfs.push(cShelfMusic2);

  // let uSubMusic4 = new Subscription()
  // uSubMusic4.channelName = 'NPR Music'
  // uSubMusic4.channelId = 'UC4eYXhJI4-7wSWc8UNRwD4A';
  // uSubMusic4.filter.channelId = "UC4eYXhJI4-7wSWc8UNRwD4A";
  // uSubMusic4.filter.channelId = "UC2Qw1dzXDBAZPwS7zm37g8g";


  // ///////////////////////////////////////////////////////////
  // //////////             KPOP              /////////////
  // ///////////////////////////////////////////////////////////

  let uSubKpop = new Subscription();
  uSubKpop.channelName = "jypentertainment";
  uSubKpop.channelId = "UCaO6TYtlC8U5ttz62hTrZgg";
  uSubKpop.filter.channelId = "UCaO6TYtlC8U5ttz62hTrZgg";

  let uSubKpop2 = new Subscription();
  uSubKpop2.channelName = "KOZ Entertainment";
  uSubKpop2.channelId = "UCTk7wEWFxDGd1p1BUnUBINg";
  uSubKpop2.filter.channelId = "UCTk7wEWFxDGd1p1BUnUBINg";

  let uSubKpop3 = new Subscription();
  uSubKpop3.channelName = "Big Hit Labels";
  uSubKpop3.channelId = "UC3IZKseVpdzPSBaWxBxundA";
  uSubKpop3.filter.minDuration = "2";
  uSubKpop3.filter.maxDuration = "6";
  uSubKpop3.filter.channelId = "UC3IZKseVpdzPSBaWxBxundA";

  let uSubKpop4 = new Subscription();
  uSubKpop4.channelName = "SMTOWN";
  uSubKpop4.channelId = "UCEf_Bc-KVd7onSeifS3py9g";
  uSubKpop4.filter.minDuration = "2";
  uSubKpop4.filter.maxDuration = "6";
  uSubKpop4.filter.channelId = "UCEf_Bc-KVd7onSeifS3py9g";

  let cShelfK = new CustomShelf();
  cShelfK.title = "K POP";
  cShelfK.fewSubs.push(uSubKpop, uSubKpop2, uSubKpop3, uSubKpop4);
  cShelfK.isSorted = true;
  u.customShelfs.push(cShelfK);

  // ///////////////////////////////////////////////////////////
  // //////////             Music             /////////////
  // ///////////////////////////////////////////////////////////

  // let uSubMusic = new Subscription()
  // uSubMusic.channelName = 'Jhené Aiko'
  // uSubMusic.channelId = 'UCcHl3bzvpMh74okqhV5UPOw';
  // uSubMusic.filter.channelId = "UCcHl3bzvpMh74okqhV5UPOw";

  // let uSubMusic0 = new Subscription()
  // uSubMusic0.channelName = 'thinkcommon'
  // uSubMusic0.channelId = 'UCBGDlQIq1hx5nSTIpWTsGAQ';
  // uSubMusic0.filter.channelId = "UCBGDlQIq1hx5nSTIpWTsGAQ";

  // let uSubMusic2 = new Subscription()
  // uSubMusic2.channelName = 'Mahalia'
  // uSubMusic2.channelId = 'UCOFDSTbv-hHT32ytVappaYg';
  // uSubMusic2.filter.channelId = "UCcHl3bzvpMh74okqhV5UPOw";

  // let uSubMusicX = new Subscription()
  // uSubMusicX.channelName = 'Mariah Carey'
  // uSubMusicX.channelId = 'UCurpiDXSkcUbgdMwHNZkrCg';
  // uSubMusicX.filter.channelId = "UCurpiDXSkcUbgdMwHNZkrCg";

  // let cShelfMusic = new CustomShelf()
  // cShelfMusic.title = "Music"
  // //cShelfMusic.fewSubs.push(uSubMusic, uSubMusic2, uSubMusic3, uSubMusic4)
  // cShelfMusic.fewSubs.push(uSubMusic0, uSubMusic2,  uSubMusicX)
  // cShelfMusic.isSorted = true;
  // u.customShelfs.push(cShelfMusic)

  // ///////////////////////////////////////////////////////////
  // //////////             Late Night             /////////
  // ///////////////////////////////////////////////////////////

  // let uSubNight = new Subscription();
  // uSubNight.channelName = "LastWeekTonight";
  // uSubNight.channelId = "UC3XTzVzaHQEd30rQbuvCtTQ";
  // uSubNight.filter.channelId = "UC3XTzVzaHQEd30rQbuvCtTQ";

  // let uSubNight2 = new Subscription();
  // uSubNight2.channelName = "Real Time with Bill Maher";
  // uSubNight2.channelId = "UCy6kyFxaMqGtpE3pQTflK8A";
  // uSubNight2.filter.channelId = "UCy6kyFxaMqGtpE3pQTflK8A";

  // let uSubNight3 = new Subscription();
  // uSubNight3.channelName = "The Daily Show with Trevor Noah";
  // uSubNight3.channelId = "UCwWhs_6x42TyRM4Wstoq8HA";
  // uSubNight3.filter.channelId = "UCwWhs_6x42TyRM4Wstoq8HA";

  // let cShelfNight = new CustomShelf();
  // cShelfNight.title = "Late night talks shows";
  // cShelfNight.fewSubs.push(uSubNight, uSubNight2, uSubNight3);
  // cShelfNight.isSorted = true;

  // u.customShelfs.push(cShelfNight);

  // ///////////////////////////////////////////////////////////
  // //////////             Scince N stuff             /////////
  // ///////////////////////////////////////////////////////////

  let uSubSci = new Subscription();
  uSubSci.channelName = "3Blue1Brown";
  uSubSci.channelId = "UCYO_jab_esuFRV4b17AJtAw";
  uSubSci.filter.channelId = "UCYO_jab_esuFRV4b17AJtAw";

  let uSubSci2 = new Subscription();
  uSubSci2.channelName = "Vsauce";
  uSubSci2.channelId = "UC6nSFpj9HTCZ5t-N3Rm3-HA";
  uSubSci2.filter.channelId = "UC6nSFpj9HTCZ5t-N3Rm3-HA";

  let uSubSci3 = new Subscription();
  uSubSci3.channelName = "PBS Space Time";
  uSubSci3.channelId = "UC7_gcs09iThXybpVgjHZ_7g";
  uSubSci3.filter.channelId = "UC7_gcs09iThXybpVgjHZ_7g";

  let uSubSci4 = new Subscription();
  uSubSci4.channelName = "PBS Eons";
  uSubSci4.channelId = "UCzR-rom72PHN9Zg7RML9EbA";
  uSubSci4.filter.channelId = "UCzR-rom72PHN9Zg7RML9EbA";

  let uSubSci5 = new Subscription();
  uSubSci5.channelName = "Two Minute Papers";
  uSubSci5.channelId = "UCbfYPyITQ-7l4upoX8nvctg";
  uSubSci5.filter.channelId = "UCbfYPyITQ-7l4upoX8nvctg";

  let cShelfSci = new CustomShelf();
  cShelfSci.title = "Science N Stuff";
  cShelfSci.fewSubs.push(uSubSci, uSubSci2, uSubSci3, uSubSci4, uSubSci5);
  cShelfSci.isSorted = true;
  u.customShelfs.push(cShelfSci);

  // ///////////////////////////////////////////////////////////
  // //////////             Longer stuff              /////////////
  // ///////////////////////////////////////////////////////////

  let subTalk = new Subscription();
  subTalk.channelName = "FRONTLINE PBS | Official";
  subTalk.channelId = "UC3ScyryU9Oy9Wse3a8OAmYQ";
  subTalk.filter.channelId = "UC3ScyryU9Oy9Wse3a8OAmYQ";

  let subTalk2 = new Subscription();
  subTalk2.channelName = "Eric Weinstein";
  subTalk2.channelId = "UCR85PW_B_7_Aisx5vNS7Gjw";
  subTalk2.filter.channelId = "UCR85PW_B_7_Aisx5vNS7Gjw";

  let subTalk3 = new Subscription();
  subTalk3.channelName = "PowerfulJRE";
  subTalk3.channelId = "UCzQUP1qoWDoEbmsQxvdjxgQ";
  subTalk3.filter.channelId = "UCzQUP1qoWDoEbmsQxvdjxgQ";

  let subTalk4 = new Subscription();
  subTalk4.channelName = "The Ringer";
  subTalk4.channelId = "UCT83YP07yVuaH9J19YABhlw";
  subTalk4.filter.minDuration = "45";
  subTalk4.filter.channelId = "UCT83YP07yVuaH9J19YABhlw";

  // let subTalk4 = new Subscription();
  // subTalk4.channelName = "The Rubin Report";
  // subTalk4.channelId = "UCJdKr0Bgd_5saZYqLCa9mng";
  // subTalk4.filter.channelId = "UCJdKr0Bgd_5saZYqLCa9mng";

  // let uSub6 = new Subscription()
  // uSub6.channelName = 'Asian Boss'
  // uSub6.channelId = 'UC2-_WWPT_124iN6jiym4fOw';
  // uSub6.filter.channelId = "UC2-_WWPT_124iN6jiym4fOw";

  let subTalk5 = new Subscription();
  subTalk5.channelName = "TED";
  subTalk5.channelId = "UCAuUUnT6oDeKwE6v1NGQxug";
  subTalk5.filter.channelId = "UCAuUUnT6oDeKwE6v1NGQxug";

  let cShelfTalk = new CustomShelf();
  cShelfTalk.title = "Talks, podcasts, lectures";
  cShelfTalk.fewSubs.push(subTalk, subTalk2, subTalk3, subTalk4, subTalk5);
  cShelfTalk.isSorted = true;
  u.customShelfs.push(cShelfTalk);

  // ///////////////////////////////////////////////////////////
  // //////////             new & politics             /////////////
  // ///////////////////////////////////////////////////////////

  // let sub1 = new Subscription()
  // sub1.channelName = "The Hill"
  // sub1.channelId = "UCPWXiRWZ29zrxPFIQT7eHSA";
  // sub1.filter.minDuration = "1"
  // sub1.filter.maxDuration = "0.5"
  // sub1.filter.channelId = "UCPWXiRWZ29zrxPFIQT7eHSA"

  let sub1A = new Subscription();
  sub1A.channelName = "NBC News";
  sub1A.channelId = "UCeY0bbntWzzVIaj2z3QigXg";
  sub1A.filter.minDuration = "10";
  sub1A.filter.channelId = "UCeY0bbntWzzVIaj2z3QigXg";

  let sub1B = new Subscription();
  sub1B.channelName = "CNN";
  sub1B.channelId = "UCupvZG-5ko_eiXAupbDfxWw";
  sub1B.filter.minDuration = "2";
  sub1B.filter.maxDuration = "8";
  sub1B.filter.channelId = "UCupvZG-5ko_eiXAupbDfxWw";

  let sub1C = new Subscription();
  sub1C.channelName = "Fox News";
  sub1C.channelId = "UCXIJgqnII2ZOINSWNOGFThA";
  sub1C.filter.minDuration = "6";
  sub1C.filter.channelId = "UCXIJgqnII2ZOINSWNOGFThA";

  let cShelfNP = new CustomShelf();
  cShelfNP.title = "News";
  cShelfNP.fewSubs.push(sub1A, sub1B, sub1C);
  cShelfNP.isSorted = true;
  u.customShelfs.push(cShelfNP);

  // ///////////////////////////////////////////////////////////
  // //////////             Hot Babes              /////////////
  // ///////////////////////////////////////////////////////////

  // let subHot = new Subscription()
  // subHot.channelName = "Video Box"
  // subHot.channelId = "UCeMFHOzX9MDWbr-pu2WdmVw";
  // subHot.filter.channelId = "UCeMFHOzX9MDWbr-pu2WdmVw"

  // let subHot2 = new Subscription()
  // subHot2.channelName = "mineralblue"
  // subHot2.channelId = "UC3IngBBUGFUduHp-7haK1lw";
  // subHot2.filter.channelId = "UC3IngBBUGFUduHp-7haK1lw"

  // let subHot3 = new Subscription()
  // subHot3.channelName = "Twitche"
  // subHot3.channelId = "UC97czRRaA5w-THZFIL-uk3Q"
  // subHot3.filter.channelId = "UC97czRRaA5w-THZFIL-uk3Q"

  // let subHot4 = new Subscription()
  // subHot4.channelName = "Perfect Beauty"
  // subHot4.channelId = "UCJ7sCYUdt15io_cyUX8zsLA"
  // subHot4.filter.channelId = "UCJ7sCYUdt15io_cyUX8zsLA"

  // let cShelfHot = new CustomShelf()
  // cShelfHot.title = "Hot Babes"
  // cShelfHot.fewSubs.push(subHot, subHot2, subHot3, subHot4)
  // cShelfHot.isSorted = true;
  // u.customShelfs.push(cShelfHot)

  // ///////////////////////////////////////////////////////////
  // //////////             ??????????????             /////////
  // ///////////////////////////////////////////////////////////

  let uSubx = new Subscription();
  uSubx.channelName = "Google Developers";
  uSubx.channelId = "UC_x5XG1OV2P6uZZ5FSM9Ttw";
  uSubx.filter.channelId = "UC_x5XG1OV2P6uZZ5FSM9Ttw";

  let uSub1 = new Subscription();
  uSub1.channelName = "Key & Peele";
  uSub1.channelId = "UCdN4aXTrHAtfgbVG9HjBmxQ";
  uSub1.filter.channelId = "UCdN4aXTrHAtfgbVG9HjBmxQ";

  let cShelf1 = new CustomShelf();
  cShelf1.title = "Key & Peele";
  cShelf1.fewSubs.push(uSub1);
  cShelf1.isSorted = false;

  // let cShelf2 = new CustomShelf()
  // cShelf2.title = "Maddox"
  // cShelf2.fewSubs.push(uSub5)
  // cShelf2.isSorted = false;

  let cShelf3 = new CustomShelf();
  cShelf3.title = "Google Developers";
  cShelf3.fewSubs.push(uSubx);
  cShelf3.isSorted = false;

  // let cShelf3unB = new CustomShelf()
  // cShelf3unB.title = "Tommy Boy"
  // cShelf3unB.fewSubs.push(  uSub2)
  // cShelf3unB.isSorted = false;

  u.customShelfs.push(cShelf1);
  //u.customShelfs.push(cShelf2)
  u.customShelfs.push(cShelf3);

  return u;

  // ///////////////////////////////////////////////////////////
  // //////////             Playlist              /////////////
  // ///////////////////////////////////////////////////////////

  // let uSubStuff = new Subscription()
  // uSubStuff.channelName = 'RnB Motion'
  // uSubStuff.channelId = 'UC17pt_Hz-hrpgtX8QS7zdPg';
  // uSubStuff.filter.channelId = "UC17pt_Hz-hrpgtX8QS7zdPg";

  // let uSubStuff = new Subscription()
  // uSubStuff.channelName = 'Club Hit'
  // uSubStuff.channelId = 'UC3a58O8ECq7ZB3i-fXtNxKg';
  // uSubStuff.filter.channelId = "UC3a58O8ECq7ZB3i-fXtNxKg";

  // let uSubStuff = new Subscription()
  // uSubStuff.channelName = 'Top Dance Music'
  // uSubStuff.channelId = 'UCrx9ufBK67m6VeCkfj8syWw';
  // uSubStuff.filter.channelId = "UCrx9ufBK67m6VeCkfj8syWw";

  // let sub3 = new Subscription()
  // sub3.channelName = "Deep Beat"
  // sub3.channelId = "UC0CeYMTh57zSsbUKhsyOPfw";
  // sub3.filter.channelId = "UC0CeYMTh57zSsbUKhsyOPfw"
}
