import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../Contexts/UserContext.js'
import { ButtonsAuthDebug } from '../Components/ButtonsAuthDebug';
import { LoginLogout } from '../Components/LoginLogout'
import * as GApiAuth from '../HttpRequests/GApiAuth'
import { User } from '../Classes/User'
import { Subscription } from '../Classes/Subscription'
import * as ServerEndpoints from '../HttpRequests/ServerEndpoints';

import * as NestedStuff from '../Components/NestedStuff'

import Sortable from 'react-sortablejs';
import Sortable2 from 'sortablejs';
import PropTypes from 'prop-types';
import * as MySortables from '../Components/MySortables'
import * as SettingsLogic from '../BusinessLogic/SettingsLogic'

//  https://github.com/SortableJS/react-sortablejs




const AllShelfs = (props) => {

  console.log("AllShelfs props")
  console.log(props)
  const shelfz = props.shelfs.map(sh => {
    return (<Shelf key={sh.title} title={sh.title} shelfNames={sh.fewSubs.map(s => s.channelName)} />)
  })

  console.log(shelfz)
  
  return (
    <div>
      {shelfz}
    </div>

    )
  }


const Shelf = (props) => {
  console.log("Shelf")
  console.log(props)
  const [items, setItems] = useState([ ])

  useEffect(() => { updateShelf() }, [])

  function updateShelf() {
    setItems(props.shelfNames)
  }

  var nestedSortables = [].slice.call(document.querySelectorAll('.subListWrapper'));
  for (var i = 0; i < nestedSortables.length; i++) {
    new Sortable2(nestedSortables[i], {
      group: 'nested',
      animation: 150,
      fallbackOnBody: true,
      swapThreshold: 0.65
    });
  }

  var nestedShelf = [].slice.call(document.querySelectorAll('.shelf'));
  for (var i = 0; i < nestedShelf.length; i++) {
	new Sortable2(nestedShelf[i], {
		group: 'shelf',
		animation: 150,
		fallbackOnBody: true,
		swapThreshold: 0.65
	});
  }
    


  function buttonLog(order) {
    console.log('items ' + items)
    console.log('order ' + order)
    
    var nestedSortablezDank = document.getElementById('dank')
    var nestedSortables = [].slice.call(document.querySelectorAll('.subListWrapper'));
    console.log('nestedSortables')
    console.log(nestedSortables)
    for (let i = 0; i < nestedSortables.length; i++) {
      console.log('nestedSortables[i]');
     // console.log(nestedSortables[i]);
      console.log(nestedSortables[i].dataset.id);
      console.log(nestedSortables[i].childNodes);
      console.log("BAM!");
      console.log(nestedSortables[i].querySelectorAll('.block').innerHTML);
      console.log(nestedSortables[i].querySelectorAll('.block'));
   //   console.log(nestedSortables[i].textContent);
  }

    var nestedShelf = [].slice.call(document.querySelectorAll('.shelf'));
       console.log('nestedShelf')
    console.log(nestedShelf)
    for (let i = 0; i < nestedShelf.length; i++) {
      console.log('=-=-=-=-=-=-=-=-=-=-=');
      console.log('nestedShelf[i]');
      console.log(nestedShelf[i]);
      console.log(nestedShelf[i].dataset.name);
      console.log(nestedShelf[i].textContent);
      console.log(nestedShelf[i].childNodes);

    }
    }

  const itemz = props.shelfNames.map(s => (<div className="block" data-id={s} key={s} > {s} </div> )) 
  return (
    <div className="shelf" data-name={props.title}>
    <div>
      <h3> Custom Sub Shelf </h3>
      <button onClick={(order, sortable, evt) => buttonLog(order,sortable) }> log this Shelf </button>  
      <div className="subListWrapper">
        {itemz}
        </div>
    </div>
  </div>
  )
  }
  


const SettingsOut = () => {

  return(
    <h1> Fool! Log in! </h1>
  )
}
export const SettingsNEW = () => {

  let mockUser;
  const { user, setUser } = useContext(UserContext);
  const [subs, setSubs] = useState([ ])
  const [shelfs, setShelfs] = useState([
    { 
      title: '',
      fewSubs: []
    }] )
  
  useEffect(() => {
    getShit()
  }, []);
    
  async function getShit() {
    mockUser = await ServerEndpoints.getMockUser() //Probably will "setSubs(actualUser)" in future
    await setSubs(mockUser.subscriptions) 
    console.log('getShit mockUser')
    console.log(mockUser)
    console.log('mockUser.subscriptions')
    console.log(mockUser.subscriptions)
    console.log(mockUser.customShelfs)
    console.log("--------Doing 'setShelfs( mockUser.customShelfs)'------")
    await setShelfs( mockUser.customShelfs )
    let fewSubz = mockUser.customShelfs.map( shelf => shelf.fewSubs.map( s => s.channelName))

  }

  function shelfsButton() {
    console.log('shelfs')
    console.log(shelfs)
    console.log(  'mockUser.customShelfs')  
    console.log(  mockUser.customShelfs)  
}

  //<CustomSubShelf shelf={shelfs[0]}/>    
  //  {!user ? <SettingsOut /> : <UnsortedSubsShelf  mockUser={subs}/> }
    return (
    <div>  
        <NestedStuff.Nested />
        <LoginLogout user={user}/>
        
        <button onClick={() => setUser('man this is it')} > change user message </button>
        <button onClick={() => console.log(subs)} > Log Subs </button>
        <button onClick={() => shelfsButton()} > Log shelfs </button>
        
        <AllShelfs shelfs={shelfs} setShelf={setShelfs}/>
      <h1> ```````````````````````` </h1>
        


      <MySortables.AllThisSortableStuff/>
      <ButtonsAuthDebug/>
    </div>
  );
}

