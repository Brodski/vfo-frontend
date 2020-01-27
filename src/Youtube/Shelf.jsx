import React from 'react';

import PropTypes from 'prop-types';

import Video from './Video.jsx'

// Pagination / Load More https://codepen.io/grantdotlocal/pen/zReNgE

const Shelf = props => {

  const { shelfIdx, setNumVids, numVids, shelf } = props
  const renderMoreNum = 6
  let numVidzRendered = numVids[0] ? numVids[shelfIdx].numVids : 0

  Shelf.propTypes = {
    shelfIdx: PropTypes.number.isRequired,
    setNumVids: PropTypes.func.isRequired,
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

  function loadMoreVids() {

    setNumVids(prev => {
      let newNumVids = { ...prev }
      newNumVids[shelfIdx].numVids = newNumVids[shelfIdx].numVids + renderMoreNum // Render 6 more vids after clicking "More"
      return newNumVids
    })
  }

  function isMoreVidsAvailable() {
    return shelf.videos.length < numVids[shelfIdx].numVids
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