// Had to get out of Dep. cycle,
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function check() {
  let wait = 500;

  while (!window.gapi.client.youtube) {
    wait = wait * 2;
    await sleep(wait);
  }
  while (!window.gapi.auth2) {
    wait = wait * 2;
    await sleep(wait);
  }
  while (!window.gapi) {
    wait = wait * 2;
    await sleep(wait);
  }
}

export async function _getActivities(channel) {
  await check();
  return window.gapi.client.youtube.activities.list({
    part: "snippet,contentDetails",
    channelId: channel,
    maxResults: 35,
    fields: "nextPageToken, items(contentDetails/*, snippet/*)"
  });
}

export async function _getThisUsersSubs(pageToken) {
  await check();
  return window.gapi.client.youtube.subscriptions.list({
    part: "snippet",
    maxResults: 50,
    mine: true,
    pageToken: pageToken,
    fields:
      "pageInfo, nextPageToken, items(snippet/title, snippet/publishedAt, snippet/resourceId/channelId, snippet/thumbnails/default/url )"
  });
}

export async function getSomeVideos(vidIdList = [""]) {
  await check();
  return window.gapi.client.youtube.videos.list({
    part: "snippet, contentDetails, statistics",
    id: vidIdList.toString(),
    fields:
      "items(id, kind, contentDetails/duration, snippet/publishedAt, snippet/channelId, snippet/title, snippet/description, snippet/thumbnails/*, snippet/channelTitle, statistics)"
  });
}
