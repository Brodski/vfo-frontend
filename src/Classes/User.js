
import { Subscription } from '../Classes/Subscription'

export class User {
  constructor() {
    this.googleId = null;
    this.username = null;
    this.customShelfs = []
    this.pictureUrl = null;
    this.isDemo = true;
  }

  initNewUser(subz, data) {
  
    console.log("Subz: ")
    console.log( subz)
    let subArr = subz.map(ytSub => {
      let sub = new Subscription()
      sub.channelName = ytSub.snippet.title
      sub.channelId = ytSub.snippet.resourceId.channelId;
      sub.filter.channelId = ytSub.snippet.resourceId.channelId;
      return sub
    })
    let shelf = new CustomShelf()
    shelf.title = "Initial Shelf";
    shelf.fewSubs = subArr;
    this.customShelfs = [shelf]
    this.username = data.username
    this.pictureUrl = data.pictureUrl
    this.isDemo = false
  }

}

export class CustomShelf {
  constructor() {
    this.title = null;
    this.fewSubs = []
    this.isSorted = false;
  }
}



export class VidCounter {
//  const initialPageLength = 3;
  constructor() {
    this.numVids = 3;
    this.shelfId = '';
  }
}