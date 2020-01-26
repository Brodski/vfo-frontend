class VideoResponse {
  constructor() {
    this.contentDetails = {};
    this.statistics = {};
    this.snippet = {
      thumbnails: {
        default: {},
        medium: {},
        high: {},
        standard: {},
        maxres: {}
      }
    };
  }
}
export default VideoResponse;
