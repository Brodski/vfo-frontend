import React, { useState, useContext } from 'react';
import * as youtubeApi from '../HttpRequests/youtubeApi';
import { Video } from './Video'
import moment from 'moment'

// Pagination / Load More
  //https://codepen.io/grantdotlocal/pen/zReNgE
export const Shelf = props => {
  /*
  console.log(' ***************** SHELF ***********************')
  console.log('props.numVids')
  console.log(props.numVids)
  console.log(props._setIdx)
  console.log(props.numVids[props._setIdx])
  */
  function loadMoreVids() {
    if (props.shelf.videos.length < props.numVids[props._setIdx].numVids  ) { //isMoreVidsAvailable(){    
      console.log('All vids rendered')
    }
    props.setNumVids(prev => { 
      let newNumVids = { ...prev}
      newNumVids[props._setIdx].numVids += 5 // Render 5 more vids after clicking "More"
      return newNumVids
    })
  }
  function isMoreVidsAvailable() { 
    return props.shelf.videos.length < props.numVids[props._setIdx].numVids
  }

  let numVidzRendered = props.numVids[0] ? props.numVids[props._setIdx].numVids  : 0

  const videos = props.shelf.videos.slice(0, numVidzRendered ).map( (video) => {
    return( 
      <Video key={video.id || 'somevidid'} video={video} /> 
    )
  })


  return(
    <div className=" yt-shelf-inner-wrap">
      <div className=" yt-shelf-title"> {props.shelf.title} </div>
      {/* <div className=" yt-videos-wrap" > */}
        <ul className=" shelf">
          {videos}
        </ul>
      {/* </div> */}
      <div className="yt-loadmore-btn center-align">
        {!isMoreVidsAvailable() ? <a 
          onClick={loadMoreVids}
          className=" waves-effect waves-light btn">  
          <i className=" material-icons">expand_more</i>
        </a> : null }
      </div>
    </div>
  )
}
