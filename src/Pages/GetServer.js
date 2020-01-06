import React, { useState, useEffect } from 'react';
import axios from 'axios';



// Basic get https://www.youtube.com/watch?v=bYFYF2GnMy8
function GetServer() {
  const [userSss, setUserSss] = useState(['']);
  const [users, setUsers] = useState(['']);
  const SPRING_BACKEND= 'http://' + process.env.REACT_APP_SPRINGB_DOMAIN // localhost:8080

  useEffect(() => {
    axios.get('https://jsonplaceholder.typicode.com/users')
      .then(res => {
        console.log(res);
        setUserSss(res.data)
      }).catch(err => {
        console.log(err);
      });

    axios.get(SPRING_BACKEND +'/all')
        .then(res2 => {
          console.log(res2);
          setUsers(res2.data)
        }).catch(error => {
          console.log("myServer fail");
          console.log(error);
          if (error.response) {
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
          }

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

      <h1>Get Local </h1>
      <ul> 
        {users.map((u) => (
          <li key={u.id} className="myget"> ID: {u.id} Name: {u.username} </li>
        ))}
      </ul>
    </div>
  );
}

export default GetServer;