import React from 'react';
import * as youtubeApi from '../HttpRequests/youtubeApi';
import { Video } from './Video'
//export async function XxxShelf(props) {

export const Shelf = props => {

/*
  console.log('++++++++++++++++ TOP +++++++++++++++++++++')

  console.log("PROPS")
  console.log(props)
  console.log(props.shelf)
  //https://stackoverflow.com/questions/30142361/react-js-uncaught-typeerror-this-props-data-map-is-not-a-function
  let data = Array.from(props.shelf)
  console.log('data')
  console.log(data)


  console.log('+++++++++++++++++++ END +++++++++++++++++++++++')
  */
  
    
  return(
    <div > SHELF
      <ul className="shelf">
        {props.shelf.map(vid => {
          return (
            <Video key={vid.id} video={vid} />
          )
        })}
        {/*data.map(vid => {
          return (
            <Video video={vid} />
          )
        })*/}
      </ul>
    </div>
  )
}






























//let shelf = Array.from(props.shelf)
//  console.log(Object.keys(props.shelf));

  /*
   * {props.shelf.map(act => {
          return (
            <div> {act.contentDetails} </div>
          )
        })
   */