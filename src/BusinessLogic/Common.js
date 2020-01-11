import { Subscription } from '../Classes/Subscription';
import { User, CustomShelf } from '../Classes/User';
import * as ServerEndpoints from '../HttpRequests/ServerEndpoints';
import * as ytLogic                     from '../BusinessLogic/ytLogic.js';

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function loginAndSet(setUser, setUserSettings) {
  console.log("Logged in: Should be doing fetch to server")
  let res = await ServerEndpoints.loginToBackend();
  if (res.status > 199 && res.status < 300) {
    console.log('Recieved user from server: ', res.status)
    let u = await processUserFromServer(res)
    //TODO could be better
    setUser(prev => {
      prev.customShelfs = u.customShelfs
      prev.googleId = u.googleId
      prev.pictureUrl = u.pictureUrl
      prev.username = u.username
      prev.isDemo = false
      return prev
    })
    setUserSettings(prev => {
      prev.customShelfs = u.customShelfs
      prev.googleId = u.googleId
      prev.pictureUrl = u.pictureUrl
      prev.username = u.username
      prev.isDemo = false
      return prev
    })
    return u
  }
}


export async function processUserFromServer(res) {

  let u = new User()
  let subzPromise = ytLogic.getAllSubs()

  if (res.data.customShelfs == null) { // implies new user
    u.initNewUser(await subzPromise, res.data)
    ServerEndpoints.saveUser(u)
  }
  else {
    u.customShelfs = res.data.customShelfs
    u.googleId = res.data.googleId
    u.pictureUrl = res.data.pictureUrl
    u.username = res.data.username
    u.isDemo = false

    //Below: Sync subs from the User's YT account and this app's database.
    let newSubs = checkForNewSubs(await subzPromise, res.data)
    let removedSubArr = checkForRemovedSubs(await subzPromise, res.data)
    u.addArrayOfSubs(newSubs)
    u.removeSubs(removedSubArr)
    if (removedSubArr[0] || newSubs[0]) {
      ServerEndpoints.saveUser(u)
    }
    
    console.log('newSubs')
    console.log('remvoedSubs')
    console.log(newSubs)
    console.log(removedSubArr)
  }
  return u
}




  //Goes through every sub from the backend, if a sub does not match any subs from YT, then we found a sub that was removed from YT user.
  function checkForRemovedSubs(subsFromYt, subsFromBackend) {
  
    let removedSubs = []
    let doesMatches = false;
    let allBackendSubz = []
    subsFromBackend.customShelfs.map(sh => {
      allBackendSubz.push(...sh.fewSubs)
    })
    for (let backS of allBackendSubz) {
      doesMatches = false
      for (let ytS of subsFromYt) {
        if (ytS.snippet.resourceId.channelId == backS.channelId) {
          doesMatches = true
          break
        }
      }
      //if this sub from backend doesnt exist in subsFrom Yt, then it was removed
      if (!doesMatches) {
        removedSubs.push(backS)
      }
    }

    return removedSubs
  }

  //TODO could be cleaner, pretty confusing.
  //Goes through every sub from YT, if a sub does not match any subs from the backend, then we found a new sub.
  function checkForNewSubs(subsFromYt, subsFromBackend) {     
    let newSubs = []
    for (let ytS of subsFromYt) {
      let doesMatches = false;
      for (let uSh of subsFromBackend.customShelfs) {
        for (let sub of uSh.fewSubs) {
          if (ytS.snippet.resourceId.channelId == sub.channelId) {
            doesMatches = true;
            break
          }
        }
      }
      if (doesMatches == false) {
        newSubs.push(ytS)
      }
    }
    return newSubs
  }






export function getMockUser() {
  let sub1 = new Subscription()
  sub1.channelName = "The Hill"
  sub1.channelId = "UCPWXiRWZ29zrxPFIQT7eHSA";
  sub1.filter.minDuration = "1"
  sub1.filter.maxDuration = "0.5"
  sub1.filter.channelId = "UCPWXiRWZ29zrxPFIQT7eHSA"

  let sub1B = new Subscription()
  sub1B.channelName = "CNN"
  sub1B.channelId = "UCupvZG-5ko_eiXAupbDfxWw";
  sub1B.filter.minDuration = "2"
  sub1B.filter.maxDuration = "8"
  sub1B.filter.channelId = "UCupvZG-5ko_eiXAupbDfxWw"

  let sub1C = new Subscription()
  sub1C.channelName = "Fox News"
  sub1C.channelId = "UCXIJgqnII2ZOINSWNOGFThA";
  sub1C.filter.minDuration = "6"
  sub1C.filter.channelId = "UCXIJgqnII2ZOINSWNOGFThA"

  let sub2 = new Subscription()
  sub2.channelName = "Crunkmastaflexx"
  sub2.channelId = "UCA-8h5uCH5RE-1r6gskkbTw";
  sub2.filter.channelId = "UCA-8h5uCH5RE-1r6gskkbTw"

  let sub3 = new Subscription()
  sub3.channelName = "Deep Beat"
  sub3.channelId = "UC0CeYMTh57zSsbUKhsyOPfw";
  sub3.filter.channelId = "UC0CeYMTh57zSsbUKhsyOPfw"

  let sub4 = new Subscription()
  sub4.channelName = "Video Box"
  sub4.channelId = "UCeMFHOzX9MDWbr-pu2WdmVw";
  sub4.filter.channelId = "UCeMFHOzX9MDWbr-pu2WdmVw"

  let sub5 = new Subscription()
  sub5.channelName = "mineralblue"
  sub5.channelId = "UC3IngBBUGFUduHp-7haK1lw";
  sub5.filter.channelId = "UC3IngBBUGFUduHp-7haK1lw"

  let sub6 = new Subscription()
  sub6.channelName = "SMTOWN"
  sub6.channelId = "UCEf_Bc-KVd7onSeifS3py9g";
  sub6.filter.minDuration = "2"
  sub6.filter.maxDuration = "6"
  sub6.filter.channelId = "UCEf_Bc-KVd7onSeifS3py9g"

  let uSub1 = new Subscription()
  uSub1.channelName = "Key & Peele"
  uSub1.channelId = "UCdN4aXTrHAtfgbVG9HjBmxQ";
  uSub1.filter.channelId = "UCdN4aXTrHAtfgbVG9HjBmxQ";

  let uSub2 = new Subscription()
  uSub2.channelName = "Tommy Boy"
  uSub2.channelId = "UCnSR7_Oq-MdsZxfogsfk-Ug";
  uSub2.filter.channelId = "UCnSR7_Oq-MdsZxfogsfk-Ug";

  let uSub3 = new Subscription()
  uSub3.channelName = "FRONTLINE PBS | Official"
  uSub3.channelId = "UC3ScyryU9Oy9Wse3a8OAmYQ";
  uSub3.filter.channelId = "UC3ScyryU9Oy9Wse3a8OAmYQ";

  
  let uSub4 = new Subscription()
  uSub4.channelName = 'Google Zeitgeist'
  uSub4.channelId = 'UC522meTsOjFWjSdLLrEMMBA';
  uSub4.filter.channelId = "UC522meTsOjFWjSdLLrEMMBA";

  let uSub5 = new Subscription()
  uSub5.channelName = 'Maddox'
  uSub5.channelId = 'UC_c1gdsojLxBGkgzS0NsvUw';
  uSub5.filter.channelId = "UC_c1gdsojLxBGkgzS0NsvUw";

  let uSub6 = new Subscription()
  uSub6.channelName = 'Asian Boss'
  uSub6.channelId = 'UC2-_WWPT_124iN6jiym4fOw';
  uSub6.filter.channelId = "UC2-_WWPT_124iN6jiym4fOw";

  let uSub7 = new Subscription()
  uSub7.channelName = 'TED'
  uSub7.channelId = 'UCAuUUnT6oDeKwE6v1NGQxug';
  uSub7.filter.channelId = "UCAuUUnT6oDeKwE6v1NGQxug";

  let u = new User()
  u.googleId = "123-UserId";
  u.username = "Richard Simmons"  
  u.isDemo = true;
  
  let cShelf1 = new CustomShelf()
  cShelf1.title = "News (Shelf #1)"
  cShelf1.fewSubs.push(sub1, sub1B, sub1C)
  cShelf1.isSorted = true;

  let cShelf2 = new CustomShelf()
  cShelf2.title = "Music (Shelf #2)"
  cShelf2.fewSubs.push(sub3, sub6)
  cShelf2.isSorted = true;

  let cShelf4un = new CustomShelf()
  cShelf4un.title = "Talks & stuff (Shelf #4)"
  cShelf4un.fewSubs.push( uSub7, uSub4)
  cShelf4un.isSorted = true;
  
  let cShelf5un = new CustomShelf()
  cShelf5un.title = "Shelf #5"
  cShelf5un.fewSubs.push(uSub6 )
  cShelf5un.isSorted = true;

  let cShelf6un = new CustomShelf()
  cShelf6un.title = "Shelf #6"
  cShelf6un.fewSubs.push( uSub5)
  cShelf6un.isSorted = true;

  let cShelf3unA = new CustomShelf()
  cShelf3unA.title = "Key & Peele"
  cShelf3unA.fewSubs.push( uSub1)
  cShelf3unA.isSorted = false;

  let cShelf3unB = new CustomShelf()
  cShelf3unB.title = "Tommy Boy"
  cShelf3unB.fewSubs.push(  uSub2)
  cShelf3unB.isSorted = false;

  let cShelf3unC = new CustomShelf()
  cShelf3unC.title = "FRONTLINE PBS | Official"
  cShelf3unC.fewSubs.push( uSub3)
  cShelf3unC.isSorted = false;

  u.customShelfs.push(cShelf1)
  u.customShelfs.push(cShelf2)
  u.customShelfs.push(cShelf3unA)
  u.customShelfs.push(cShelf3unB)
  u.customShelfs.push(cShelf3unC)
  u.customShelfs.push(cShelf4un)
  u.customShelfs.push(cShelf5un)
  u.customShelfs.push(cShelf6un)
  return u;
}