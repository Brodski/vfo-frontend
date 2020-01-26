import CustomShelf from "./CustomShelf";
import Subscription from "./Subscription";

class User {
  constructor() {
    this.googleId = null;
    this.username = null;
    this.customShelfs = [];
    this.pictureUrl = null;
    this.isDemo = true;
  }

  initNewUser(subz, data) {
    subz.forEach(ytSub => {
      this.addSub(ytSub);
    });
    // TODO need to update username and pic
    this.username = data.username;
    this.pictureUrl = data.pictureUrl;
    this.isDemo = false;
    if (this.customShelfs[0] == null) {
      this.customShelfs = [];
    }
  }

  convertUnSortedShelfsToSubs() {
    let auxUnSortedSh = this.customShelfs.filter(sh => {
      return !sh.isSorted;
    });
    let subz = auxUnSortedSh.map(sh => {
      return [...sh.fewSubs];
    });
    return subz;
  }

  addSub(ytSub) {
    let sub = new Subscription();
    sub.channelName = ytSub.snippet.title;
    sub.channelId = ytSub.snippet.resourceId.channelId;
    sub.filter.channelId = ytSub.snippet.resourceId.channelId;

    let shelf = new CustomShelf();
    shelf.title = sub.channelName;
    shelf.fewSubs = [sub];
    shelf.isSorted = false;
    this.customShelfs.push(shelf);
  }

  addArrayOfSubs(ytSubArr) {
    if (!ytSubArr[0]) {
      console.log("User has not subscribed from any new channels recently");
      return;
    }
    console.log("User has subscribed to a channel since last visit");
    ytSubArr.forEach(ytSub => {
      this.addSub(ytSub);
    });
  }

  removeSubs(removedSubsArr) {
    if (!removedSubsArr[0]) {
      console.log("User has not unsubscribed from any channels recently");
      return;
    }
    console.log("User has unsubscribed from a channel recently");
    this.customShelfs.forEach(sh => {
      sh.fewSubs.forEach(sub => {
        removedSubsArr.forEach(rmS => {
          if (rmS.channelId === sub.channelId) {
            let idz = sh.fewSubs.indexOf(sub);
            console.log(sub);
            sh.fewSubs.splice(idz, 1);
            if (sh.fewSubs.length === 0) {
              let idz2 = this.customShelfs.indexOf(sh);
              this.customShelfs.splice(idz2, 1);
            }
          }
        });
      });
    });
  }
}
export default User;
