import React from 'react';
import * as youtubeApi from "../Pages/youtubeApi";

//export async function XxxShelf(props) {
export const XxxShelf =  props => {
console.log('++++++++++++++++ TOP +++++++++++++++++++++')
  
  console.log("PROPS")
  console.log(props)

  const acts_Promises = props.shelfInfo.subscriptions.map(sub => youtubeApi._getActivities(sub.channelId))     

  const acts_Response =  Promise.all(acts_Promises)

  console.log('acts_Response')
  console.log(acts_Response)
  console.log('+++++++++++++++++++ END +++++++++++++++++++++++')
  return(
    <div>
      <h2> props.shelfInfo.subscriptions[0].channelId </h2>
    </div>
  )
}