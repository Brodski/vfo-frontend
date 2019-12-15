import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import { Filter } from '../Classes/Filter';

//https://github.com/reactjs/react-modal



export function FilterDialog(props){
//  console.log(" dialog props")
//  console.log(props)
  var subtitle;
  const [modalIsOpen,setIsOpen] = useState(false);
  
  function openModal() {
    setIsOpen(true);
  }
  
  useEffect(() => {
    Modal.setAppElement('#'+props.bindToId)
    } ,[])


  function close(e) {
    console.log("close!")
    e.preventDefault();
    setIsOpen(false)
  }

  const IconHelper = () => {
    return (
    <i class="fas fa-info-circle infoIcon">
      <span> Comma separated </span>
    </i> )
  }
  const DurationDropdown = () => {
    return (
      <select> 
        <option value="0.5">  30 seconds </option>
        <option value="1" >  1 minutes </option>
        <option value="2" >  2 minutes</option>
        <option value="3" >  3 minutes</option>
        <option value="4" >  4 minutes</option>
        <option value="5" >  5 minutes</option>
        <option value="10" > 10 minutes</option>
        <option value="15" > 15 minutes</option>
        <option value="30" > 30 minutes</option>
        <option value="45" > 45 minutes</option>
        <option value="60" > 60 minutes</option>
    </select>
    )
  }

  function save(e) {
    // TODO: It's ugly

    e.preventDefault();
    console.log("save filter")
    console.log(props)
    let tempUser = props.userSettings

    
    //let subInd =  props.userSettings.subscriptions.findIndex( s => s.channelName == "SMTOWN")
    //let xsubIndex =  props.userSettings.subscriptions.findIndex( s => s.channelName == props.subObj.channelName)
    
    let shelfIndex = 0 ;
    let subIndex;
    let unSortedIdx;

    //Search Custom Sub Shelfs
    for (let sh of props.userSettings.customShelfs) {
       subIndex =  sh.fewSubs.findIndex( s => s.channelName == props.subObj.channelName)//props.subObj.channelName)
      if (subIndex > -1) { break }
      shelfIndex += 1;
    }
    //if not in custom subshelf, then it's in Unsorted Subs
    if (subIndex == -1) {
      console.log(props.userSettings.unsortedSubs)
      unSortedIdx =  props.userSettings.unsortedSubs.findIndex( s => s.channelName == props.subObj.channelName)
    }

    let myFilter = new Filter() 
    myFilter.requireKeyword.push("req word")

    if (unSortedIdx) {
      tempUser.unsortedSubs[unSortedIdx].filter = myFilter
    } else {
      tempUser.customShelfs[shelfIndex].fewSubs[subIndex].filter = myFilter
    }

    props.setUserSettings(tempUser)
    
    
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

          <h2>Customize {props.subObj.channelName}</h2>
          <h3>Only show videos that are ... </h3>
          <form>
            <div>Longer than: </div>
              <DurationDropdown />
            <div>Shorter than: </div>
              <DurationDropdown />
            <div>Title must contain: </div>
              <input type="text"/>
              <IconHelper />
            <div>Title cannot contain: </div>
              <input type="text"/>
              <IconHelper />
          <div> </div>
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