

export class Filter {
  constructor(id) {
    this.blocklist = [];
    this.requireList = [];
    this.minDuration = 0;
    this.maxDuration = Infinity;
    this.id = id;
  
  }
  checkDurations(vidDuration) {
    /*console.log("checking duration")
    console.log("Id, min, max")
    console.log(this.id)
    console.log(this.minDuration)
    console.log(this.maxDuration)*/

    if (vidDuration  >= this.minDuration && vidDuration <= this.maxDuration) {
      return true
    }
    return false
  }

}