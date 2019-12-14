import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';


//https://github.com/reactjs/react-modal



export function FilterDialog(props){
  console.log(" dialog props")
  console.log(props)
  var subtitle;
  const [modalIsOpen,setIsOpen] = useState(false);
  function openModal() {
    setIsOpen(true);
  }
  
  useEffect(() => {
    Modal.setAppElement('#'+props.bindToId)
    } ,[])


  function save(e) {
    console.log("save!")
    e.preventDefault();

  }

  function close(e) {
    console.log("close!")
    e.preventDefault();
    setIsOpen(false)
  }

    return (
      <div>
        <button onClick={openModal}>create filter</button>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={() => setIsOpen(false)}
          shouldCloseOnEsc={ true}
          className="Modal"
          overlayClassName="Overlay"
        >

          <h2>Customize {props.title}</h2>
          <h3>Only show videos that are ... </h3>
          <div>Longer than: </div>
          <div>Shorter than: </div>
          <div>Title must contain: </div>
          <div>Title cannot contain: </div>
          <form>
            <button onClick={save}>Save</button>
            <button onClick={close}>Close</button>
          </form>
        </Modal>
      </div>
    );
}

//////////////////////////////////////////////////////////////







const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};




export function Example(props){
  console.log(" diablo props")
  console.log(props)
  var subtitle;
  const [modalIsOpen,setIsOpen] = useState(false);
  function openModal() {
    setIsOpen(true);
  }
  
  useEffect(() => {
    Modal.setAppElement('#settings-main')
    } ,[])

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    subtitle.style.color = 'red';
  }


  function save(e) {
    console.log("save!")
    e.preventDefault();

  }

  function close(e) {
    console.log("close!")
    e.preventDefault();
    setIsOpen(false)
  }

    return (
      <div>
        <button onClick={openModal}>Open Modal</button>
        <Modal
          isOpen={modalIsOpen}
          onAfterOpen={afterOpenModal} //trash
          onRequestClose={() => setIsOpen(false)}
          shouldCloseOnEsc={ true}
          className="Modal"
          overlayClassName="Overlay"
        >

          <h2 ref={_subtitle => (subtitle = _subtitle)}>Hello</h2>
          <div>I am a modal</div>
          <form>
            <button onClick={save}>Save</button>
            <button onClick={close}>Close</button>
          </form>
        </Modal>
      </div>
    );
}

// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
//ReactDOM.render(<Example />, document.getElementById('settings-main'));