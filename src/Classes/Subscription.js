import { Filter } from './Filter'

export class Subscription {
  constructor() {
    this.channelId = null;
    this.channelName = null;
    this.filter = new Filter();   
  }
}