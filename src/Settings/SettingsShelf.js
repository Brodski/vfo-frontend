import React, { useState, useContext, useEffect } from 'react';
import * as stLogic from '../BusinessLogic/SettingsLogic';
import { FilterDialog } from '../Settings/FilterDialog';
import { RenameDialog } from '../Settings/RenameDialog';
import Sortable from 'sortablejs';
import nextId  from "react-id-generator";
import M from 'materialize-css'

  /////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////
  ///////////////     A SHELF
  ///////////////
  /////////////////////////////////////////////////////////////////////////////////////////////
  
export const SettingsShelf = (props) => {
  const subsDrag = 'subListWrapper' //dont delte subListWrapper
  const shelfDrag = 'draggable-shelf'
  const emptySpaceDrag = 'unSortDndWrap'

  useEffect(() => {
    makeDraggableShared('.' + subsDrag, 'subscriptions') // make subs elements draggable
    makeDraggableShared('.' + shelfDrag, 'shelfsdnd')     //make shelfs draggable
    makeDraggableShared('.' + emptySpaceDrag, 'subscriptions')  // make the empty space in Your Subcriptionss draggable
    
  }, [])

  // forceUpdate() for functional comp workaround https://reactgo.com/react-force-update-render/
  let [, setState] = useState();
  function updateForce() {
    setState({});
  }
  
  const saveUi2Settings = () => {
    props.setUserSettings(prevUserSetting => {
      let newS = { ...prevUserSetting }
      newS.customShelfs = stLogic.queryShelfs(props.userSettings, true)
      return newS
    })
  }

  function makeDraggableShared(selector, groupName) {
    var nestedShelf = [].slice.call(document.querySelectorAll(selector));
    let optionz = {
      group: groupName,
      animation: 150,
      fallbackOnBody: true,
      swapThreshold: 0.65,
      forceFallback: true,
      onEnd: function (evt) {
        saveUi2Settings()
      }
    }
    if ( groupName == 'shelfsdnd') {
      optionz = { ...optionz, handle:'.handle-shelf' }
    }
    
    for (let i = 0; i < nestedShelf.length; i++) {
      new Sortable(nestedShelf[i], optionz)
    }
  }

  const RenameDialogAux = () => {
    if (props.shelf.isSorted) {
      return (
        <RenameDialog
          shelfObj={props.shelf}
          bindToId={props.bindToId}
          updateForce={updateForce}
          userSettings={props.userSettings}
          setUserSettings={props.setUserSettings} 
        />
      )
    } else {
    return null
    }
  }

  //Don't delete sub-QHack
  //Don't delete subitem
  const itemz = props.shelf.fewSubs.map((s, idx) => {
    let id = nextId('subid-')
    return (
      <div key={id} id={id} className=" valign-wrapper shelf-text subitem handle-sub" >
        <div data-name={s.channelName} className="set-sh-textaux sub-QHack " >
          {s.channelName}  
        </div>
        <FilterDialog 
          subObj={s} 
          bindToId={id} 
          userSettings={props.userSettings}
          setUserSettings={props.setUserSettings} 
        />
      </div>
    )
  })

  // Don't delete sh-Qhack.
  let shelfClasses = "sh-QHack hoverable card blue-grey darken-1 "
  let aux_shelfClasses = props.shelf.isSorted     ? " custom-shelf" : " unsort-shelf" 
  shelfClasses = shelfClasses + ' ' + aux_shelfClasses
  let unSortDndWrap = props.shelf.isSorted    ? ""        : emptySpaceDrag 
  let dragClass = props.shelf.isSorted        ? shelfDrag : "" 
  let title     = props.shelf.isSorted        ? props.shelf.title : "Your Subscriptions"
  return (
    <div className={ dragClass + " shContainer"} >
      <div className={shelfClasses} data-name={props.shelf.title} data-issorted={props.shelf.isSorted} >
        <div  id={props.bindToId}  className=" valign-wrapper shelf-title-wrap"> 
          <div>
          <h6 className=" valign-wrapper shelf-title"> 
          { props.shelf.isSorted 
            ? <i className=" handle-shelf material-icons" >drag_handle</i> 
            : <span className="set-sh-unsort-pad"/> 
          }
            <div className="shelf-title2"> {title}   </div>
          </h6>
          </div>
            < RenameDialogAux />
        </div>
        <div className={subsDrag}>
          {itemz}
        </div>
      </div>
    </div>
    )
}
//    <div className={unSortDndWrap}>
//      <div className={subsDrag}>
//        {itemz}
//      </div>
//    </div>