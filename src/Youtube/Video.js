import React from 'react';
import moment from 'moment';
import humanFormat from 'human-format';
//https://github.com/JsCommunity/human-format

export const Video = (props) => {

  let thumbnail, id, title, pubAt, viewCount, channelName, fromNowDate, vd_aux, vidDuration;
  
  //YT uses a 1 to 1.787 ratio for all their vids. The medium.url is 1 to 1.777
  thumbnail   = props.video.snippet.thumbnails.medium.url
  id          = props.video.id 
  title       = props.video.snippet.title
  channelName = props.video.snippet.channelTitle
  fromNowDate = new moment(props.video.snippet.publishedAt).fromNow()
  //solution to Premium yt vids
  viewCount = formatViewCount()
  vidDuration = formatVidLength()

  function formatViewCount() {
    if (props.video.statistics.viewCount) { 
      viewCount   = humanFormat(parseInt(props.video.statistics.viewCount),{ decimals: 1 } ).replace(/\s/g,''); 
    } else {
      viewCount =""
    }
    return viewCount
  }

  function formatVidLength() {
    vd_aux      = moment.duration(props.video.contentDetails.duration) //Convert iso8601 string to object
    if (vd_aux.hours() > 0) {
      vidDuration = vd_aux.hours() + ':' + vd_aux.minutes().toString().padStart(2,0) + ':' + vd_aux.seconds().toString().padStart(2, 0) // if seconds == 3, then "03"   
    } else {
      vidDuration = vd_aux.minutes() + ':' + vd_aux.seconds().toString().padStart(2, 0) // if seconds == 3, then "03"
    }
    return vidDuration
  }
  
  if (props.video.id) {
    return (
      <li className="collection-item video col s12 m4 l3 xl2">
        <a href={"https://www.youtube.com/watch?v=" + id} >
          <div className="vid-thumbnail-wrap">
            <img className="vid-thumnail" src={thumbnail} />
            <span className="vid-timestamp"> {vidDuration} </span>
          </div>
        </a>
        <div className="vid-all-text-wrap">
          <div className="vid-title"> {title} </div>
          <div className="vid-info">
            <div className="vid-ch-txt"> {channelName} </div>
            <div> {fromNowDate} • {viewCount} views </div>
          </div>
        </div>

      </li>

    );
  }
  else {
    return (
    <h4>  </h4>
    )
  }
}