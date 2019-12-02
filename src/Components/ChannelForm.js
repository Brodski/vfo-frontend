import React, { useState } from 'react';
import * as youtubeApi from "../Pages/youtubeApi";

export const ChannelForm = () => {

  const [channel, setChannel] = useState('')
  const updateChannel = (e) => {
    setChannel(e.target.value)
  }

  return(
    <form onSubmit={youtubeApi.getChannelInfo}>
      <input type='text' onChange={updateChannel} />
      <button>Channel get</button>
    </form>
   )
}