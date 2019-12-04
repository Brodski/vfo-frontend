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
      console.log("---------- Activity --------------------------------------------------------------------")
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
 * [ 
 *   {shelf} 
 *   {shelf}
 *   {shelf}
 * ]
 *  shelf:
 *  array of subscriptions
 *  [
 *    {subscription}
 *    {subscription}
 *    {subscription}
 *    {subscription}
 *  
 *  ]
 *    subscription
*     array of activities
*     [
*      {activity}
*      {activity}
*      {activity}
*      {activity}
*      {activity}
*      ]   
*        activity (from yt):
*        {
*         contentDetails.upload.videoId
*         snippet.channelId
*         snippet.channelName
*         snippet.description
*         snippet.publishedAt:
*         snippet.thumbnails
*         snippet.title
*        }
 * 
 */
export function removeNonVideos(eachShelfsActs) {
// TODO
// Remove the double loop, use map and filter
// const damnBaby = shelf.map( act => act.result.items.filter(function (item) { return item.contentDetails.upload } ))
  let filteredShelfs = []
  for (let shelf of eachShelfsActs) {
    let fShelf = []
    for (let act of shelf) {
      console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
      if (act.status < 200 || act.status > 299 ) {
          console.log("Not 200 for activity: " + act)
          continue
        }
//      console.log('act.result')
      //console.log(act.result.items.snippet.channelTitle)
  //    console.log(act.result)
      const result = act.result.items.filter(function (item) { return item.contentDetails.upload } )
      //console.log(result)
      fShelf.push(result)

    }
    filteredShelfs.push(fShelf)
  }
  console.log('filteredShelfs')
  console.log(filteredShelfs)
  return filteredShelfs

}

export function flattenShelf(shelf) {
//  console.log("flattenShelf: shelf ")
  //console.log(shelf)
  let bigsub = []
  shelf.map(sub => { bigsub = bigsub.concat(sub) })
  //console.log('bigsub')
//  console.log(bigsub)
  return bigsub
}

export function sortByDate(shelf) {
  //console.log("~`~`~`~~`~`~`~ SORT BY `~`~``~`~``~``~``~`")
 // console.log("sort by date: shelf")
//  console.log(shelf)
  //for (let act of shelf) {
 //   console.log(act.snippet.publishedAt)
//  }
  shelf.sort(function (a, b) {
    let dateA = new Date(a.snippet.publishedAt)
    let dateB = new Date(b.snippet.publishedAt)
    return dateB - dateA // Sort by most recent
  })
  //for (let act of shelf) {
 //   console.log(act.snippet.publishedAt)
//  }
  return shelf
}
  

