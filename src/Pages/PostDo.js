import React, { useState } from 'react';
import axios from 'axios';


function PostDo() {
// https://reactjs.org/docs/hooks-faq.html#should-i-use-one-or-many-state-variables
// DOC: "we recommend to split state into multiple state variables based on which values tend to change together."
  const [newUser, setUser] = useState('');
  const [newId, setId] = useState('');


  const sentIt = (e) => {
    e.preventDefault();
    //axios.post('https://jsonplaceholder.typicode.com/posts', { 'username': newUser, 'id': newId }).then(res => { logShit(res) })

    axios.post('http://localhost:8080/userDebug', { "username": newUser }).then(res => { console.log(res) })
    axios.post('http://localhost:8080/createUser', { "username": newUser }).then(res => { console.log(res) })
  }
    

  return (
    <div>
      <form onSubmit={sentIt} >
        "Username"<input type="text" name="username" value={newUser} onChange={e => setUser(e.target.value)} />
        "userId"<input type="text" name="id" value={newId} onChange={e => setId(e.target.value)} />
        <button>Submit</button>
      </form>
    </div>
  );
}


export default PostDo;