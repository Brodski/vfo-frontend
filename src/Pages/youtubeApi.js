



export function _getActivities(channel) {
  return window.gapi.client.youtube.activities.list({
    "part": "snippet,contentDetails",
    "channelId": channel,
    "maxResults": 35,
    "fields": "nextPageToken, items(contentDetails/*, snippet/*)"
  })
  }


export function _getThisUsersSubs(pageToken) {
  return window.gapi.client.youtube.subscriptions.list({
    "part": "snippet",
    "maxResults": 50,
    "mine": true,
    "pageToken": pageToken,
    "fields": "pageInfo, nextPageToken, items(snippet/title, snippet/publishedAt, snippet/resourceId/channelId, snippet/thumbnails/default/url )"
  })
  }


export function getChannelInfo(e) {
  e.preventDefault();
  //console.log("CLICKEDDD! - channel: " + channel)
  let id = "UCPWXiRWZ29zrxPFIQT7eHSA, UCeMFHOzX9MDWbr-pu2WdmVw, UC3IngBBUGFUduHp-7haK1lw, UCA-8h5uCH5RE-1r6gskkbTw, UC0CeYMTh57zSsbUKhsyOPfw"
  return window.gapi.client.youtube.channels.list({
    "part": "snippet",
    "id": id,
    "maxResults": 50,
    "fields": "items(id, snippet/title,snippet/thumbnails/default)",
  })
    .then(function (response) {
      console.log("Response", response.result);  //console.log("Response", JSON.stringify(response.result, null, 2)); 
    })
  }
