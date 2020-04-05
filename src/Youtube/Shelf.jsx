import React, { useContext } from 'react';

import PropTypes from 'prop-types';

import { NumVidsContext } from '../Contexts/UserContext.js';
import Video from './Video.jsx'

const Shelf = props => {

  const { numVids, setNumVids } = useContext(NumVidsContext);
  const { shelfIdx, shelf } = props
  const renderMoreNum = 6
  let numVidzRendered = numVids[0] ? numVids[shelfIdx].numVids : 0
  let isMoreVidsAvailable = () => shelf.videos.length < numVids[shelfIdx].numVids;

  Shelf.propTypes = {
    shelfIdx: PropTypes.number.isRequired,
    shelf: PropTypes.shape({
      filters: PropTypes.array.isRequired,
      title: PropTypes.string.isRequired,
      videos: PropTypes.array.isRequired,
    }).isRequired,
  }

  function loadMoreVids() {
    
    // Pagination / Load More https://codepen.io/grantdotlocal/pen/zReNgE
    setNumVids(prev => {
      let newNumVids = { ...prev }
      newNumVids[shelfIdx].numVids = newNumVids[shelfIdx].numVids + renderMoreNum // Render 6 more vids after clicking "More"
      return newNumVids
    })
  }
  
  const videos = shelf.videos.slice(0, numVidzRendered).map((video) => {
    return (
      <Video key={video.id || 'somevidid'} video={video} />
    )
  })

  return (
    <div className=" yt-shelf-inner-wrap">
      <div className=" yt-shelf-title"> {shelf.title} </div>
      <ul className=" yt-shelf row">
        {videos}
      </ul>
      <div className="yt-loadmore-btn center-align">
        {!isMoreVidsAvailable() ? (
          <a
            onClick={loadMoreVids}
            className=" waves-effect waves-light btn"
          >
            <i className=" material-icons">expand_more</i>
          </a>
        )
          : null}
      </div>
    </div>
  )
}
export default Shelf