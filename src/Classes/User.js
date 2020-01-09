
import { Subscription } from '../Classes/Subscription'

export class User {
  constructor() {
    this.googleId = null;
    this.username = null;
    this.customShelfs = []
    this.pictureUrl = null;
    this.isDemo = true;
  }

  
  convertUnSortedShelfsToSubs() {
    let aux_unSortedSh = this.customShelfs.filter( sh => { return !sh.isSorted } )
    let wut = aux_unSortedSh.map(sh => {
        return [...sh.fewSubs]
      })

      console.log('wut')
      console.log('wut')
      console.log('wut')
      console.log('wut')
      console.log('wut')
      console.log(wut)
    return wut
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

  addArrayOfSubs(ytSubArr) {
    if (!ytSubArr[0]) {
      console.log('User has not subscribed from any new channels recently')
      return
    }
    console.log('SUBS HAVE BEEN ADDED')
    ytSubArr.forEach(ytSub => { this.addSub(ytSub) })
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

  removeSubs(removedSubsArr) {
    if (!removedSubsArr[0]) {
      console.log('User has not unsubscribed from any channel recently')
      return
    }
    console.log('SUBS HAVE BEEN REMOVED')
    for (let sh of this.customShelfs) {
      for (let sub of sh.fewSubs) {
        for (let rmS of removedSubsArr) {
          if (rmS.channelId == sub.channelId) {
            let idz = sh.fewSubs.indexOf(sub)
            console.log(sub)
            sh.fewSubs.splice(idz, 1)
            if (sh.fewSubs.length === 0) {
              let idz2 = this.customShelfs.indexOf(sh)
              this.customShelfs.splice(idz2, 1)
            }
          }
        }
      }
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

  convertAllSubsToShelfs() {
    return this.fewSubs.map(sub => 
      this.convertSubToShelf(sub)
    )
  }

  convertSubToShelf(sub) {
    let newSh = new CustomShelf()
    newSh.title = sub.channelName
    newSh.isSorted = false
    newSh.fewSubs = [sub]
    return newSh
  }


  //prepareYourSubscriptionsContainer() {
  //  let aux_unSortedSh = props.userSettings.customShelfs.filter( sh => { return !sh.isSorted } )

  //  let bigFlat = []
  //  aux_unSortedSh.map(sh => {
  //    return sh.fewSubs.map(sub => { bigFlat = bigFlat.concat(sub) })
  //  })
  //  let unSortedSh  = [new CustomShelf()]
  //  unSortedSh[0].isSorted = false
  //  unSortedSh[0].title = "Your Subscriptions"
  //  unSortedSh[0].fewSubs = bigFlat

  //}
}



export class VidCounter {
//  const initialPageLength = 3;
  constructor() {
    this.numVids = 3;
    this.shelfId = '';
  }
}



    //  for (let uSh of subsFromBackend.customShelfs) {
    //    for (let sub of uSh.fewSubs) {
    //      for (let rmS of removedSubs) {
    //        if (rmS.channelId == sub.channelId) {
    //          let idz = uSh.fewSubs.indexOf(sub)
    //          console.log(idz)
    //          console.log(sub)
    //          uSh.fewSubs.splice(idz,1)
    //          if (uSh.fewSubs.length === 0) {
    //            let idz2 = subsFromBackend.customShelfs.indexOf(uSh)
    //            subsFromBackend.customShelfs.splice(idz2,1)
    //          }
    //        }
    //      }
    //    }
    //}