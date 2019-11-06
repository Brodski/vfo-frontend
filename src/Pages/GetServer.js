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

      axios.get('http://localhost:8080/all')
        .then(res => {
          console.log(res);
          setUserSss(res.data)
        }).catch(err => {
          console.log("myServer fail");
          console.log(err)
        })
  }, [] ) //The 2nd argument "[]" means 'only run after first render'

  return (
    <div>
      <h1>Get Server, look at logs</h1>
      <ul>
        { userSss.map((user) => (
          <li className="myget" key={user.id} > ID: {user.id} Name: {user.name} </li>
          )) }
      </ul>
    </div>
  );
}

export default GetServer;