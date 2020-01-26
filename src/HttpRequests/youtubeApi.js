 /* eslint-disable no-underscore-dangle */

import * as Common from '../BusinessLogic/Common';
// import Common                    from '../BusinessLogic/Common.js';


export async function check(gapiObj, gapiString) {
  let wait = 500;
  while (!window.gapi.client.youtube) {
    wait = wait * 2
    console.log("yt Api 1- NOT EXISTS: gapi.client.youtube")
    await Common.sleep(wait)
  }
  while (!window.gapi.auth2) {
    wait = wait * 2
    console.log("yt Api 2- NOT EXISTS: gapi.auth2 not found");
    await Common.sleep(wait); //sleep 100 ms
  }
  while (!window.gapi) {
    wait = wait * 2
    console.log("yt Api 3- NOT EXISTS: window.gapi not found");
    await Common.sleep(wait)
  }
}


export async function _getActivities(channel) {
  await check()
  return window.gapi.client.youtube.activities.list({
    "part": "snippet,contentDetails",
    "channelId": channel,
    "maxResults": 35,
    "fields": "nextPageToken, items(contentDetails/*, snippet/*)"
  })
  }


export async function _getThisUsersSubs(pageToken) {
  await check()
  return window.gapi.client.youtube.subscriptions.list({
    "part": "snippet",
    "maxResults": 50,
    "mine": true,
    "pageToken": pageToken,
    "fields": "pageInfo, nextPageToken, items(snippet/title, snippet/publishedAt, snippet/resourceId/channelId, snippet/thumbnails/default/url )"
  })
  }


export async function getSomeVideos(vidIdList = [""]) {
await check()
  //return await window.gapi.client.youtube.videos.list({
  return window.gapi.client.youtube.videos.list({
    "part": "snippet, contentDetails, statistics",
    "id": vidIdList.toString(),
    "fields": "items(id, kind, contentDetails/duration, snippet/publishedAt, snippet/channelId, snippet/title, snippet/description, snippet/thumbnails/*, snippet/channelTitle, statistics)",
  })
}

/*
  function getUploads() {
    return window.gapi.client.youtube.search.list({
      "part": "snippet",
      "channelId": "UCb--64Gl51jIEVE-GLDAVTg",
      "maxResults": 50,
      "order": "date",
      "safeSearch": "none",
      "type": "video"
    })
      .then(function (response) {
        console.log("Response", response.result);
      }).catch(function (err) { console.error("Execute error", err); });
  }

*/