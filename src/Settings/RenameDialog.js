import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';

export function RenameDialog(props) {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [newName, setNewName] = useState()

  useEffect(() => {
    Modal.setAppElement('#' + props.bindToId)
    setNewName(props.shelfObj.title)
  }, [])


  function close(e) {
    e.preventDefault();
    setIsOpen(false)
  }

  function save(e) {
    e.preventDefault();
    setIsOpen(false)
    props.setUserSettings(prev => {
      let i = props.userSettings.customShelfs.indexOf(props.shelfObj)
      prev.customShelfs[i].title = newName
      return prev
    })
    props.updateForce()
  }

  function changeHandler(e) {
    setNewName(e.target.value)
  }

   return (
      <div>
        <a >
        <i onClick={() => setIsOpen(true)}
          className=" rename-icon material-icons">edit</i>
          </a>
       {/* <button  className={"shelfEditBtn"} onClick={() => setIsOpen(true)}>Rename</button> */}
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={() => setIsOpen(false)}
          shouldCloseOnEsc={ true}
          className="Modal"
          overlayClassName="Overlay"
        >
         <h4>Rename {props.shelfObj.title} to...?</h4>
          <form>
            <input value={newName} type="text" placeholder="Rename" onChange={changeHandler} />
            <div> </div>
            <button onClick={save}>Save</button>
            <button onClick={close}>Close</button>
          </form>
        </Modal>
      </div>
      )
}
