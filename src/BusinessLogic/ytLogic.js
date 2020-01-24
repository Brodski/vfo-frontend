import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';


import * as moment from 'moment';
import * as youtubeApi from "../HttpRequests/youtubeApi";
import  * as GApiAuth from '../HttpRequests/GApiAuth';
import * as ServerEndpoints from '../HttpRequests/ServerEndpoints';
import { User } from '../Classes/User';
import * as Common from '../BusinessLogic/Common.js';

/* Github: JS Client https://github.com/google/google-api-javascript-client
* 
* MAIN https://developers.google.com/youtube/v3/getting-started
*        OAUTH https://developers.google.com/youtube/v3/libraries
*        JS API https://github.com/google/google-api-javascript-client
* 
* ACTUAL JS DOCS. gapi objects & methods: https://github.com/google/google-api-javascript-client/blob/master/docs/reference.md
*  BIGGER DOCS:           https://developers.google.com/identity/sign-in/web/reference
* 
*  Get profile info (id): https://developers.google.com/identity/sign-in/web/people
* 
* OAuth https://developers.google.com/youtube/v3/guides/authentication
* 
*  FIELD FILTER GAPI: https://developers.google.com/youtube/v3/getting-started
*     URL: https://www.googleapis.com/youtube/v3/videos?id=7lCDEYXw3mM&key=YOUR_API_KEY
*          &part=snippet, statistics & fields=items(id,snippet,statistics)
* 
*  Pagination: https://developers.google.com/youtube/v3/guides/implementation/pagination
*  next page token
* 
* Scope https://developers.google.com/identity/protocols/googlescopes
*  Serverside Auth https://developers.google.com/identity/protocols/OAuth2WebServer
*  Serverside Auth https://developers.google.com/identity/sign-in/web/server-side-flow
* 
* if you specify both, async takes precedence on modern browsers, while older browsers 
*  that support defer but not async will fallback to defer.
* https://flaviocopes.com/javascript-async-defer/
*/


// Returns - shelf[x].subscription[y].activity[z]
export async function getActivitiesShelfs(shelfs) {
  const allShelfsPromises =[]
  shelfs.forEach( sh => {
    const shPromises = sh.fewSubs.map(sub => youtubeApi._getActivities(sub.channelId))
    allShelfsPromises.push(shPromises)
  })
  // for (let sh of shelfs) {
  //   const shPromises = sh.fewSubs.map(sub => youtubeApi._getActivities(sub.channelId))
  //   allShelfsPromises.push(shPromises)
  // }
  // return await Promise.all( allShelfsPromises.map( shProm => Promise.all(shProm)) )  // https://stackoverflow.com/questions/36094865/how-to-do-promise-all-for-array-of-array-of-promises
  return Promise.all( allShelfsPromises.map( shProm => Promise.all(shProm)) )  // https://stackoverflow.com/questions/36094865/how-to-do-promise-all-for-array-of-array-of-promises
}

 
export async function hackHelper() {
  let count = 1
  let isReady  = !GApiAuth.checkAll();
  while ( isReady ) {
    console.log('Hack Helper: Logged out?: ' + isReady + ' - ' + count)
    await Common.sleep(100 * count)
    count = count + 1
    if (count > 40) {
      count = count * 2
      console.log("Hack Helper: Something went wrong :(  " + count)
    }
    isReady = !GApiAuth.checkAll()
  }
}
// export async function loginAndSet(setUser, setUserSettings) {
//  console.log("Logged in: Should be doing fetch to server")
//  let res = await ServerEndpoints.loginToBackend();
//  if (res.status > 199 && res.status < 300) {
//    console.log('Recieved user from server: ', res.status)
//    let u = await processUserFromServer(res)
//    //TODO could be better
//    setUser(prev => {
//      prev.customShelfs = u.customShelfs
//      prev.googleId = u.googleId
//      prev.pictureUrl = u.pictureUrl
//      prev.username = u.username
//      prev.isDemo = false
//      return prev
//    })
//    setUserSettings(prev => {
//      prev.customShelfs = u.customShelfs
//      prev.googleId = u.googleId
//      prev.pictureUrl = u.pictureUrl
//      prev.username = u.username
//      prev.isDemo = false
//      return prev
//    })
//    return u
//  }
// }

  
// export async function processUserFromServer(res) {

//  let u = new User()
//  let subzPromise = getAllSubs()

//  if (res.data.customShelfs == null) { // implies new user
//    u.initNewUser(await subzPromise, res.data)
//    ServerEndpoints.saveUser(u)
//  }
//  else {
//    u.customShelfs = res.data.customShelfs
//    u.googleId = res.data.googleId
//    u.pictureUrl = res.data.pictureUrl
//    u.username = res.data.username
//    u.isDemo = false

//    //Below: Sync subs from the User's YT account and this app's database.
//    let newSubs = checkForNewSubs(await subzPromise, res.data)
//    let removedSubArr = checkForRemovedSubs(await subzPromise, res.data)
//    u.addArrayOfSubs(newSubs)
//    u.removeSubs(removedSubArr)
//    if (removedSubArr[0] || newSubs[0]) {
//      ServerEndpoints.saveUser(u)
//    }
    
//    console.log('newSubs')
//    console.log('remvoedSubs')
//    console.log(newSubs)
//    console.log(removedSubArr)
//  }
//  return u
// }
/*
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
*/
export async function getAllSubs() {
  let response = await youtubeApi._getThisUsersSubs()
  if (response.status < 200 || response.status > 299) {
    console.log("Error in response :( Status code: ", response.status)
    return
  }
  let allSubs = response.result.items
  while (response.result.nextPageToken) {
    // Intended await. yt api can only get 50 subs per request
    // eslint-disable-next-line no-await-in-loop
    response = await youtubeApi._getThisUsersSubs(response.result.nextPageToken)
    allSubs = !allSubs ? response.result.items : allSubs.concat(response.result.items)
  }
  return allSubs
}



/* ///////////////////////////////////////////////
 * ///////////       INFORMATION      ////////////
 * ///////////////////////////////////////////////
* eachShelfsActs:
* is a array of shelfs
* [ {shelf}, {shelf}, {shelf} ]
*
* shelf:
* is a array of subscriptions
* [ {subscription}, {subscription}, {subscription}, {subscription} ]
*  
* subscription:
* is array of activities
* [ {activity}, {activity}, {activity}, {activity}, {activity}, {activity} ]

* activity (from yt):
* { 
*   contentDetails.upload.videoId
*   snippet.channelId
*   snippet.channelName 
*  }
 */

// Returns only Uploads of the channels activities
// TODO Remove the double loop, use map and filter
export function removeNonVideos(eachShelfsActs) {

  const filteredShelfs = []
  eachShelfsActs.forEach( shelf => {
    const fShelf = []
    shelf.forEach( act => {
      if (act.status < 200 || act.status > 299 ) { 
        return 
      }
      const result = act.result.items.filter( item => { 
        return item.contentDetails.upload 
      })
      fShelf.push(result)
    })
    filteredShelfs.push(fShelf)
  })
  // for (let shelf of eachShelfsActs) {
  //   let fShelf = []
  //   for (let act of shelf) {
  //     const result = act.result.items.filter((item) => { 
  //       return item.contentDetails.upload 
  //     })
  //     fShelf.push(result)
  //   }
  //   filteredShelfs.push(fShelf)
  // }
  return filteredShelfs

}

export function extractIds(shelf) {
  let ids = []
  shelf.map( act => ids.push(act.contentDetails.upload.videoId))
  return ids
}

export async function fetchVideos(shelfsVidIds) {
    const vidIdShelf_Promise = shelfsVidIds.map(sh => {
      return youtubeApi.getSomeVideos(sh)
    })
    return await Promise.all(vidIdShelf_Promise)
}

// Returns all the activies in a single array (shelf)
// Kinda like: shelf[x].Activity[z]
export function flattenShelf(shelf) {
  let bigsub = []
  shelf.map(sub => { bigsub = bigsub.concat(sub) })
  return bigsub
}

// Sort by most recent
export function sortByDate(shelf) {
  shelf.sort(function (a, b) {
    let dateA = new Date(a.snippet.publishedAt)
    let dateB = new Date(b.snippet.publishedAt)
    return dateB - dateA 
  })
  return shelf
}

// See note in Filter class
function checkDurations(filt, vidDuration) {
  let max = filt.maxDuration == "Infinity" ? Infinity : filt.maxDuration
  if (vidDuration >= filt.minDuration && vidDuration <= max) {
    return true
  }
  return false
}

// I'm sorry for this. I messed up ealier :(
export function beginFilter2(fShelfs) {
  // console.log('+++++++++++ BEGIN FILTER ++++++++++++++')
  // console.log('fShelfs')
  // console.log(fShelfs)
  // Go through every shelf's vid and find it's filter then apply it
  fShelfs.forEach( sh => {
    sh.videos.forEach( vid => {
      sh.filters.forEach( f => {
          if (f.channelId === vid.snippet.channelId) {
            const duration = moment.duration(vid.contentDetails.duration)
            const isPass = checkDurations(f, duration.asMinutes())
            if (!isPass) {
              sh.videos = sh.videos.filter( v => v.id !== vid.id)
              return            
            }
          }
        })
      })
  })
  //   for (let sh of fShelfs) {
  //     for (let vid of sh.videos) {
  //       for (let f of sh.filters) {
  //         if (f.channelId == vid.snippet.channelId) {
  //           let duration = moment.duration(vid.contentDetails.duration)
  //           let isPass = checkDurations(f, duration.asMinutes())
  //           if (!isPass) {
  //             /*
  //             console.log('+++++++++++++++++')
  //             console.log(vid.snippet.channelTitle + ' ' + vid.snippet.title)
  //             console.log(vid.id)
  //             console.log(vid)
              
  //             console.log("duration: " + duration.asMinutes())
  //             console.log('min ', f.minDuration )
  //             console.log('max ', f.maxDuration )
  //             console.log('pass? ', isPass )
  //             console.log('+++++++++++++++++') 
  //             */
  //             sh.videos = sh.videos.filter( v => v.id != vid.id)
              
  //             break
            
  //           }
  //         }
  //       }
  //     }
  // }
}

function orderdAndSplice(shelfsActs) {
    let orderedActs = shelfsActs.map(sh => {
      return sh.map(sub => {
        return this.sortByDate(sub)
      })
    })
     //A very nice print
    for (let sh of orderedActs) {
      for (let s of sh) {
        for (let v of s) {
        console.log(v.snippet.channelTitle, ' ', v.snippet.publishedAt, ' ', v.snippet.title)
        }
      }
    }
    console.log('\n\n\n\n\n\n\n\n\n ORDERED ACTS \n\n\n\n\n\n\n\n\n\n')
    console.log(orderedActs)
    return orderedActs
  }


// export function getDemoSubs(user) {
//  let isRecent = isUsedRecently(user)
//  let shelfz;
//  if (isRecent) {
//    shelfz = localStorage.getItem('demoSubs')
//    shelfz = JSON.parse(shelfz)
//    console.log(shelfz)
//  }  
//}

//export function saveToLocal(shelfs) {

//  console.log('***************************')
//  localStorage.setItem('shelfsVids', JSON.stringify(shelfs))
//  localStorage.setItem("last fetch", Date.now())
//  console.log('***************************')
//}

//export function saveDemoToLocal(shelfs) {
//  localStorage.setItem('demoSubs-sh-yt', JSON.stringify(shelfs))
//  localStorage.setItem('demoSubs-pagelength-yt', JSON.stringify(shelfs))
//  localStorage.setItem("demoSubs-time-yt", Date.now())
//}

//export function isUsedRecently(user) {
//  let fetchTime;
//  let isRecent = false;
//  let now = new Date() 
//  if (user.isDemo) {
//    fetchTime = localStorage.getItem("demoSubs-time-yt")
//  } else {
//    fetchTime = localStorage.getItem(user.fullName +'-time-yt')
//  }
//  let ms = fetchTime ? (now.getTime() - new Date(parseInt(fetchTime)).getTime()) : Infinity //Convert last fetch to ms... 0ms --> never recieved
//  if (ms < 3000 * 60) {
//    console.log("it's been under 3 minutes since")
//    isRecent = true
//  } else {
//    console.log("it's been OVERRRRR 3 minutes since")
//    isRecent = false
//  }
//  console.log(ms)

//  console.log('***************************')
//  return isRecent
//}

//export function getStorageShelfs() {
//  let shelfz = localStorage.getItem('shelfsVids')
//  shelfz = JSON.parse(shelfz)
//  console.log(shelfz)
//  return shelfz
//}

