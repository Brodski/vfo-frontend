import React, { useState, useEffect } from 'react';
import axios from 'axios';

function GetServer() {
  const [userSss, setUserSss] = useState(['']);
  const [users, setUsers] = useState(['']);

  useEffect(() => {
    axios.get('https://jsonplaceholder.typicode.com/users')
      .then(res => {
        console.log(res);
        setUserSss(res.data)
      }).catch(err => {
        console.log("WHY!")
      });

    const r2 = await axios.get('http://127.0.0.1:8080/all')
    console.log(r2);
    setUsers(r2.data)
    
        })
  }, [] ) //The 2nd argument "[]" means 'only run after first render'

  return (
    <div>
      <h1>Get host </h1>
      <ul>
        { userSss.map((u) => (
          <li key={u.id} className="myget"> ID: {u.id} Name: {u.name} </li>
          )) }
      </ul>
    </div>
  );
}

export default GetServer;