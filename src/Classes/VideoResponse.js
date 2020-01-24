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
            maxres: {},
          } 
        };
  }
}
export default VideoResponse

  //////////////////////////////////////////////////////////////////////////
 //////////////////////// probably wasted time below //////////////////////
//////////////////////////////////////////////////////////////////////////

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
