import React from 'react';
import moment from 'moment';

export const Video = (props) => {

  moment.updateLocale('en', {
    relativeTime: {
      m: "1 minute",
      h: "1 hour",
      d: "1 day",
      M: "1 month",
      y: "1 year",
    }
  });

  let thumbnail, id, title, pubAt, viewCount, channelName, fromNowDate, vd_aux, vidDuration;
  thumbnail   = props.video.snippet.thumbnails.medium.url
  id          = props.video.id 
  title       = props.video.snippet.title 
  //pubAt       = new Date(props.video.snippet.publishedAt)
  viewCount   = props.video.statistics.viewCount 
  channelName = props.video.snippet.channelTitle
  fromNowDate = new moment(props.video.snippet.publishedAt).fromNow()

  vd_aux = moment.duration(props.video.contentDetails.duration) //Convert iso8601 string to object
  vidDuration = vd_aux.minutes() + ':' + vd_aux.seconds().toString().padStart(2, 0) // if seconds == 3, then "03"
  
  if (props.video.id) {
    return (

      <li className="video">
        <a href={"https://www.youtube.com/watch?v=" + id} >
          <img src={thumbnail} />
        </a>

        {/*<div> {pubAt.toString()} </div>*/}
        <h4> {title} </h4>
        <div> channel: {channelName} </div>
        <div> relative: {fromNowDate} </div>
        <div> Views: {viewCount} </div>
        <div> duration: {vidDuration} </div>
        <div> id: {id} </div>

      </li>

    );
  }
  else {
    return (
    <h4>  </h4>
    )
  }
}