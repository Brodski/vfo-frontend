import React, { useContext, useEffect, useState } from 'react';

import Modal from 'react-modal';
import PropTypes from 'prop-types'

import { UserSettingsContext } from '../Contexts/UserContext.js'
import Pic from '../Images/pen3.png'

function RenameDialog(props) {
  
  const { userSettings, setUserSettings } = useContext(UserSettingsContext);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [newName, setNewName] = useState()

  RenameDialog.propTypes = {
    bindToId: PropTypes.string.isRequired,
    shelfObj: PropTypes.shape({
      fewSubs: PropTypes.array.isRequired,
      isSorted: PropTypes.bool.isRequired,
      title: PropTypes.string.isRequired
    }).isRequired
  }

  function close(e) {
    e.preventDefault();
    setIsOpen(false)
  }

  function findIndexForShelfObj(shelfIterating, idx, arr){
    if (shelfIterating.title === this.title && shelfIterating.isSorted === this.isSorted && shelfIterating.fewSubs.length === this.fewSubs.length ) {
      return true
    }
  }

  function save(e) {
    e.preventDefault();
    setIsOpen(false)
    setUserSettings(prev => {
      let newSet = { ...prev }
      let i = userSettings.customShelfs.findIndex(findIndexForShelfObj, props.shelfObj)
      if (i > -1 ){ 
        newSet.customShelfs[i].title = newName
      } 
      
      return newSet
    })
    props.updateForce()
  }

  function changeHandler(e) {
    setNewName(e.target.value)
  }

  useEffect(() => {
    Modal.setAppElement(`#${props.bindToId}`)
    setNewName(props.shelfObj.title)
  }, [])

  return (
    <div>
      <a>
        <i
          onClick={() => setIsOpen(true)}
          className=" rename-icon material-icons"
        >edit 
        </i>
      </a>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setIsOpen(false)}
        shouldCloseOnEsc={true}
        className="Modal  card horizontal "
        overlayClassName="Overlay"
      >
        {/* Image of pen */}
        {/* <div className="card-image valign-wrapper hide-on-small-only">
          <img className="rename-image2 " src={Pic} />
        </div> */}
        <div className=" rename-content">
          <form onSubmit={save}>
            <div>
              <h5 className="flow-text"> Rename </h5>
              <div className="divider" />
            </div>
            <div>
              <div className="input-field">
                <i className="material-icons prefix  ">mode_edit</i>
                <input
                  value={newName}
                  type="text"
                  onChange={changeHandler}
                />
              </div>
              <div className="rename-mod-btn">
                <a type="submit" onClick={save} className=" btn">Rename</a>
                {/* <a onClick={save} className=" btn">Rename</a> */}
                <a onClick={close} className=" btn">Close</a>
              </div>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  )
}
export default RenameDialog