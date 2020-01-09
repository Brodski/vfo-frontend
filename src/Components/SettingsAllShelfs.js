import React, { useState, useContext, useEffect } from 'react';
import {SettingsShelf} from '../Components/SettingsShelf';
import * as stLogic from '../BusinessLogic/SettingsLogic';
import { User, CustomShelf } from '../Classes/User'
import { rename } from 'fs';
import { RenameDialog } from './RenameDialog';
import nextId  from "react-id-generator";

export const AllShelfs = (props) => {
  
  //let  [,setState]=useState();
  //function updateForce() {
  //   setState({});
  //}
  
  //const saveUi2Settings = () => {
  //  props.setUserSettings(prevUserSetting => {
  //    let newS = { ...prevUserSetting }
  //    newS.customShelfs = stLogic.queryShelfs(props.userSettings, true)
  //    return newS
  //  }) 
  //}

  function addShelf() {
    // This is preserve changes the user made to the drag n drop
    // Get the current state of all shelfs, then push new shelf
    props.setUserSettings(prevUserSetting => {
      let newS = { ...prevUserSetting }
      let uu = new User({ ...prevUserSetting })
      console.log(uu)
      newS.customShelfs = stLogic.queryShelfs(props.userSettings, true)
      
      let cs = new CustomShelf()
      cs.title = "New Shelf" // + (newS.customShelfs.length + 1)
      cs.isSorted = true;
      newS.customShelfs.push(cs)
      return newS
    })
  }

  function prepTheYourSubscriptionsShelf() {
    // NOTE: I want to run: "props.userSettings.convertUnSortedShelfsToSubs()"  but cant b/c spred operator ({...prevUserSetting}) does not maintian the objects class methods
    let aux_unSortedSh = props.userSettings.customShelfs.filter( sh => { return !sh.isSorted } )
    //TODO: something about this looks suboptimal
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
    // NOTE the note in 'prepTheYourSubscriptionsShelf'
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

  /////////////////////////////////////////////
  const SortedShelfs = () => {
    let sortedSh = prepSortedShelfs()
    let sortedShelfz = sortedSh.map(sh => {
      let id = nextId('shelfid-')
      return (<SettingsShelf key={id} bindToId={id} shelf={sh} //saveUi2Settings={saveUi2Settings}
        userSettings={props.userSettings} setUserSettings={props.setUserSettings} />)
    })

    return (
      <div> 
        {sortedShelfz} 
        <button onClick={addShelf} > Add Shelf </button>
      </div>
      )
  }
  /////////////////////////////////////////////////////////

  const UnSortedShelfs = () => {
    let unSortedSh = prepTheYourSubscriptionsShelf()
    
    let unSortedshelfz = unSortedSh.map( sh => {
      let id = nextId('unsortShelf-')
      return (<SettingsShelf key={id} bindToId={id} shelf={sh} //saveUi2Settings={saveUi2Settings}
        userSettings={props.userSettings} setUserSettings={props.setUserSettings} />)
    })
    return ( 
      <div> 
        {unSortedshelfz}
      </div>
      )
  }

////////////////////////////////////////////////////////////
  //const UltraShelfs = () => {
  //  console.log('-=-=-=-=-ULTRA-=-=-=-=-=-=')
  //  console.log(props.userSettings)
  //  return (
  //    <div className="flex-subshelf-container">
  //      <UnSortedShelfs/>
  //      <div> some stuff </div>
  //      <SortedShelfs/>
  //    </div>
  //  )
  //}  
////////////////////////////////////////////////////////////////
  
  return (
    <div id="allbloodyshelfs">
      <button onClick={() => stLogic.logAllShelfs() }> log all Shelf </button>  
      <button onClick={() => stLogic.logIds() }> log IDs Shelf </button>  
      
      {/*<UltraShelfs/>*/}
      
      <div className="flex-subshelf-container">
        <UnSortedShelfs/>
        <div> some stuff </div>
        <SortedShelfs/>
      </div>

      {/*<button className="shelfEditBtn" onClick={updateForce } >updateThis </button>
      <button className="shelfEditBtn" onClick={saveUi2Settings } >save! Ui2Settings! </button>
      <button onClick={addShelf} > Add shelf </button>*/}
    </div>
    )
  }