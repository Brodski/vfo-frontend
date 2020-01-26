class CustomShelf {
  constructor() {
    this.title = null;
    this.fewSubs = [];
    this.isSorted = false;
  }

  auxConstructor(t, fewS, isSorted) {
    this.title = t;
    this.fewSubs = fewS;
    this.isSorted = isSorted;
  }

  convertAllSubsToShelfs() {
    return this.fewSubs.map(sub => {
      const newSh = new CustomShelf();
      newSh.title = sub.channelName;
      newSh.isSorted = false;
      newSh.fewSubs = [sub];
      return newSh;
    });
  }
}
export default CustomShelf;
