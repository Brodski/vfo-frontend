import React, { useState, useContext, useEffect } from 'react';
import {SettingsShelf} from '../Components/SettingsShelf';
import * as stLogic from '../BusinessLogic/SettingsLogic';
import { CustomShelf } from '../Classes/User'
import { rename } from 'fs';
import { RenameDialog } from './RenameDialog';

export const AllShelfs = (props) => {

  const unSName = "Subscriptions";

  console.log("AllShelfs props")
  console.log(props)

  
  
  function addShelf() {
    props.setUserSettings(prevUserSetting => {
      let newS = { ...prevUserSetting }
      let cs = new CustomShelf()
      cs.title = "Shelf " + (newS.customShelfs.length + 1)
      cs.isSorted = true;
      newS.customShelfs.push(cs)
      return newS
    })
  }
  
  let sortedSh    = props.userSettings.customShelfs.filter( sh => { return sh.isSorted } )
  let unSortedSh  = props.userSettings.customShelfs.filter( sh => { return !sh.isSorted } )
  if (!unSortedSh[0]) { unSortedSh.push(new CustomShelf()) }
  
  const sortedShelfz = sortedSh.map((sh,idx) => {
    return (<SettingsShelf  key={sh.title} bindToId={'shelfid'+idx} shelf={sh} data-shelfid={sh.title + 'shelfid'}
      userSettings={props.userSettings} setUserSettings={props.setUserSettings} />)
  })

  const unSortedshelfz = unSortedSh.map((sh,idx) => {
    return (<SettingsShelf title={unSName} bindToId={unSName+'keyquasiunique'} key={unSName+'keyquasiunique'} shelf={sh} 
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
      <button onClick={addShelf} > Add shelf </button>
    </div>
    )
  }