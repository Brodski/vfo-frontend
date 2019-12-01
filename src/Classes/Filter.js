

export class Filter {
  constructor() {
    this.blacklist = [];
    this.requireKeyword = [];
    this.minDuration = 0;
    this.maxDuration = Infinity;
  }
}