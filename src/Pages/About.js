import React, { useState, useEffect }from 'react';
import  ReactSortable  from "react-sortablejs";
import * as ServerEndpoints from "../HttpRequests/ServerEndpoints"
import { User } from "../Classes/User"
//try
//https://github.com/clauderic/react-sortable-hoc
//https://codesandbox.io/s/react-sortable-hoc-starter-o104x95y86
const About = () => {
  const [count, setCount] = useState(0)
  
  const [dudes, setDudes] = useState([
    { id: 1, name: "shrek" },
    { id: 2, name: "fiona" },
    { id: 3, name: "donkey" }
  ]);

  const [user2, setUser2] = useState(new User())

  let mockUser
  useEffect(() => {
    console.log('djsjdfkl')
    console.log('djsjdfkl')
       mockUser= ServerEndpoints.getMockUser()
      setUser2(mockUser)
      
      },[])

  let ass = user2.customShelfs
  return (
    <div>
      <h1> About </h1>
      <ReactSortable 
        group="groupName"
        animation={200} 
       >
        {user2.customShelfs.map(sh => 
           (<div> {sh.title}lol </div>)
         )}
       </ReactSortable>
      

      <h3> sortable scratch </h3>
      <ReactSortable 
        group="groupName"
        animation={200} 
       >
        {dudes.map(item => (
        <div key={item.id}>{item.name}</div>
        ))}
       </ReactSortable>

      <h3>click thingy</h3>
          <div> count incremented {count} times </div>
          <button onClick={() => setCount(count + 1)}> click me  </button>
          <button onClick={() => console.log(user2) }> user  </button>
    </div>
  );
}

export default About;