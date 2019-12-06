import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

import { Link } from "react-router-dom";
import axios from 'axios';
import { SECRET_KEYS } from '../api-key';
import * as Common from '../Pages/Common.js';
import * as videoJ from '../Scratch/api_video.json';
import * as moment from 'moment';
import * as youtubeApi from "../Pages/youtubeApi";
import  * as GApiAuth from '../HttpRequests/GApiAuth';

// Github: JS Client https://github.com/google/google-api-javascript-client
//
//MAIN https://developers.google.com/youtube/v3/getting-started
//       OAUTH https://developers.google.com/youtube/v3/libraries
//       JS API https://github.com/google/google-api-javascript-client

//ACTUAL JS DOCS. gapi objects & methods: https://github.com/google/google-api-javascript-client/blob/master/docs/reference.md
// BIGGER DOCS:           https://developers.google.com/identity/sign-in/web/reference

// Get profile info (id): https://developers.google.com/identity/sign-in/web/people

//OAuth https://developers.google.com/youtube/v3/guides/authentication

/// FIELD THINGY: https://developers.google.com/youtube/v3/getting-started
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
    const sh_Promises = sh.subscriptions.map(sub => youtubeApi._getActivities(sub.channelId))
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


export async function getAllSubs() {
  var response = await youtubeApi._getThisUsersSubs()
  let allSubs = response.result.items

  while (response.result.nextPageToken) {
    response = await youtubeApi._getThisUsersSubs(response.result.nextPageToken)
    allSubs = !allSubs ? response.result.items : allSubs.concat(response.result.items)
  }
  console.log('allSubs : ')
  console.log(allSubs)
  return allSubs

}



/*
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
  console.time('removeNonVideos: TOP')
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
  console.time('removeNonVideos: filteredShelfs:')
  console.log(filteredShelfs)
  console.timeEnd('removeNonVideos')
  return filteredShelfs

}


export function extractIds(shelf) {

  let ids = []
  shelf.map( act => ids.push(act.contentDetails.upload.videoId))
  //console.log('miniIds')
  //console.log(miniIds)
  return ids
}

export async function getVideosShelf(shelfsVidIds) {
    const vidIdShelf_Promise = shelfsVidIds.map(sh => {
      return youtubeApi.getSomeVideos(sh.slice(0, 20))
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