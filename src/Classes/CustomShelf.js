class CustomShelf {
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
    return this.fewSubs.map(sub => {
      const newSh = new CustomShelf()
      newSh.title = sub.channelName
      newSh.isSorted = false
      newSh.fewSubs = [sub]
      return newSh
    })
  }

  //  convertSubToShelf(sub) {
  //   const newSh = new CustomShelf()
  //   newSh.title = sub.channelName
  //   newSh.isSorted = false
  //   newSh.fewSubs = [sub]
  //   return newSh
  // }



  // findIndexesOfChannelName(channelName) {

  //  for (let sh of this.customShelfs) {
  //    subIndex = sh.fewSubs.findIndex(s => s.channelName == channelName)
  //    if (subIndex > -1) {
  //      break
  //    }
  //    shelfIndex += 1;
  //  }
  // }



  // prepareTheYourSubscriptionsContainer() {
  //  let aux_unSortedSh = props.userSettings.customShelfs.filter( sh => { return !sh.isSorted } )

  //  let bigFlat = []
  //  aux_unSortedSh.map(sh => {
  //    return sh.fewSubs.map(sub => { bigFlat = bigFlat.concat(sub) })
  //  })
  //  let unSortedSh  = [new CustomShelf()]
  //  unSortedSh[0].isSorted = false
  //  unSortedSh[0].title = "Your Subscriptions"
  //  unSortedSh[0].fewSubs = bigFlat

  // }
}
export default CustomShelf