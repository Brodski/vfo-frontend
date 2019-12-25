import React, { useState, useEffect, Component } from 'react';

import * as ServerEndpoints from "../HttpRequests/ServerEndpoints"
import { User } from "../Classes/User"

import {SortableContainer, SortableElement} from 'react-sortable-hoc';
import arrayMove from 'array-move';






//try
//https://github.com/clauderic/react-sortable-hoc
//https://codesandbox.io/s/react-sortable-hoc-starter-o104x95y86
const About = () => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let mockUser = ServerEndpoints.getMockUser()
    setUser2(mockUser)
  }, [])

  const [user2, setUser2] = useState(new User())

  //const [thingz, setThingz] = useState(['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6'])

  const [thingz, setThingz] = useState([{ a: 'Item 1lol' }, { a: 'Item 2' }, { a: 'Item 3' }, { a: 'Item 4' }, { a: 'Item 5' }, { a: 'Item 6' }])


  function onSortEnd({ oldIndex, newIndex }) {
    console.log('oldIndex')
    console.log(oldIndex)
    console.log(newIndex)
    setUser2(prev => {
      let poo = arrayMove(user2.customShelfs, oldIndex, newIndex)
      prev.customShelfs = poo
      return prev
    })
  };



  const SortableItem = SortableElement( (  props ) => {
  //console.log('props.value')
  //console.log(props.value)
  return(
    <div className={'subitem'}>{props.value.title}</div>
  )})


const SortL2 = SortableContainer( ( props ) => {
console.log("SORT CONTAINER!!!")

console.log(props)
  return (
    <div className={'flex-subshelf-container'}>
      <div className={'custom-shelf'}>
        {props.items.customShelfs.map(( x, index) => (
          <SortableItem key={`item-${x.title}`}
            index={index}
            value={x}
          />
        ))}
      </div>
    </div>
  );
});


//<SortL items={thingz} onSortEnd={onSortEnd} />
  return (
    <div>
      <h1> About </h1>
      <button onClick={() => { console.log(thingz) }}> log thingz </button>
      <button onClick={() => { console.log(user2) }}> log user2 </button>
       
      <SortL2 items={user2} onSortOver={onSortEnd} />
      <h3>click thingy</h3>
          <div> count incremented {count} times </div>
          <button onClick={() => setCount(count + 1)}> click me  </button>
          <button onClick={() => console.log(user2) }> user  </button>
    </div>
  );
}

export default About;