
//import { Subscription } from '../Classes/Subscription'

export class User {
  constructor() {
    this.userId = null;
    this.fullName = null;
    //this.profiles = []
    this.subscriptions = []
    this.customShelfs = []

  }
}

export class CustomShelf {
  constructor() {
    this.title = null;
    this.fewSubs = []
  }
}