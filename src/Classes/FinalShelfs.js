import Filter from './Filter';
import VideoResponse from './VideoResponse'

class FinalShelfs {
  constructor() {
    this.shelfs = [
      {
        title: '',
        filters: [new Filter()],
          videos:
            [new VideoResponse() ]
            //  [{
            //    contentDetails: {},
            //    snippet: {
            //      thumbnails: {
            //        default: {},
            //        medium: {},
            //        high: {},
            //        standard: {},
            //        maxres: {},
            //      }
            //    },
            //    statistics: {},
            //  }
            // ]
        }
      ]
  }
} 
export default FinalShelfs