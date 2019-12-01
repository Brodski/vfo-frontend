



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







/*
 
  function momentLearning() {
    console.log("============================================================")
    console.log(moment())
    var sec = moment().subtract(1, 'days').fromNow()
    console.log(sec)
    var sec = moment().subtract(1.5, 'days').fromNow()
    console.log(sec)
    var sec = moment().subtract(2, 'days').fromNow()
    console.log(sec)
    var sec = moment().subtract(.5, 'days').fromNow()
    console.log(sec)

    var sec = moment().subtract(1, 'seconds').fromNow()
    console.log(sec)
    var sec = moment().subtract(5, 'seconds').fromNow()
    console.log(sec)
    var sec = moment().subtract(25, 'seconds').fromNow()
    console.log(sec)
    var sec = moment().subtract(60, 'seconds').fromNow()
    console.log(sec)
    var sec = moment().subtract(105, 'seconds').fromNow()
    console.log(sec)
    var sec = moment().subtract(119, 'seconds').fromNow()
    console.log(sec)
    var sec = moment().subtract(120, 'seconds').fromNow()
    console.log(sec)
    var sec = moment().subtract(121, 'seconds').fromNow()
    console.log(sec)
    var sec = moment().subtract(149, 'seconds').fromNow()
    console.log(sec)
    var sec = moment().subtract(150, 'seconds').fromNow()
    console.log(sec)

    var sec = moment().subtract(5, 'minutes').fromNow()
    console.log(sec)
    var sec = moment().subtract(5, 'hours').fromNow()
    console.log(sec)
    var sec = moment().subtract(1, 'years').fromNow()
    console.log(sec)
    var sec = moment().subtract(5, 'years').fromNow()
    console.log(sec)
    var sec = moment().subtract(1.55, 'years').fromNow()
    console.log(sec)
    console.log("============================================================")
  } 
 
 */

  /*  const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://apis.google.com/js/client.js";
    document.body.appendChild(script)
    script.onload = () => {
      Common.initGoogleAPI()
    }
  */