/* eslint-disable prefer-destructuring */
/* eslint-disable react/destructuring-assignment */
/* See note below */

import React from 'react';

import PropTypes from 'prop-types';
import humanFormat from 'human-format';
import moment from 'moment';

const Video = (props) => {

  Video.propTypes = {
    video: PropTypes.shape({
      contentDetails: PropTypes.object.isRequired,
      id: PropTypes.string.isRequired,
      snippet: PropTypes.object.isRequired,
      statistics: PropTypes.object.isRequired,
    }).isRequired
  }


  function formatViewCount() {
    let viewCount;
    if (props.video.statistics.viewCount) {
      viewCount = humanFormat(parseInt(props.video.statistics.viewCount, 10), { decimals: 1 }).replace(/\s/g, '');
    } else {
      viewCount = ""
    }
    return viewCount
  }

  function formatVidLength() {
    let vDurAux = moment.duration(props.video.contentDetails.duration) //Convert iso8601 string to object
    let vidDuration;
    if (vDurAux.hours() > 0) {
      vidDuration = `${vDurAux.hours()}:${vDurAux.minutes().toString().padStart(2, 0)}:${vDurAux.seconds().toString().padStart(2, 0)}` // if seconds == 3, then "03"   
      // vidDuration = vDurAux.hours() + ':' + vDurAux.minutes().toString().padStart(2,0) + ':' + vDurAux.seconds().toString().padStart(2, 0) // if seconds == 3, then "03"   
    } else {
      vidDuration = `${vDurAux.minutes()}:${vDurAux.seconds().toString().padStart(2, 0)}` // if seconds == 3, then "03"
    }
    return vidDuration
  }


  // const { video: {
  //         id,
  //         snippet: {  
  //           title,
  //           thumbnail: {
  //               medium: {
  //                 url: thumbnail
  //               }
  //             }
  //           }
  //         }             
  //       } = props
  //
  // The destructuring of 3 variables (thumbnail, id, and title) is above. No way is that more readable. The performance gained is negligible. Sorry eslint. https://github.com/airbnb/javascript#destructuring--object
  let thumbnail = props.video.snippet.thumbnails.medium.url
  let id = props.video.id
  let title = props.video.snippet.title

  let channelName = props.video.snippet.channelTitle
  let fromNowDate = new moment(props.video.snippet.publishedAt).fromNow()
  // solution to Premium yt vids
  let viewCount = formatViewCount()
  let vidDuration = formatVidLength()

  if (id) {
    return (
      <li className="collection-item video col s12 m4 l3 xl2">
        <a href={`https://www.youtube.com/watch?v=${id}`}>
          <div className="vid-thumbnail-wrap">
            <img className="vid-thumnail" alt="video-thumbnail" src={thumbnail} />
            <span className="vid-timestamp"> {vidDuration} </span>
          </div>
        </a>
        <div className="vid-all-text-wrap">
          <div className="vid-title"> {title} </div>
          <div className="vid-info">
            <div className="vid-ch-txt"> {channelName} </div>
            <div> {fromNowDate} • {viewCount} views </div>
          </div>
        </div>

      </li>

    );
  }
  return (
    <h4>  </h4>
  )
}
export default Video