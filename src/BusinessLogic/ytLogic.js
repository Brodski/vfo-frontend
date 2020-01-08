import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

import { Link } from "react-router-dom";
import axios from 'axios';
import { SECRET_KEYS } from '../api-key';
import * as Common from './Common.js';
import * as videoJ from '../Scratch/api_video.json';
import * as moment from 'moment';
import * as youtubeApi from "../HttpRequests/youtubeApi";
import  * as GApiAuth from '../HttpRequests/GApiAuth';
import * as ServerEndpoints from '../HttpRequests/ServerEndpoints';
import { User } from '../Classes/User';

// Github: JS Client https://github.com/google/google-api-javascript-client
//
//MAIN https://developers.google.com/youtube/v3/getting-started
//       OAUTH https://developers.google.com/youtube/v3/libraries
//       JS API https://github.com/google/google-api-javascript-client

//ACTUAL JS DOCS. gapi objects & methods: https://github.com/google/google-api-javascript-client/blob/master/docs/reference.md
// BIGGER DOCS:           https://developers.google.com/identity/sign-in/web/reference

// Get profile info (id): https://developers.google.com/identity/sign-in/web/people

//OAuth https://developers.google.com/youtube/v3/guides/authentication

/// FIELD FILTER GAPI: https://developers.google.com/youtube/v3/getting-started
//    URL: https://www.googleapis.com/youtube/v3/videos?id=7lCDEYXw3mM&key=YOUR_API_KEY
//         &part=snippet, statistics & fields=items(id,snippet,statistics)
///
// Pagination: https://developers.google.com/youtube/v3/guides/implementation/pagination
// next page token

//Scope https://developers.google.com/identity/protocols/googlescopes
// Serverside Auth https://developers.google.com/identity/protocols/OAuth2WebServer
// Serverside Auth https://developers.google.com/identity/sign-in/web/server-side-flow

//if you specify both, async takes precedence on modern browsers, while older browsers 
// that support defer but not async will fallback to defer.
//https://flaviocopes.com/javascript-async-defer/
//


// Returns array of Shelfs, each shelf is an array of subscription. Each sub is an array of activities
// Kinda like: shelf[x].subscription[y].activity[z] 
export async function getActivitiesShelfs(shelfs) {
  let allShelfs_Promises =[]
  for (let sh of shelfs) {
    const sh_Promises = sh.fewSubs.map(sub => youtubeApi._getActivities(sub.channelId))
  //  console.log('sh_Promises')
//    console.log(sh_Promises)
    allShelfs_Promises.push(sh_Promises)
  }
  return await Promise.all( allShelfs_Promises.map( shProm => Promise.all(shProm)) )  //https://stackoverflow.com/questions/36094865/how-to-do-promise-all-for-array-of-array-of-promises
    
}

export async function XXXgetActivitesOfChannels_2() {

  console.time("Subs getting")
  let allSubs = await getAllSubs()
  console.timeEnd("Subs getting")
    
  console.time("map")
  const allSubs_Promises = allSubs.map( sub =>  youtubeApi._getActivities(sub.snippet.resourceId.channelId))
  console.timeEnd("map")

  console.time("Acts getting")
  const allActivities_response = await Promise.all(allSubs_Promises)
  console.timeEnd("Acts getting")

  console.log(allSubs_Promises)
  console.log(allActivities_response)
    
    for (let act of allActivities_response) {
      console.log("---------- Activity -----------------------------------------")
//      console.log(JSON.stringify(act.result, null, 2))
    }    
  }

  
export async function processUserFromServer(res) {

  let u = new User()
  let subzPromise = getAllSubs()

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
    console.log('user after add and remove')
    console.log(u)

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
    console.log('allBackendSubz')
    console.log(allBackendSubz)

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

    console.log('remove subsFromBackend AFTER ALL THIS SHIT')
    console.log(subsFromBackend)
    console.log(subsFromBackend.customShelfs)
    console.log(removedSubs)
    return removedSubs
  }

  //TODO could be cleaner, pretty confusing.
  //Goes through every sub from YT, if a sub does not match any subs from the backend, then we found a new sub.
  function checkForNewSubs(subsFromYt, subsFromBackend) {     
    console.log('subsFromYt')
    console.log(subsFromYt)
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


export async function getAllSubs() {
  var response = await youtubeApi._getThisUsersSubs()
  if (response.status < 200 || response.status > 299) {
    console.log("Error in response :( Status code: ", response.status)
    return
  }
  let allSubs = response.result.items
  while (response.result.nextPageToken) {
    response = await youtubeApi._getThisUsersSubs(response.result.nextPageToken)
    allSubs = !allSubs ? response.result.items : allSubs.concat(response.result.items)
  }
  return allSubs

}



/* ///////////////////////////////////////////////
 * ///////////       INFORMATION      ////////////
 * ///////////////////////////////////////////////
* eachShelfsActs:
* array of shelfs
* [ {shelf}, {shelf}, {shelf} ]
* 
* 
*  shelf:
*  is array of subscriptions
*  [ {subscription}, {subscription}, {subscription}, {subscription} ]
*  
*    subscription:
*     is array of activities
*     [ {activity}, {activity}, {activity}, {activity}, {activity}, {activity} ]

*        activity (from yt):
*        { 
*         contentDetails.upload.videoId
*         snippet.channelId
*         snippet.channelName 
*        }
 */
export function removeNonVideos(eachShelfsActs) {
// TODO Remove the double loop, use map and filter
// const damnBaby = shelf.map( act => act.result.items.filter(function (item) { return item.contentDetails.upload } ))

  let filteredShelfs = []
  for (let shelf of eachShelfsActs) {
    let fShelf = []
    for (let act of shelf) {
      if (act.status < 200 || act.status > 299 ) {
          console.log("Not 200 for activity: " + act)
          continue
        }
      const result = act.result.items.filter(function (item) { return item.contentDetails.upload } )
      fShelf.push(result)

    }
    filteredShelfs.push(fShelf)
  }

  return filteredShelfs

}


export function extractIds(shelf) {

  let ids = []
  shelf.map( act => ids.push(act.contentDetails.upload.videoId))
  //console.log('miniIds')
  //console.log(miniIds)
  return ids
}

export async function requestVideosShelf(shelfsVidIds) {
    const vidIdShelf_Promise = shelfsVidIds.map(sh => {
      return youtubeApi.getSomeVideos(sh)
    })
    return await Promise.all(vidIdShelf_Promise)
}

// Returns all the activies in a single array (shelf), instead array of activities in n different sub
// Kinda like: shelf[x].Activity[z]
export function flattenShelf(shelf) {
  let bigsub = []
  shelf.map(sub => { bigsub = bigsub.concat(sub) })
  return bigsub
}

export function sortByDate(shelf) {
  shelf.sort(function (a, b) {
    let dateA = new Date(a.snippet.publishedAt)
    let dateB = new Date(b.snippet.publishedAt)
    return dateB - dateA // Sort by most recent
  })
  return shelf
}
  
///////////////////////////////////////////////////////////////////////////
// THIS IS OLD
export function extractIdsOld(shelfsActsFlat) {
  // TODO: double map, improve performance.
  let ids = []
  for (let shelf of shelfsActsFlat) {
    let miniIds = shelf.map(act => act.contentDetails.upload.videoId)
    ids.push(miniIds)
  }
  return ids
}


export function getDemoSubs(user) {
  let isRecent = isUsedRecently(user)
  let shelfz;
  if (isRecent) {
    shelfz = localStorage.getItem('demoSubs')
    shelfz = JSON.parse(shelfz)
    console.log(shelfz)
  }
  
}

export function saveToLocal(shelfs) {

  console.log('***************************')
  localStorage.setItem('shelfsVids', JSON.stringify(shelfs))
  localStorage.setItem("last fetch", Date.now())
  console.log('***************************')
  //Save time
  //let now = new Date() 
  //localStorage.setItem("last fetch", now)
}

export function saveDemoToLocal(shelfs) {
  localStorage.setItem('demoSubs-sh-yt', JSON.stringify(shelfs))
  localStorage.setItem('demoSubs-pagelength-yt', JSON.stringify(shelfs))
  localStorage.setItem("demoSubs-time-yt", Date.now())
}

/*export function getDataFromLocal___FINISHLATER() {
    let shelfz = localStorage.getItem('demoSubs-sh-yt')
    let pageL = localStorage.getItem('demoSubs-numpages-yt')
    shelfz = JSON.parse(shelfz)
    setFinalShelfs(shelfz)
    setHasMoreShelfs(true)
}*/

export function isUsedRecently(user) {
  let fetchTime;
  let isRecent = false;
  let now = new Date() 
  if (user.isDemo) {
    fetchTime = localStorage.getItem("demoSubs-time-yt")
  } else {
    fetchTime = localStorage.getItem(user.fullName +'-time-yt')
  }
  let ms = fetchTime ? (now.getTime() - new Date(parseInt(fetchTime)).getTime()) : Infinity //Convert last fetch to ms... 0ms --> never recieved
  if (ms < 3000 * 60) {
    console.log("it's been under 3 minutes since")
    isRecent = true
  } else {
    console.log("it's been OVERRRRR 3 minutes since")
    isRecent = false
  }
  console.log(ms)

  console.log('***************************')
  return isRecent
}

export function getStorageShelfs() {
  let shelfz = localStorage.getItem('shelfsVids')
  shelfz = JSON.parse(shelfz)
  console.log(shelfz)
  return shelfz
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

  
  function printShelfs(shelfsActs) {
    let ilol = 0
    for (let sh of shelfsActs) {
      console.log('FETCH: ACTS SHELF ', ilol)
      for (let s of sh) {
        console.log(s.snippet.channelTitle + ' - ' + s.snippet.title)
      }
      ilol++
    }
  }


//I'm sorry for this. I messed up ealier :(
export function beginFilter2(fShelfs) {
  //console.log('+++++++++++ BEGIN FILTER ++++++++++++++')
  //console.log('fShelfs')
  //console.log(fShelfs)
  //Go through every shelf's vid and find it's filter then apply it
    for (let sh of fShelfs) {
      for (let vid of sh.videos) {
        for (let f of sh.filters) {
          if (f.id == vid.snippet.channelId) {
            let duration = moment.duration(vid.contentDetails.duration)
            let isPass = f.checkDurations(duration.asMinutes())
            if (!isPass) {
              /*
              console.log('+++++++++++++++++')
              console.log(vid.snippet.channelTitle + ' ' + vid.snippet.title)
              console.log(vid.id)
              console.log(vid)
              
              console.log("duration: " + duration.asMinutes())
              console.log('min ', f.minDuration )
              console.log('max ', f.maxDuration )
              console.log('pass? ', isPass )
              console.log('+++++++++++++++++') 
              sh.videos = sh.videos.filter( v => v.id != vid.id)
              */
              break
            
            }
          }
        }
      }
  }
}
