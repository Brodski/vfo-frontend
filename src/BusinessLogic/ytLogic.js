import * as moment from 'moment';
import * as youtubeApi from "../HttpRequests/YoutubeApi";
// import  * as GApiAuth from '../HttpRequests/GApiAuth'; //hack helper

 //import * as Common from './Common.js'; //hack helper
// import Common                    from '../BusinessLogic/Common.js';


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

 
// export async function hackHelper() {
//   let count = 1
//   let isReady  = !GApiAuth.checkAll();
//   while ( isReady ) {
//     console.log('Hack Helper: Logged out?: ' + isReady + ' - ' + count)
//     await Common.sleep(100 * count)
//     count = count + 1
//     if (count > 40) {
//       count = count * 2
//       console.log("Hack Helper: Something went wrong :(  " + count)
//     }
//     isReady = !GApiAuth.checkAll()
//   }
// }

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
  
  return filteredShelfs

}

export function extractIds(shelf) {
  let ids = []
  shelf.map( act => ids.push(act.contentDetails.upload.videoId))
  return ids
}

export async function fetchVideos(shelfsVidIds) {
    const vidIdShelfPromise = shelfsVidIds.map(sh => {
      return youtubeApi.getSomeVideos(sh)
    })
    return Promise.all(vidIdShelfPromise)
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
}



// function orderdAndSplice(shelfsActs) {
//     let orderedActs = shelfsActs.map(sh => {
//       return sh.map(sub => {
//         return this.sortByDate(sub)
//       })
//     })
//      //A very nice print
//     for (let sh of orderedActs) {
//       for (let s of sh) {
//         for (let v of s) {
//         console.log(v.snippet.channelTitle, ' ', v.snippet.publishedAt, ' ', v.snippet.title)
//         }
//       }
//     }
//     console.log('\n\n\n\n\n\n\n\n\n ORDERED ACTS \n\n\n\n\n\n\n\n\n\n')
//     console.log(orderedActs)
//     return orderedActs
//   }

