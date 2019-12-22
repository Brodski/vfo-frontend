import React, { useState, useContext, useEffect } from 'react';
import {SettingsShelf} from '../Components/SettingsShelf';
import * as stLogic from '../BusinessLogic/SettingsLogic';
import { CustomShelf } from '../Classes/User'

export const AllShelfs = (props) => {

  const unSName = "Subscriptions";

  console.log("AllShelfs props")
  console.log(props)
  let sortedSh = props.userSettings.customShelfs.filter( sh => { return sh.isSorted } )
  console.log('sortedSh')
  console.log(sortedSh)
  
  const sortedShelfz = sortedSh.map((sh,idx) => {
    return (<SettingsShelf title={sh.title} key={idx} shelf={sh} data-shelfid={sh.title + 'shelfid'}
      userSettings={props.userSettings} setUserSettings={props.setUserSettings} />)
  })

  let unSortedSh = props.userSettings.customShelfs.filter((sh) => { return !sh.isSorted } )
  console.log('unSortedSh')
  console.log(unSortedSh)
  if (!unSortedSh[0]) { unSortedSh.push(new CustomShelf()) }

  const unSortedshelfz = unSortedSh.map(sh => {
    return (<SettingsShelf title={unSName} key={unSName+'keyquasiunique'} shelf={sh} 
      userSettings={props.userSettings} setUserSettings={props.setUserSettings} />)
  })
  
  
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