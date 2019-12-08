import React, { useState, useContext } from 'react';
import { UserContext } from '../Contexts/UserContext.js'
import { ButtonsAuthDebug } from '../Components/ButtonsAuthDebug';
import { LoginLogout } from '../Components/LoginLogout'
import * as GApiAuth from '../HttpRequests/GApiAuth'
import { User } from '../Classes/User'
import { Subscription } from '../Classes/Subscription'
import * as ServerEndpoints from '../HttpRequests/ServerEndpoints';

import Sortable from 'react-sortablejs';
import PropTypes from 'prop-types';


//
// Sortable https://sortablejs.github.io/Sortable/
// git https://github.com/SortableJS/react-sortablejs
// examples https://github.com/SortableJS/react-sortablejs/blob/master/examples/index.jsx

export const SortableList = ({ items, onChange }) => {

  

  let sortable = null; // sortable instance
  const reverseOrder = (evt) => {
      const order = sortable.toArray();
      onChange(order.reverse());
  };
  const listItems = items.map(val => 
    (
        <li keys={val} data-id={val} className="block">List Item: {val}
        </li>
      
    )
  );

  return (
      <div>
          <button type="button" onClick={reverseOrder}>Reverse Order</button>
          <Sortable
            options={{ 
              animation: 150,
                
            }}
            className={"block-list my-handle"}  
            ref={(c) => { if (c) { sortable = c.sortable; } }}
            onChange={(order, sortable, evt) => {
              console.log('order');
              console.log(order);
              console.log(onChange)
              onChange(order);
              }} >
            {listItems}
          </Sortable>
      </div>
  );
};

//          <i className="fas fa-grip-lines block" />
		  
SortableList.propTypes = {
    items: PropTypes.array,
    onChange: PropTypes.func
};


export const GeneralList2 = () => {

  const [itemz, setItemz] = useState([10, 20, 30, 40, 50, 60])

  function myBtnShit(e) {
  const order = itemz.toArray();
            setItemz(itemz.sort(order.reverse()));
  }
  
  const simpleList = itemz.map(val => ( 
      <li data-id={val}> list Item {val} </li>
      ))
  return (
      <div>
        <button
        type="button"
        onClick={myBtnShit}>
        Reverse this shit 
        </button>
      <Sortable
          options={{
              animation: 150
          }}
          className="block-list"
          ref={c => {
              if (c) {
                  setItemz(c.sortable);
              }
          }}>
          {simpleList}
      </Sortable>
      </div>
    

    )
}

export const GeneralList = () => {

  const [items, setItems] = useState([1, 2, 3, 4, 5, 6])
  
  return (
        <SortableList
          items={items}
          onChange={(items) => {
            setItems(items);
          }} >

        </SortableList>
    )
  
}

export const Fruits = () => {

  const [fruits, setFruits] = useState(['Apple', 'Banana', 'Cherry', 'Guava', 'Peach', 'Strawberry'])
  const fruitz = fruits.map(val => (<li data-id={val}>{val}</li>));

  return (
    <Sortable> {fruitz} </Sortable>
  )

}