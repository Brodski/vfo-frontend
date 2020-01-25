import React, { useState, useContext } from 'react';
import * as youtubeApi from '../HttpRequests/youtubeApi';
import Video from './Video'
import moment from 'moment'
import PropTypes from 'prop-types';
// Pagination / Load More
// https://codepen.io/grantdotlocal/pen/zReNgE

const Shelf = props => {

  Shelf.propTypes = {
    shelfIdx: PropTypes.number.isRequired,
    setNumVids: PropTypes.func.isRequired,
    //numVids: PropTypes.arrayOf(PropTypes.object).isRequired,

    numVids: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.arrayOf(PropTypes.object)
    ]).isRequired,

    shelf: PropTypes.shape({
      filters: PropTypes.array.isRequired,
      title: PropTypes.string.isRequired,
      videos: PropTypes.array.isRequired,
    }).isRequired,

  }
   const {shelfIdx, setNumVids, numVids, shelf} = props

  /*
  console.log(' ***************** SHELF ***********************')
  console.log('numVids')
  console.log(numVids)
  console.log(shelfIdx)
  console.log(numVids[shelfIdx])
  */

  const renderMoreNum = 6

  function loadMoreVids() {
    // if (shelf.videos.length < numVids[shelfIdx].numVids  ) { //isMoreVidsAvailable(){    
    //   console.log('All vids rendered')
    // }
    setNumVids(prev => { 
      let newNumVids = { ...prev}
      newNumVids[shelfIdx].numVids = newNumVids[shelfIdx].numVids + renderMoreNum // Render 6 more vids after clicking "More"
      return newNumVids
    })
  }
  function isMoreVidsAvailable() { 
    return shelf.videos.length < numVids[shelfIdx].numVids
  }

  let numVidzRendered = numVids[0] ? numVids[shelfIdx].numVids  : 0

  const videos = shelf.videos.slice(0, numVidzRendered ).map( (video) => {
    return( 
      <Video key={video.id || 'somevidid'} video={video} /> 
    )
  })


  return(
    <div className=" yt-shelf-inner-wrap">
      <div className=" yt-shelf-title"> {shelf.title} </div>
      {/* <div className=" yt-videos-wrap" > */}
      {/* TODO NOTICE THIS!!! COLLECTION UI DIFF */}
      {/* <ul className="collection yt-shelf row">  */}
      <ul className=" yt-shelf row">  
        {videos}
      </ul>
      {/* </div> */}
      <div className="yt-loadmore-btn center-align">
        {!isMoreVidsAvailable() ? (
          <a 
            onClick={loadMoreVids}
            className=" waves-effect waves-light btn"
          >  
            <i className=" material-icons">expand_more</i>
          </a>
        ) 
        : null }
      </div>      
    </div>
  )
}
export default Shelf