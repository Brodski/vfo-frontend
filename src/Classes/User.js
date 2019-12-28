
//import { Subscription } from '../Classes/Subscription'

export class User {
  constructor() {
    this.id = null;
    this.fullName = null;
    //this.profiles = []
    this.subscriptions = []
    this.customShelfs = []
    this.unsortedSubs = []
    this.isDemo = true;
  }
}

export class CustomShelf {
  constructor() {
    this.title = null;
    this.fewSubs = []
    this.isSorted = false;
  }
}

const initialPageLength = 3;

export class VidCounter {
  constructor() {
    this.numVids = initialPageLength;
    this.shelfId = '';
  }
}