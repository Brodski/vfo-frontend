import { Filter } from './Filter';
import moment from 'moment';

export class FinalShelfs {
  constructor() {
    this.isActs = false
    this.shelfs = [
      {
        title: '',
        filters: [new Filter()],
          videos:
            [
              {
                contentDetails: {},
                snippet: {
                  thumbnails: {
                    default: {},
                    medium: {},
                    high: {},
                    standard: {},
                    maxres: {},
                  }
                },
                statistics: {},
              }
            ]
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
    getJsxData() {
      let thumbnail   = this.snippet.thumbnails.medium.url
      let id          = ''
      let title       = this.snippet.title
      let pubAt       = new Date(this.snippet.publishedAt)
      let viewCount   = this.statistics.viewCount 
      let channelName = this.snippet.channelTitle
      let fromNowDate = new moment(this.snippet.publishedAt).fromNow()

      let vd_aux = moment.duration(this.contentDetails.duration) //Convert iso8601 string to object
      let vidDuration = vd_aux.minutes() + ':' + vd_aux.seconds().toString().padStart(2, 0) // if seconds == 3, then "03"
      return { thumbnail, id, title, pubAt, viewCount, channelName, fromNowDate, vd_aux, vidDuration }
  }
}

export class ActRes {
  constructor() {
      this.contentDetails = { upload: {} };
      this.snippet = {
        channelId: '',
        channelTitle: '',
        publishedAt: '',
        title: '',
        type: '',
        thumbnails: {
          default: {},
          medium: {},
          high: {},
          standard: {},
          maxres: {},
        }
      };
  }
  getJsxData() {
    let thumbnail   = this.snippet.thumbnails.medium.url
    let id          = this.contentDetails.upload.videoId
    let title       = this.snippet.title
    let pubAt       = new Date(this.snippet.publishedAt)
    let viewCount   = ''
    let channelName = this.snippet.channelTitle
    let fromNowDate = new moment(this.snippet.publishedAt).fromNow()

    let vd_aux = ''
    let vidDuration = '' 
    return { thumbnail, id, title, pubAt, viewCount, channelName, fromNowDate, vd_aux, vidDuration }
  }
}
