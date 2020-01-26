import React, { Fragment, useContext, useEffect } from 'react';

import M from 'materialize-css'
import PropTypes from 'prop-types';
import nextId  from "react-id-generator";

import * as stLogic from '../BusinessLogic/SettingsLogic';
import { UserSettingsContext } from '../Contexts/UserContext.js'
import CustomShelf  from '../Classes/CustomShelf'
import ShelfSetting from './ShelfSetting.jsx';


// SortedShelfs = the containers on the right
// UnsortedShelfs="Your Subscriptions" on the left
const AllShelfs = (props) => {
  
  const { userSettings, setUserSettings } = useContext(UserSettingsContext);
  const {save} = props

  AllShelfs.propTypes = {
    save: PropTypes.func.isRequired 
  }
  

  useEffect( () => {
    let elems = document.querySelectorAll('select');
    M.FormSelect.init(elems, {});

  },[])

  
  function addShelf() {
    
    // Get the current state of all shelfs, then push new shelf
    setUserSettings(prevUserSetting => {
      let newS = { ...prevUserSetting }
      newS.customShelfs = stLogic.queryShelfs(userSettings, true)
      
      let cs = new CustomShelf()
      cs.title = "New Shelf"  
      cs.isSorted = true;
      newS.customShelfs.push(cs)
      return newS
    })
  }

  function prepTheYourSubscriptionsShelf() {
    // NOTE: I want to run: "userSettings.convertUnSortedShelfsToSubs()"  but cant b/c spred operator ({...prevUserSetting}) does not maintian the objects class methods
    let aux_unSortedSh = userSettings.customShelfs.filter( sh => { return !sh.isSorted } )
    let unSortedSubs = []
    aux_unSortedSh.forEach( sh => {
      sh.fewSubs.forEach(sub => { unSortedSubs = unSortedSubs.concat(sub) })
    })
    let unSortedSh = [new CustomShelf()]
    unSortedSh[0].isSorted = false
    unSortedSh[0].title = "Your Subscriptions"
    unSortedSh[0].fewSubs = unSortedSubs

    return unSortedSh
  }

  function prepSortedShelfs() {
    let sortedSh = userSettings.customShelfs.filter( sh => { return sh.isSorted } )
    if (!sortedSh[0]) {
        let c = new CustomShelf();
        c.title = 'New Shelf'
        c.isSorted = true
        c.customShelfs = []
        sortedSh.push(c)
      } 
    return sortedSh
  }

  const SortedShelfs = () => {
    let sortedSh = prepSortedShelfs()
    let sortedShelfz = sortedSh.map(sh => {
      let id = nextId('shelfid-')
      return (
        <ShelfSetting 
          key={id} 
          bindToId={id} 
          shelf={sh} 
          
        />
        )
    })
    return (
      <div> 
        {sortedShelfz} 
        <div className="center-align">
          <a 
            id="add-more-btn"
            onClick={addShelf}
            className=" btn"
          >  
            <i className=" material-icons">add</i>
          </a>
        </div>
      </div>
      )
  }
  // UnsortedShelfs="Your Subscriptions" on the left
  const UnSortedShelfs = () => {
    let unSortedSh = prepTheYourSubscriptionsShelf()
    
    let unSortedshelfz = unSortedSh.map( sh => {
      let id = nextId('unsortShelf-')
      return (
        <ShelfSetting 
          key={id} 
          bindToId={id} 
          shelf={sh} 
        />
      )
    })
    return ( 
      <div> 
        {unSortedshelfz}
        <div className='div-aux' />
      </div>
      )
  }

  return (
    <Fragment>
      <div className="set-top-bothalf">
        <a className=" btn " onClick={save}>Save</a> 
      </div>
      <div className="row ">
        <div className="col m6 s12">
          <UnSortedShelfs />
        </div>
        <div className="col m6 s12">
          <SortedShelfs />
        </div>
      </div>
    </Fragment>
    )
  }
  export default AllShelfs