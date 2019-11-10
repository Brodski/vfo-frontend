import React, { useState } from 'react';
import axios from 'axios';
import { myApikey } from '../api-key';



//MAIN https://developers.google.com/youtube/v3/getting-started
//       OAUTH https://developers.google.com/youtube/v3/libraries
//       JS API https://github.com/google/google-api-javascript-client
function Youtube() {
  console.log(myApikey);

  const sentIt = (e) => {
    e.preventDefault();
  //  axios.post('http://localhost:8080/userDebug', { "username": newUser }).then(res => { logShit(res) })
  }

  return (
    <div>
      <h1>Youtube</h1>
      <h3>{myApikey}</h3>

      <form onSubmit={sentIt}>
          <input type="text" name="username" />
          <button>Submit</button>
      </form>
    
    </div>
  );
}


function logShit(res) {
  console.log('----------------------------------------')
  console.log(`Status code: ${res.status}`);
  console.log(`Status text: ${res.statusText}`)
  console.log(`Request method: ${res.request.method}`)
  console.log(`Path: ${res.request.path}`)

  console.log(`Date: ${res.headers.date}`)
  console.log(`Date: ${res.headers}`)
  console.log(`Data: ${res.data}`)
  console.log(`Config: ${res.config}`)

  console.log(res.config);
}


export default Youtube;