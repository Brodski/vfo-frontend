import Filter from "./Filter";
import VideoResponse from "./VideoResponse";

class FinalShelfs {
  constructor() {
    this.shelfs = [
      {
        title: "",
        filters: [new Filter()],
        videos: [new VideoResponse()]
      }
    ];
  }
}
export default FinalShelfs;
