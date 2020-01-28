import * as moment from "moment";
import * as youtubeApi from "../HttpRequests/YoutubeApi";

export async function getActivitiesShelfs(shelfs) {
  const allShelfsPromises = [];
  shelfs.forEach(sh => {
    const shPromises = sh.fewSubs.map(sub =>
      youtubeApi._getActivities(sub.channelId)
    );
    allShelfsPromises.push(shPromises);
  });
  return Promise.all(allShelfsPromises.map(shProm => Promise.all(shProm))); // https://stackoverflow.com/questions/36094865/how-to-do-promise-all-for-array-of-array-of-promises
}

export async function getAllSubs() {
  let response = await youtubeApi._getThisUsersSubs();
  if (response.status < 200 || response.status > 299) {
    return;
  }
  let allSubs = response.result.items;

  // Intended await in loop. yt api can only get 50 subs per request
  while (response.result.nextPageToken) {
    response = await youtubeApi._getThisUsersSubs(
      response.result.nextPageToken
    );
    allSubs = !allSubs
      ? response.result.items
      : allSubs.concat(response.result.items);
  }
  return allSubs;
}

// TODO Remove the double loop, use filter
export function removeNonVideos(eachShelfsActs) {
  const filteredShelfs = [];
  eachShelfsActs.forEach(shelf => {
    const fShelf = [];
    shelf.forEach(act => {
      if (act.status < 200 || act.status > 299) {
        return;
      }
      const result = act.result.items.filter(item => {
        return item.contentDetails.upload;
      });
      fShelf.push(result);
    });
    filteredShelfs.push(fShelf);
  });

  return filteredShelfs;
}

export function extractIds(shelf) {
  let ids = [];
  shelf.map(act => ids.push(act.contentDetails.upload.videoId));
  return ids;
}

export async function fetchVideos(shelfsVidIds) {
  const vidIdShelfPromise = shelfsVidIds.map(sh => {
    return youtubeApi.getSomeVideos(sh);
  });
  return Promise.all(vidIdShelfPromise);
}

// Returns all the activies in a single array (shelf)
export function flattenShelf(shelf) {
  let bigsub = [];
  shelf.map(sub => {
    bigsub = bigsub.concat(sub);
  });
  return bigsub;
}

// Sort by most recent
export function sortByDate(shelf) {
  shelf.sort(function(a, b) {
    let dateA = new Date(a.snippet.publishedAt);
    let dateB = new Date(b.snippet.publishedAt);
    return dateB - dateA;
  });
  return shelf;
}

// See note in Filter class
function checkDurations(filt, vidDuration) {
  let max = filt.maxDuration === "Infinity" ? Infinity : filt.maxDuration;
  if (vidDuration >= filt.minDuration && vidDuration <= max) {
    return true;
  }
  return false;
}

// I'm sorry for this. I messed up ealier :(
export function beginFilter2(fShelfs) {
  // Go through every shelf's vid and find it's filter then apply it
  fShelfs.forEach(sh => {
    sh.videos.forEach(vid => {
      sh.filters.forEach(f => {
        if (f.channelId === vid.snippet.channelId) {
          const duration = moment.duration(vid.contentDetails.duration);
          const isPass = checkDurations(f, duration.asMinutes());
          if (!isPass) {
            sh.videos = sh.videos.filter(v => v.id !== vid.id);
            return;
          }
        }
      });
    });
  });
}
