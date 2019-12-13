import React from 'react';
import moment from 'moment';


//
// Expect an activity object from youtube 
//
export const Video = (props) => {
  //console.log(' xxxxxxxxx VIDEO xxxxxxxxxxxxx')
 // console.log('props')
//  console.log(props)
 // console.log(props.video.id)
//  console.log(props.video.snippet.channelTitle)

  //console.log(props.video)
  //console.log(props.video.snippet.title)
  
  let thumbnail     = props.video.snippet.thumbnails.medium.url
  let id            = props.video.id
  let title         = props.video.snippet.title
  let pubAt         = new Date( props.video.snippet.publishedAt )
  let viewCount     = props.video.statistics.viewCount
  let channelName   = props.video.snippet.channelTitle
  let fromNowDate   = new moment(props.video.snippet.publishedAt).fromNow()    
    
  let vd_aux        = moment.duration( props.video.contentDetails.duration ) //Convert iso8601 string to object
  let vidDuration       = vd_aux.minutes() + ':' + vd_aux.seconds().toString().padStart(2, 0) // if seconds == 3, then "03"
  

  return (

    <li className="video">
      <h3> -- {title} -- </h3>
      
      <a href={"https://www.youtube.com/watch?v="+id} >
        <img src={thumbnail} /> 
      </a>
      
      {/*<div> {pubAt.toString()} </div>*/}
      <div> {title} </div>
      <div> channel: {channelName} </div>
      <div> relative: {fromNowDate} </div>
      <div> Views: {viewCount} </div>
      <div> duration: {vidDuration } </div>
      <div> id: {id} </div>
  
  </li>
    
  );
}