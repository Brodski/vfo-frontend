import React, { useContext, useEffect, useState } from 'react';

import PropTypes from 'prop-types';
import Sortable from 'sortablejs';
import nextId from "react-id-generator";

import * as stLogic from '../BusinessLogic/SettingsLogic';
import { UserSettingsContext } from '../Contexts/UserContext.js'
import FilterDialog from './FilterDialog.jsx';
import RenameDialog from './RenameDialog.jsx';

const ShelfSetting = (props) => {
  const { userSettings, setUserSettings } = useContext(UserSettingsContext);

  const { shelf: { isSorted } } = props
  const { shelf: { fewSubs } } = props
  const { shelf: { title } } = props
  const { bindToId } = props

  ShelfSetting.propTypes = {
    bindToId: PropTypes.string.isRequired,
    shelf: PropTypes.shape({
      title: PropTypes.string.isRequired,
      fewSubs: PropTypes.array.isRequired,
      isSorted: PropTypes.bool.isRequired,
    }).isRequired,
  }
  // dont delete subListWrapper
  const subsDrag = 'subListWrapper'
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
    let nestedShelf = [].slice.call(document.querySelectorAll(selector));
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

    if (groupName === 'shelfsdnd') {
      optionz = { ...optionz, handle: '.handle-shelf' }
    }

    for (let i = 0; i < nestedShelf.length; i = i + 1) {
      new Sortable(nestedShelf[i], optionz)
    }
  }

  const RenameDialogAux = () => {
    if (isSorted) {
      return (
        <RenameDialog
          shelfObj={props.shelf}
          bindToId={props.bindToId}
          updateForce={updateForce}
        />
      )
    }
    return null
  }

  // Don't delete sub-QHack
  // Don't delete subitem
  const itemz = fewSubs.map((s) => {
    let id = nextId('subid-')
    return (
      <div key={id} id={id} className=" valign-wrapper shelf-text subitem handle-sub">
        <div data-name={s.channelName} className="set-sh-textaux sub-QHack ">
          {s.channelName}
        </div>
        <FilterDialog
          subObj={s}
          bindToId={id}
        />
      </div>
    )
  })

  useEffect(() => {
    makeDraggableShared(`.${subsDrag}`, 'subscriptions')
    makeDraggableShared(`.${shelfDrag}`, 'shelfsdnd')
    makeDraggableShared(`.${emptySpaceDrag}`, 'subscriptions')
  }, [])

  // Don't delete sh-Qhack.
  let shelfClasses = "sh-QHack hoverable card "
  let auxShelfClasses = isSorted ? " " : " unsort-shelf"
  shelfClasses = `${shelfClasses} ${auxShelfClasses}`
  let unSortDndWrap = isSorted ? "" : emptySpaceDrag
  let dragClass = isSorted ? shelfDrag : ""
  let titleReal = isSorted ? title : "Your Subscriptions"

  return (
    <div className={`${dragClass} shContainer`}>
      <div className={shelfClasses} data-name={title} data-issorted={isSorted}>
        <div id={bindToId} className=" valign-wrapper shelf-title-wrap">
          <div>
            <h6 className=" valign-wrapper shelf-title">
              {isSorted
                ? <i className=" handle-shelf material-icons" >drag_handle</i>
                : <span className="set-sh-unsort-pad" />}
              <div className="shelf-title2"> {titleReal}   </div>
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