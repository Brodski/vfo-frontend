import React from 'react';
import moment from 'moment';
import humanFormat from 'human-format';

export const Video = (props) => {

  let thumbnail, id, title, pubAt, viewCount, channelName, fromNowDate, vd_aux, vidDuration;
  
  //YT uses a 1 to 1.787 ratio for all their vids. The medium.url is 1 to 1.777
  thumbnail   = props.video.snippet.thumbnails.medium.url
  id          = props.video.id 
  title       = props.video.snippet.title
  channelName = props.video.snippet.channelTitle
  fromNowDate = new moment(props.video.snippet.publishedAt).fromNow()
  viewCount   = humanFormat(parseInt(props.video.statistics.viewCount),{ decimals: 1 } ).replace(/\s/g,''); //https://github.com/JsCommunity/human-format
  vd_aux      = moment.duration(props.video.contentDetails.duration) //Convert iso8601 string to object
  vidDuration = vd_aux.minutes() + ':' + vd_aux.seconds().toString().padStart(2, 0) // if seconds == 3, then "03"
  
  if (props.video.id) {
    return (
      <li className="video col s12 m4 l3 xl3">
        <div className="thumbnail-wrap">
          <a href={"https://www.youtube.com/watch?v=" + id} >
            <img className="thumnail" src={thumbnail} />
          </a>
          <span className="vid-timestamp"> {vidDuration} </span>
        </div>
        <div className="vid-all-text-wrap">
          <div className="vid-title"> {title}  </div>
          <div className="vid-info">
            <div> {channelName} </div>
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