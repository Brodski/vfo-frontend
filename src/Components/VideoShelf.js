import React from 'react'
import { Video } from './Video'

export const VideoShelf = (props) => {
console.log("VIDEO SHELF COMP ")
console.log(props)
console.log(props.videoList)
    const myVidShelf = props.videoList.map((vid) =>
      <Video key={vid.id} video={vid}/>
    );
    return (
      <div> 
        <h1> ======================================= </h1>
        {myVidShelf}
        <h1> ======================================= </h1>
      </div>  
      )
  }