import React, { useState, useContext, useEffect } from 'react';
import { FilterDialog } from '../Components/Dialog';
import Sortable2 from 'sortablejs';
import { continueStatement } from '@babel/types';
  /////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////
  ///////////////     A SHELF
  ///////////////
  /////////////////////////////////////////////////////////////////////////////////////////////

export const SettingsShelf = (props) => {
  const subsDrag        = 'subListWrapper'
  const shelfDrag       = 'draggable-shelf'
  const emptySpaceDrag  = 'unSortDndWrap'

  const [shTitle, setShTitle] = useState('')

  useEffect(() => {
    makeDraggableShared('.' + subsDrag, 'subscriptions') // make subs elements draggable
    makeDraggableShared('.' + shelfDrag,'shelfsdnd')     //make shelfs draggable
    makeDraggableShared('.'+ emptySpaceDrag,'subscriptions')  // make the empty space in Available Subs draggable
    
  }, [])


  function makeDraggableShared(selector, groupName) {
    var nestedShelf = [].slice.call(document.querySelectorAll(selector));
    for (var i = 0; i < nestedShelf.length; i++) {
      new Sortable2(nestedShelf[i], {
        group: groupName,
        animation: 150,
        fallbackOnBody: true,
        swapThreshold: 0.65
      });
    }
  }
    
  const itemz = props.shelf.fewSubs.map((s, idx) => {
    return (
      <div className="subitem" key={s.channelName} id={s.channelId }>
        <div className="sub-QHack" data-name={s.channelName}> {s.channelName} </div>
        <FilterDialog userSettings={props.userSettings} setUserSettings={props.setUserSettings} subObj={s} bindToId={s.channelId } />
      </div>
    )
  }) 
   
  function editTitle(title) {
    console.log("WE ARE EDDITING!!!")
    console.log('props')
    console.log(props)
//    console.log(e)
    console.log(title)
    /*
    for (let i in props.userSettings.customShelfs) {
      if (props.shelf == props.userSettings.customShelfs[i]) {
        console.log ("MATCHES!!!!!!!")
        console.log (props.shelf)
        console.log(props.userSettings.customShelfs[i])
        console.log(i)
        let tempUser = props.userSettings
        console.log(tempUser)
        tempUser.customShelfs[i].title = "NEW TITLE!! " + i
        props.setUserSettings(tempUser)
      }
      */
    
  }
  // REMOVED key={props.title}  FROM classname="sh-QHack"
  //TO DO id SHOULD BE MORE UNIQUE THAN props.title
  //TO DO fix this class fiesta
  let shelfClasses = props.shelf.isSorted   ? "sh-QHack custom-shelf" : "sh-QHack unsort-shelf" 
  let unSortDndWrap = props.shelf.isSorted  ? ""        : emptySpaceDrag 
  let dragClass = props.shelf.isSorted      ? shelfDrag : "" 
  return (
    <div className={ dragClass + " allShContainer"}  >
      <div className={shelfClasses} data-name={props.title} data-id={props.title} data-issorted={props.shelf.isSorted} >
        <div className="shelfTitleWrap"> 
          <h3 className="shelfText"> {props.title}  </h3>
          <button className="shelfEditBtn" onClick={() => editTitle(props.title) } > edit </button>
        </div>
        <div className={unSortDndWrap}>
          <div className={subsDrag}>
          {itemz}
        </div>
        </div>
      </div>
    </div>
  )  
}
