

export class Filter {
  constructor(id) {
    this.minDuration = 0;
    this.maxDuration = "Infinity";
    this.channelId = id;
  
  }

  //checkDurations(vidDuration) {
  //  let max = this.maxDuration == "Infinity" ? Infinity : this.maxDuration
  //  if (vidDuration  >= this.minDuration && vidDuration <= max) {
  //    return true
  //  }
  //  return false
  //}

}