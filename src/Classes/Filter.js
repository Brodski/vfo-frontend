

export class Filter {
  constructor(id) {
    this.minDuration = 0;
    this.maxDuration = "Infinity";
    this.channelId = id;
  
  }

  // I do not think it is worth creating 1 Filter object per subscription just for 1 method. Maybe if more methods for Filter are created.
  //checkDurations(vidDuration) {
  //  let max = this.maxDuration == "Infinity" ? Infinity : this.maxDuration
  //  if (vidDuration  >= this.minDuration && vidDuration <= max) {
  //    return true
  //  }
  //  return false
  //}

}