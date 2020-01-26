/* eslint-disable no-new */
import React, { useContext, useEffect, useState } from 'react';

import Sortable from 'sortablejs';
import nextId from "react-id-generator";

import * as stLogic from '../BusinessLogic/SettingsLogic';
import { UserContext, UserSettingsContext } from '../Contexts/UserContext.js'
import FilterDialog from './FilterDialog.jsx';
import RenameDialog from './RenameDialog.jsx';

/////////////////////////////////////////////////////////////////////////////////////////////
///////////////
///////////////     A SHELF
///////////////
/////////////////////////////////////////////////////////////////////////////////////////////

const ShelfSetting = (props) => {
  const { user, setUser } = useContext(UserContext);
  const { userSettings, setUserSettings } = useContext(UserSettingsContext);
  const subsDrag = 'subListWrapper' //dont delte subListWrapper
  const shelfDrag = 'draggable-shelf'
  const emptySpaceDrag = 'unSortDndWrap'

  // forceUpdate() for functional comp workaround https://reactgo.com/react-force-update-render/
  let [, setState] = useState();
  function updateForce() {
    setState({});
  }

  const saveUi2Settings = () => {
    setUserSettings(prevUserSetting => {
      let newS = { ...prevUserSetting }
      newS.customShelfs = stLogic.queryShelfs(userSettings, true)
      return newS
    })
  }

  function makeDraggableShared(selector, groupName) {
    var nestedShelf = [].slice.call(document.querySelectorAll(selector));
    let optionz = {
      group: groupName,
      animation: 150,
      fallbackOnBody: true,
      swapThreshold: 1,
      forceFallback: true,
      onEnd: function (evt) {
        saveUi2Settings()
      }
    }
    if (groupName == 'shelfsdnd') {
      optionz = { ...optionz, handle: '.handle-shelf' }
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
          // userSettings={props.userSettings}
          // setUserSettings={props.setUserSettings}
        />
      )
    }
    return null
  }

  //Don't delete sub-QHack
  //Don't delete subitem
  const itemz = props.shelf.fewSubs.map((s, idx) => {
    let id = nextId('subid-')
    return (
      <div key={id} id={id} className=" valign-wrapper shelf-text subitem handle-sub">
        <div data-name={s.channelName} className="set-sh-textaux sub-QHack ">
          {s.channelName}
        </div>
        <FilterDialog
          subObj={s}
          bindToId={id}
          // userSettings={props.userSettings}
          // setUserSettings={props.setUserSettings}
        />
      </div>
    )
  })


  useEffect(() => {
    makeDraggableShared(`.${subsDrag}`, 'subscriptions') // make subs elements draggable
    makeDraggableShared(`.${shelfDrag}`, 'shelfsdnd')     //make shelfs draggable
    makeDraggableShared(`.${emptySpaceDrag}`, 'subscriptions')  // make the empty space in Your Subcriptionss draggable    
  }, [])


  // Don't delete sh-Qhack.
  let shelfClasses = "sh-QHack hoverable card "
  let aux_shelfClasses = props.shelf.isSorted ? " set-custom-shelf" : " unsort-shelf"
  shelfClasses = shelfClasses + ' ' + aux_shelfClasses
  let unSortDndWrap = props.shelf.isSorted ? "" : emptySpaceDrag
  let dragClass = props.shelf.isSorted ? shelfDrag : ""
  let title = props.shelf.isSorted ? props.shelf.title : "Your Subscriptions"

  //TODO we dont need shContainer I pretty srue
  //TODO we dont need unsort-shelf
  return (
    <div className={`${dragClass} shContainer`}>
      <div className={shelfClasses} data-name={props.shelf.title} data-issorted={props.shelf.isSorted} >
        <div id={props.bindToId} className=" valign-wrapper shelf-title-wrap">
          <div>
            <h6 className=" valign-wrapper shelf-title">
              {props.shelf.isSorted
                ? <i className=" handle-shelf material-icons" >drag_handle</i>
                : <span className="set-sh-unsort-pad" />}
              <div className="shelf-title2"> {title}   </div>
            </h6>
          </div>
          <RenameDialogAux />
        </div>
        <div className={subsDrag}>
          {itemz}
        </div>
      </div>
    </div>
  )
}
export default ShelfSetting