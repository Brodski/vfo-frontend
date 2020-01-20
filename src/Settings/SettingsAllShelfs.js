import React, { useState, useContext, useEffect } from 'react';
import {SettingsShelf} from '../Settings/SettingsShelf';
import * as stLogic from '../BusinessLogic/SettingsLogic';
import { User, CustomShelf } from '../Classes/User'
import { rename } from 'fs';
import { RenameDialog } from './RenameDialog';
import nextId  from "react-id-generator";
import M from 'materialize-css'

//SortedShelfs = the containers on the right
//UnsortedShelfs="Your Subscriptions" on the left
export const AllShelfs = (props) => {

  useEffect( () => {
    let elems = document.querySelectorAll('select');
    let instances = M.FormSelect.init(elems, {});

  },[])

  
  function addShelf() {
    // This is preserve changes the user made to the drag n drop
    // Get the current state of all shelfs, then push new shelf
    props.setUserSettings(prevUserSetting => {
      let newS = { ...prevUserSetting }
      newS.customShelfs = stLogic.queryShelfs(props.userSettings, true)
      
      let cs = new CustomShelf()
      cs.title = "New Shelf" 
      cs.isSorted = true;
      newS.customShelfs.push(cs)
      return newS
    })
  }

  function prepTheYourSubscriptionsShelf() {
    // NOTE: I want to run: "props.userSettings.convertUnSortedShelfsToSubs()"  but cant b/c spred operator ({...prevUserSetting}) does not maintian the objects class methods
    let aux_unSortedSh = props.userSettings.customShelfs.filter( sh => { return !sh.isSorted } )
    let unSortedSubs = []
    aux_unSortedSh.map(sh => {
      return sh.fewSubs.map(sub => { unSortedSubs = unSortedSubs.concat(sub) })
    })
    let unSortedSh  = [new CustomShelf()]
    unSortedSh[0].isSorted = false
    unSortedSh[0].title = "Your Subscriptions"
    unSortedSh[0].fewSubs = unSortedSubs

    return unSortedSh
  }

  function prepSortedShelfs() {
    let sortedSh    = props.userSettings.customShelfs.filter( sh => { return sh.isSorted } )
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
    <SettingsShelf 
      key={id} 
      bindToId={id} 
      shelf={sh} 
      userSettings={props.userSettings} 
      setUserSettings={props.setUserSettings} />)
    })
    return (
      <div> 
        {sortedShelfz} 
        <div className="center-align">
        <a 
          onClick={addShelf}
          className=" btn">  
          <i className=" material-icons">add</i>
          </a>
          </div>
      </div>
      )
  }
  
  //UnsortedShelfs="Your Subscriptions" on the left
  const UnSortedShelfs = () => {
    let unSortedSh = prepTheYourSubscriptionsShelf()
    
    let unSortedshelfz = unSortedSh.map( sh => {
      let id = nextId('unsortShelf-')
      return (
        <SettingsShelf 
          key={id} 
          bindToId={id} 
          shelf={sh} 
          userSettings={props.userSettings} 
          setUserSettings={props.setUserSettings} />)
        })
    return ( 
      <div> 
        {unSortedshelfz}
      </div>
      )
  }

  return (
    
      <div className="row ">
        <div className="col m6 s12">
          <UnSortedShelfs/>
        </div>
         {/* <div> some stuff </div>  */}
        <div className="col m6 s12">
        <SortedShelfs/>
        </div>


      </div>
    )
  }