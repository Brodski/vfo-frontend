import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../Contexts/UserContext.js'
import { ButtonsAuthDebug } from '../Components/ButtonsAuthDebug';
import { LoginLogout } from '../Components/LoginLogout'
import * as GApiAuth from '../HttpRequests/GApiAuth'
import { User } from '../Classes/User'
import { Subscription } from '../Classes/Subscription'
import * as ServerEndpoints from '../HttpRequests/ServerEndpoints';

import Sortable from 'react-sortablejs';
import PropTypes from 'prop-types';
import * as MySortables from '../Components/MySortables'
import * as SettingsLogic from '../BusinessLogic/SettingsLogic'

//  https://github.com/SortableJS/react-sortablejs


const AllShelfs = (props) => {

  console.log("AllShelfs props")
  console.log(props)
  //const shelfz = props.shelfs.map(sh => { return(<Shelf data-id={sh.title} shelfNames={sh.fewSubs.map(s => s.channelName)} />) } )
  //const shelfz = props.shelfs.map(sh => { return (<div data-id={sh.title}> this is some div <Shelf data-id={sh.title} shelfNames={sh.fewSubs.map(s => s.channelName)} /> </div>) } )
  const shelfz = props.shelfs.map(sh => {
    return (<Shelf key={sh.title} data-id={sh.title} title={sh.title} shelfNames={sh.fewSubs.map(s => s.channelName)} />)
  })

  console.log(shelfz)
  
  return (
    //<Shelf id={sh.title} data-id={sh.title} shelf={sh} />
    
    //<button onClick={() => console.log(props.shelfs) }> log all shelfs </button>

    <div>
      {shelfz}
    </div>

    )
  }


const Shelf = (props) => {
  console.log("Shelf")
  console.log(props)
  const [items, setItems] = useState([ ])

  useEffect(() => {
    updateShelf()
  }, [])

  function updateShelf() {
  console.log('p')
  console.log(props.shelfNames)
  console.log(props)
  //setItems(props.shelf.fewSubs.map(s => s.channelName))
  setItems(props.shelfNames)
  }
  function buttonLog(order) {
    console.log('items')
    console.log(items)
    console.log('props.shelfNames')
    console.log(props.shelfNames)
    console.log('order')
    console.log(order)
    
    var nestedSortablezDank = document.getElementById('dank')
    var nestedSortables = [].slice.call(document.querySelectorAll('.shelfList'));
    console.log('nestedSortables')
    console.log(nestedSortables)
    for (let i = 0; i < nestedSortables.length; i++) {
      console.log(nestedSortables[i].textContent);
  }
    
    }

  const itemz = props.shelfNames.map(s => (<div className="block" data-id={s} key={s} > {s} </div> )) 
  return (
  <div className="shelf">
      <h3> Custom Sub Shelf </h3>
      <button onClick={(order, sortable, evt) => buttonLog(order,sortable) }> log this Shelf </button>  
      <Sortable
        className="block-list shelfList"
        options={{
            group: 'shared'
        }} 
        tag="div"
        chosenClass="sortable-chosen" >
        {itemz}
      </Sortable>
    </div>
  )
  }
  


const SettingsOut = () => {

  return(
    <h1> Fool! Log in! </h1>
  )
}
export const Settings = () => {

  let mockShelf =[];
  let mockShelf2 =[];
  let mockUser;
  const { user, setUser } = useContext(UserContext);
  const [subs, setSubs] = useState([ ])
  const [shelfs, setShelfs] = useState([
    { 
      title: '',
      fewSubs: []
    }] )
    const [shelfs2, setShelfs2] = useState([
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
    await setShelfs2( fewSubz)

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

