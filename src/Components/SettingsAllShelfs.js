import React, { useState, useContext, useEffect } from 'react';
import {SettingsShelf} from '../Components/SettingsShelf';
import * as stLogic from '../BusinessLogic/SettingsLogic';
import { CustomShelf } from '../Classes/User'
import { rename } from 'fs';
import { RenameDialog } from './RenameDialog';
import nextId  from "react-id-generator";

export const AllShelfs = (props) => {
  
  const unSName = "Subscriptions";
  let  [,setState]=useState();
  function updateForce() {
     setState({});
  }
  console.log("AllShelfs props")
  console.log(props)

  function addShelf() {
    //This is preserve changes the user made to the drag n drop
    props.setUserSettings(prevUserSetting => {
      let newS = { ...prevUserSetting }
      //I bad programmer :(
      /*let preq = stLogic.queryShelfs(props.userSettings, true)
      console.log('preq')
      console.log(preq)
      newS.customShelfs = preq
      */
      let cs = new CustomShelf()
      cs.title = "Shelf " + (newS.customShelfs.length + 1)
      cs.isSorted = true;
      newS.customShelfs.push(cs)
      

      console.log('1/2 newS')
      console.log(newS)
      return newS
    })
    updateForce()

    // Afterwards, Add shelf
/*    props.setUserSettings(prevUserSetting => {
      let newS = { ...prevUserSetting }
      let cs = new CustomShelf()
      cs.title = "Shelf " + (newS.customShelfs.length + 1)
      cs.isSorted = true;
      newS.customShelfs.push(cs)
      console.log('2/2 newS')
      console.log(newS)
      return newS
    })*/
  }
  
  let sortedSh    = props.userSettings.customShelfs.filter( sh => { return sh.isSorted } )
  let unSortedSh  = props.userSettings.customShelfs.filter( sh => { return !sh.isSorted } )
  if (!unSortedSh[0]) { unSortedSh.push(new CustomShelf()) }
  
  const sortedShelfz = sortedSh.map((sh,idx) => {
    let id = nextId('shelfid-')
    return (<SettingsShelf  key={ id } bindToId={id} shelf={sh} 
      userSettings={props.userSettings} setUserSettings={props.setUserSettings} />)
  })

  const unSortedshelfz = unSortedSh.map((sh,idx) => {
    let id =unSName+'keyquasiunique'
    return (<SettingsShelf key={id} bindToId={id}  shelf={sh} 
      userSettings={props.userSettings} setUserSettings={props.setUserSettings} />)
  })
  
  
  return (
    <div id="allbloodyshelfs">
      <button onClick={() => stLogic.logAllShelfs() }> log all Shelf </button>  
      <button onClick={() => stLogic.logIds() }> log IDs Shelf </button>  
      <div className="flex-subshelf-container">
        {unSortedshelfz}
        <div> some stuff </div>
        <div>
        {sortedShelfz}
        </div>
      </div>
      {/*<button className="shelfEditBtn" onClick={updateForce } >updateThis </button>*/}
      <button onClick={addShelf} > Add shelf </button>
    </div>
    )
  }