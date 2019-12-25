import React, { useState, useContext, useEffect } from 'react';
import { FilterDialog } from '../Components/FilterDialog';
import { RenameDialog } from '../Components/RenameDialog';
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

  useEffect(() => {
    makeDraggableShared('.' + subsDrag, 'subscriptions') // make subs elements draggable
    makeDraggableShared('.' + shelfDrag,'shelfsdnd')     //make shelfs draggable
    makeDraggableShared('.'+ emptySpaceDrag,'subscriptions')  // make the empty space in Available Subs draggable
    
  }, [])

  // forceUpdate() for functional comp workaround https://reactgo.com/react-force-update-render/
  let  [,setState]=useState();
  function updateForce() {
      //passing empty object will re-render the component
     setState({});
  }

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
      <div className="subitem" key={s.channelId} id={s.channelId }>
        <div className="sub-QHack" data-name={s.channelName}> {s.channelName} </div>
        <FilterDialog userSettings={props.userSettings} setUserSettings={props.setUserSettings} subObj={s} bindToId={s.channelId } />
      </div>
    )
  }) 

  
   
  function editTitle() {
    console.log("WE ARE EDDITING!!!")
    console.log('props')
    console.log(props)
    console.log('props.shelf')
    console.log(props.shelf)
    console.log('props.shelf.title')
    console.log(props.shelf.title)
    console.log('props.userSettings')
    console.log(props.userSettings)

  }
  // REMOVED key={props.title}  FROM classname="sh-QHack"
  //TO DO id SHOULD BE MORE UNIQUE THAN props.title
  //TO DO fix this class fiesta
  let shelfClasses = props.shelf.isSorted   ? "sh-QHack custom-shelf" : "sh-QHack unsort-shelf" 
  let unSortDndWrap = props.shelf.isSorted  ? ""        : emptySpaceDrag 
  let dragClass = props.shelf.isSorted      ? shelfDrag : "" 
  return (
    <div className={ dragClass + " allShContainer"}  >
      <div className={shelfClasses} data-name={props.shelf.title} data-id={props.shelf.title} data-issorted={props.shelf.isSorted} >
        <div  id={props.bindToId}  className="shelfTitleWrap"> 
          <h3 className="shelfText"> {props.shelf.title}  </h3>

          {/*<button className="shelfEditBtn" onClick={() => editTitle() } > edit (log props & title) </button>*/}

          <button className="shelfEditBtn" onClick={updateForce } >updateThis </button>

          <RenameDialog userSettings={props.userSettings} setUserSettings={props.setUserSettings} shelfObj={props.shelf} bindToId={props.bindToId} updateForce={updateForce}/>
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
