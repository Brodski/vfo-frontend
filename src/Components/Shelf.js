import React, { useState, useContext } from 'react';
import * as youtubeApi from '../HttpRequests/youtubeApi';
import { Video } from './Video'
import moment from 'moment'

//export async function XxxShelf(props) {

// Pagination / Load More
  //https://codepen.io/grantdotlocal/pen/zReNgE
export const Shelf = props => {

  /*
  console.log('++++++++++++++++ TOP +++++++++++++++++++++')

  console.log("PROPS")
  console.log(props)
  //https://stackoverflow.com/questions/30142361/react-js-uncaught-typeerror-this-props-data-map-is-not-a-function
  console.log('+++++++++++++++++++ END +++++++++++++++++++++++')
  */

  //const [numVids, setNumVids] = useState(3)

  function loadMoreVids() {
    //setNumVids(numVids + 5)
    props.setNumVids(prev => { //hacky solution :(
      let newN = { ...prev}
      newN[props._setIdx].numVids += 5 // Render 5 more vids after clicking "More"
      return newN

    })

  }

  let numVidzRendered = props.numVids[props._setIdx].numVids 

  const videos = props.shelf.videos.slice(0, numVidzRendered ).map( (vid,idx) => {
  //let id = vid.contentDetails.upload.videoId //FOR ACTS
  
   return( <Video isActs={props.isActs} key={vid.id} video={vid} /> )
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
