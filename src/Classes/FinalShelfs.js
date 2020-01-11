import { Filter } from './Filter';
import moment from 'moment';

export class FinalShelfs {
  constructor() {
    this.shelfs = [
      {
        title: '',
        filters: [new Filter()],
          videos:
            [new VideoRes() ]
            //  {
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
            //]
        }
      ]
  }
} 

  //////////////////////////////////////////////////////////////////////////
 //////////////////////// probably wasted time below //////////////////////
//////////////////////////////////////////////////////////////////////////

class Shelf {
  constructor() {
    this.title = ''
    this.filters = []
    this.videos = [new VideoRes()];
  }
}

//export class VideoRes {
//  constructor() {
//    this.id = '';
//    this.contentDetails = { duration: '' };
//    this.statistics = {
//      viewCount: '',
//    };
//    this.snippet = {
//          channelId: '',
//          channelTitle: '',
//          publishedAt: '',
//          thumbnails: {
//            default: { url: '' },
//            medium: { url: '' },
//            high: { url: '' },
//            standard: { url: '' },
//            maxres: { url: '' },
//          }
//        };
//  }
//}

export class VideoRes {
  constructor() {
   this.contentDetails = {};
   this.statistics = {};
   this.snippet = {
          thumbnails: {
            default: {},
            medium: {},
            high: {},
            standard: {},
            maxres: {},
          } 
        };
  }
}