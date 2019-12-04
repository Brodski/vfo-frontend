import React from 'react';
import * as youtubeApi from "../Pages/youtubeApi";

//export async function XxxShelf(props) {
export const Shelf = props => {
  console.log('++++++++++++++++ TOP +++++++++++++++++++++')

  console.log("PROPS")
  console.log(props)
  console.log(props.shelf)

  //const acts_Promises = props.shelfInfo.subscriptions.map(sub => youtubeApi._getActivities(sub.channelId))     
  //  const acts_Response =  Promise.all(acts_Promises)


  /*
   * {props.shelf.map(act => {
          return (
            <div> {act.contentDetails} </div>
          )
        })
   * 
   */
  let shelf = Array.from(props.shelf)
  console.log(Object.keys(props.shelf));

  //shelf.map(element => console.log(element.snippet.channelTitle));
  console.log('+++++++++++++++++++ END +++++++++++++++++++++++')
  
    
  return(
    <div> huh
    </div>
  )
}