import React, { useState } from 'react';
import axios from 'axios';


function PostDo() {
// https://reactjs.org/docs/hooks-faq.html#should-i-use-one-or-many-state-variables
// DOC: "we recommend to split state into multiple state variables based on which values tend to change together."
  const [newUser, setUser] = useState('');
  const [newId, setId] = useState('');


  const sentIt = (e) => {
    e.preventDefault();
    axios.post('https://jsonplaceholder.typicode.com/posts', {
      'username': newUser,
      'idz': newId
     }).then(res => {
      logShit(res);
    })

    axios.post('http://localhost:8080/actualCreate', {
        'username': newUser,
        'idz': newId
      }).then(res => {
      logShit(res);
    })
  }
    

  return (
    <div>
      <form onSubmit={sentIt} >
        <input type="text" name="username" value={newUser} onChange={e => setUser(e.target.value)} />
        <input type="text" name="id" value={newId} onChange={e => setId(e.target.value)} />
        <button>Submit</button>
      </form>
    </div>
  );
}

//https://www.npmjs.com/package/axios#handling-errors
function handleError(error) {
  if (error.response) { // response != 2xx
    console.log(error.response.data);
    console.log(error.response.status);
    console.log(error.response.headers);
  } else if (error.request) { // request sent but recieved no response
    console.log(error.request);
  } else { 
    console.log('Error', error.message);
  }
  console.log(error.config);
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

export default PostDo;