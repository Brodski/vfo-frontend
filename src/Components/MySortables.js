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

//SortableList.propTypes = {
  //  items: PropTypes.array,
  //  onChange: PropTypes.func
//};

export const GeneralList = () => {
  const [items, setItems] = useState([1, 2, 3, 4, 5, 6])
  return (
        <div>
        
          <h3> General list </h3>
        <SortableList items={items} onChange={(items) => { setItems(items); }} />
        </div>
    )
}


export const Fruits = () => {
  const [fruits, setFruits] = useState(['Apple', 'Banana', 'Cherry', 'Guava', 'Peach', 'Strawberry'])
  const fruitz = fruits.map(val => (<li data-id={val}>{val}</li>));

  return (
    <div>
      <h3> Fruits </h3>
      <Sortable> {fruitz} </Sortable>
    </div>
  )

}


export const FruitsSort = () => {

  const [fruits, setFruits] = useState(['Apple', 'Banana', 'Cherry', 'Guava', 'Peach', '123 Strawberry', 'Strawberry'])
  const fruitz = fruits.map(val => (<div className="block" data-id={val}>{val}</div>));
  

  let sortable = null; // sortable instance
  const reverseOrder = (evt) => { const order = sortable.toArray(); setFruits(order.reverse()); };
  const sortOrder = (evt) => { const order = sortable.toArray(); setFruits(order.sort()) };
  const logNSet = (evt) => { 
    const order = sortable.toArray(); 
    setFruits(order);
    console.log("fruits: "); 
    console.log(fruits)
  };

  //className="block-list" 
  return (
    <div>
      <h3> Fruits Sort </h3>
      <button type="button" onClick={reverseOrder}>Reverse Order</button>
      <button type="button" onClick={sortOrder}>Sort Order</button>
      <button type="button" onClick={logNSet}>Log and Set</button>
      <Sortable 
        options={{ 
          animation: 200,
          swapThreshold: .5,     
        }}
        className="block-list" 
        invertSwap="true"
        chosenClass="sortable-chosen" 
        ref={(c) => { if (c) { sortable = c.sortable } } }
        //onChange={(order, sortable, evt) => { sortOrder(order) }} >
        //onChange={(order, sortable, evt) => {testThing(order) }} >
        onChange={(order, sortable, evt) => {setFruits(order) }} >
        {fruitz}
      </Sortable>
    </div>
  )

}

export const SortableList = ({ items, onChange }) => {

  var sortable = null
  const reverseOrder = (evt) => {
      const order = sortable.toArray();
      onChange(order.reverse());
  };
  /*
   const fruitz = fruits.map(val => 
  <div className="block" data-id={val} >
          
          <li keys={val} data-id={val} className="block">List Item: {val}
          </li>
        </div> 
   * (<i className="fas fa-grip-lines block" data-id={val} > <div className="block" > this is val {val}</div> </i>) );
   */ 
  const listItems = items.map(val => 
      <div className="block"  keys={val}  data-id={val}> 
        <i className="fas fa-grip-lines block handle" data-id={val}/>
      List Item: {val} 
    </div> ) 
      
    
  

  return (
      <div>
          <button type="button" onClick={reverseOrder}>Reverse Order</button>
          <Sortable
            
            options={{ 
              animation: 100,
              swapThreshold: .1,     
              handle: ".handle"
            }}
            
            className="block-list" 
            chosenClass="sortable-chosen" //THIS IS THE DEFAULT CLASSNAME, CHOOSING MY CUSTOM WONT WORK
            onChange={(order, sortable, evt) => { onChange(order); }} >
          {listItems}
          </Sortable>
      </div>
  );
};

          
		  
export const SharedGroup2 = ({ items, onChange }) => {

    const subz = items.map(s => (
      <div className="block" data-id={s} key={s} > {s} </div>  
    ))

  return (
    <div>
    <Sortable
      className="block-list"
      options={{
          group: 'shared'
      }} 
      chosenClass="sortable-chosen" >
      {subz}
    </Sortable>
    </div>
  );
}



export const SharedGroup = ( props ) => {
  const itemz = props.items.map(val => ( 
        <div className="block" data-id={val} >
        <li key={val} data-id={val} > { val } </li>  
        </div>
      ))
  return (
    <div>
    <Sortable
      className={"block-list"}
      options={{
          group: 'shared'
      }} >    
      {itemz}
    </Sortable>
    </div>
  );
}

export const ControlGroup = ( props ) => {
    const [fruits, setFruits] = useState(['Apple', 'Banana', 'Cherry', 'Guava', 'Peach', 'Strawberry'])
    const items = fruits.map(val => (<div className="block"  key={val} data-id={val}>{val}</div>));

        return (
            <div >
                <h3> Control group </h3>
                <Sortable
                    className="block-list"
                    onChange={(order, sortable, evt) => {
                        setFruits( order );
                    }}>
                    {items}
                </Sortable>
            </div>
        );
    }


export const AllThisSortableStuff = () => {

  return (
    <div>
      <h3>====== Sortables testing & examples  =======</h3>
        <FruitsSort />
        <GeneralList />
        <Fruits />
      <h3> Shared grup </h3>
        <SharedGroup items={['Apple', 'Banana', 'Cherry', 'Grape']} />
          <h4> (shared) extra space for testing </h4>
        <SharedGroup items={['Lemon', 'Orange', 'Pear', 'Peach']} />
        <ControlGroup />
        <h3>====================================</h3>
    </div>
    )
}