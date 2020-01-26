import VideoResponse from "./VideoResponse";

class Shelf {
  constructor() {
    this.title = "";
    this.filters = [];
    this.videos = [new VideoResponse()];
  }
}
