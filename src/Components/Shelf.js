import React, { useState } from 'react';
import * as youtubeApi from '../HttpRequests/youtubeApi';
import { Video } from './Video'
//export async function XxxShelf(props) {

// Pagination / Load More
  //https://codepen.io/grantdotlocal/pen/zReNgE
export const Shelf = props => {

/*
  console.log('++++++++++++++++ TOP +++++++++++++++++++++')

  console.log("PROPS")
  console.log(props)
  console.log(props.shelf)
  //https://stackoverflow.com/questions/30142361/react-js-uncaught-typeerror-this-props-data-map-is-not-a-function
  console.log('+++++++++++++++++++ END +++++++++++++++++++++++')
 */
        
  const [numVids, setNumVids] = useState(3)
  
  
  function loadMoreVids() {
    setNumVids(numVids + 5)
  }

  const videos = props.shelf.videos.slice(0, numVids).map(vid => <Video isActs={props.isActs} key={vid.id} video={vid} /> )
  return(
    <div > SHELF
      <ul className="shelf">
        {videos}
      </ul>
      <button onClick={loadMoreVids} > More...? </button>
    </div>
  )
}
