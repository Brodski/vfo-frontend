
import { Subscription } from '../Classes/Subscription'

export class User {
  constructor() {
    this.googleId = null;
    this.username = null;
    this.customShelfs = []
    this.pictureUrl = null;
    this.isDemo = true;
  }

  addSub(ytSub) {
    let sub = new Subscription()
    sub.channelName = ytSub.snippet.title
    sub.channelId = ytSub.snippet.resourceId.channelId;
    sub.filter.channelId = ytSub.snippet.resourceId.channelId;

    let shelf = new CustomShelf()
    shelf.title = sub.channelName;
    shelf.fewSubs = [sub]
    shelf.isSorted = false;
    this.customShelfs.push(shelf)
  }

  initNewUser(subz, data) {
    subz.map(ytSub => {
      this.addSub(ytSub)
    })

    //TODO
    // need to update username and pic
    this.username = data.username
    this.pictureUrl = data.pictureUrl
    this.isDemo = false
    if (this.customShelfs[0] == null) { 
      this.customShelfs = []  
    }
  }

}

export class CustomShelf {
  constructor() {
    this.title = null;
    this.fewSubs = []
    this.isSorted = false;
  }
  auxConstructor(t, fewS, isSorted) {
    this.title =t;
    this.fewSubs=fewS;
    this.isSorted=isSorted;
  }
}



export class VidCounter {
//  const initialPageLength = 3;
  constructor() {
    this.numVids = 3;
    this.shelfId = '';
  }
}