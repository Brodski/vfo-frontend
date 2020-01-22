import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import Pic from '../Images/pen3.png'

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
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={() => setIsOpen(false)}
          shouldCloseOnEsc={ true}
          // className="Modal card-panel "
          className="Modal  card horizontal "
          overlayClassName="Overlay"
        >
        {/* TODO Test this on phone */}
        <div className="card-image valign-wrapper rename-image hide-on-small-only">
          {/* <img src="https://www.webfuturestudio.com/wp-content/uploads/2018/11/website-product4-1.jpg"></img> */}
          {/* <img src="https://i.pinimg.com/564x/01/38/9b/01389bbde0ce8bd30104ec154a8b53b0.jpg"></img> */}
          {/* <img src="https://www.webfuturestudio.com/wp-content/uploads/2018/11/website-product7.jpg"></img>  */}
          <img className="rename-image2 " src={Pic}></img> 
        </div>
        <div className=" rename-content">
          <div>
            <h5 className="flow-text"> Rename </h5>
            <div className="divider" />
          </div>
          <div >
            <div className="input-field">
              <i className="material-icons prefix  ">mode_edit</i>
              <input 
                className="rename-text" 
                value={newName} 
                type="text" 
                onChange={changeHandler} 
                // id={'txt-' + props.bindToId}
              />
            </div>
            <div className="rename-mod-btn">
              <a onClick={save} className=" btn">Rename</a>
              <a onClick={close} className=" btn">Close</a>
            </div>
          </div>
        </div>
          
        </Modal>
      </div>
      )
}
