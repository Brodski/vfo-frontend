import React, { useState, useContext } from 'react';
import * as youtubeApi from '../HttpRequests/youtubeApi';
import { Video } from './Video'
import moment from 'moment'

//export async function XxxShelf(props) {

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
    props.setNumVids(prev => { 
      let newN = { ...prev}
      newN[props._setIdx].numVids += 5 // Render 5 more vids after clicking "More"
      return newN
    })
  }

  let numVidzRendered = props.numVids[0] ? props.numVids[props._setIdx].numVids  : 0

  const videos = props.shelf.videos.slice(0, numVidzRendered ).map( (video) => {
    return( 
      <Video key={video.id || 'somevidid'} video={video} /> 
    )
  })
  return(
    <div > 
      <h2> {props.shelf.title} </h2>
      <ul className="shelf">
        {videos}
      </ul>
      <button onClick={loadMoreVids} > More...? </button>
    </div>
  )
}
