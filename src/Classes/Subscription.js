import Filter from './Filter'

class Subscription {
  constructor() {
    this.channelId = null;
    this.channelName = null;
    this.filter = new Filter();   
  }
}
export default Subscription