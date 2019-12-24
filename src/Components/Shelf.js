import React, { useState } from 'react';
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
  //  console.log(props.shelf)
  //https://stackoverflow.com/questions/30142361/react-js-uncaught-typeerror-this-props-data-map-is-not-a-function
  console.log('+++++++++++++++++++ END +++++++++++++++++++++++')
   */

  const [numVids, setNumVids] = useState(3)


  function loadMoreVids() {
    setNumVids(numVids + 5)
  }

  function doesItPassFilter(vid) {
    //Find the filter that matches the vid's channel
    console.time('doesItPassFilter()')
    for (let f of props.shelf.filters) {
      if (f.id == vid.snippet.channelId) {
        //after found, apply filter
        let duration = moment.duration(vid.contentDetails.duration)
        let isPass = f.checkDurations(duration.minutes() + (duration.seconds() / 60))
    //    console.log('isPass')
  //      console.log(isPass)
//        console.timeEnd('doesItPassFilter()')
        return isPass;
      }
    }
    console.log("SOMETHING WENT WRONG")
    return true
  }

  const videos = props.shelf.videos.slice(0, numVids).map(vid => {
    //if (doesItPassFilter(vid) == false) {
  //    return null
//    }
   return( <Video isActs={props.isActs} key={vid.snippet.channelId} video={vid} /> )
  })
  return(
    <div > SHELF
      <ul className="shelf">
        {videos}
      </ul>
      <button onClick={loadMoreVids} > More...? </button>
    </div>
  )
}
