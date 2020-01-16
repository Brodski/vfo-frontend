import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import { Filter } from '../Classes/Filter';
import { mdiTimelapse } from '@mdi/js'; 
import Icon from '@mdi/react'
//import Pic from './clock.png'
import Pic from './cogs.png'
//https://github.com/reactjs/react-modal
import M from 'materialize-css'


export function FilterDialog(props){
  //console.log(" dialog props")
//  console.log(props)
  const [modalIsOpen,setIsOpen] = useState(false);
  const [minDur, setMinDur] = useState()
  const [maxDur, setMaxDur] = useState()
  
  useEffect(() => {
    // Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
    //ReactDOM.render(<Example />, document.getElementById('settings-main'));
    if (!document.querySelectorAll('#' + props.bindToId)[1]) {
      Modal.setAppElement('#' + props.bindToId) //TODO, this seems like the if is no longer needed
    }
    setMinDur(props.subObj.filter.minDuration)
    setMaxDur(props.subObj.filter.maxDuration)
    let elems = document.querySelectorAll('select');
    let elems2 = document.querySelectorAll('h5');
    console.log('useeffect elems2')
    console.log(elems2)
    let instances = M.FormSelect.init(elems, {});
    } ,[props.userSettings])


  const handleMinDur = (e) => {
    setMinDur(e.target.value)
  }
  const handleMaxDur = (e) => {
    setMaxDur(e.target.value)
  }

  const MaxMinDurationDropdown = (props) => {
    return (
      <div> wtf
      <select value={props.maxOrMinState} onChange={props.maxOrMinHandler} >
        <option value={props.firstValue} > Off  </option>
        <option value="0.5"> 30 seconds </option>
        <option value="1" >  1 minutes </option>
        <option value="2" >  2 minutes</option>
        <option value="3" >  3 minutes</option>
        <option value="4" >  4 minutes</option>
        <option value="5" >  5 minutes</option>
        <option value="6" >  6 minutes</option>
        <option value="7" >  7 minutes</option>
        <option value="8" >  8 minutes</option>
        <option value="9" >  9 minutes</option>
        <option value="10" > 10 minutes</option>
        <option value="15" > 15 minutes</option>
        <option value="30" > 30 minutes</option>
        <option value="45" > 45 minutes</option>
        <option value="60" > 60 minutes</option>
    </select>
    </div>
    )
  }

  function findIndexesOfChannelName() {
  let subIndex;
  let shelfIndex = 0;
    for (let sh of props.userSettings.customShelfs) {
        subIndex =  sh.fewSubs.findIndex( s => s.channelName == props.subObj.channelName)
        if (subIndex > -1) { 
          break 
        }
        shelfIndex += 1;
      }
    return { subIndex, shelfIndex }
  }
      
  function save(e) {
    // TODO: It's ugly
    e.preventDefault()
    console.log("save filter")
    console.log(props)
    
    //let shelfIndex = 0 ;
    //let subIndex;
    //let unSortedIdx;
    
    //let myFilter = new Filter() 
    //myFilter.maxDuration = maxDur;
    //myFilter.minDuration = minDur;
    
    
    let { subIndex, shelfIndex } = findIndexesOfChannelName()
    
    //for (let sh of props.userSettings.customShelfs) {
    //  subIndex =  sh.fewSubs.findIndex( s => s.channelName == props.subObj.channelName)
    //  if (subIndex > -1) { 
    //    break 
    //  }
    //  shelfIndex += 1;
    //}

    //let tempUser = props.userSettings
    //tempUser.customShelfs[shelfIndex].fewSubs[subIndex].filter.minDuration = minDur
    //tempUser.customShelfs[shelfIndex].fewSubs[subIndex].filter.maxDuration = maxDur
    

    props.setUserSettings(prevSettings => {
      let newU = prevSettings
      let newFilter = new Filter()
      newFilter.channelId = prevSettings.customShelfs[shelfIndex].fewSubs[subIndex].filter.channelId 
      newFilter.maxDuration = maxDur
      newFilter.minDuration = minDur
      newU.customShelfs[shelfIndex].fewSubs[subIndex].filter = newFilter
      
      return newU

    })
    setIsOpen(false)
  }
  
  function close(e) {
    e.preventDefault();
    setMinDur(props.subObj.filter.minDuration)
    setMaxDur(props.subObj.filter.maxDuration)
    
    let elems = document.querySelectorAll('select');
    console.log('elems')
    console.log(elems)
    setIsOpen(false)
  }

  function initHack(){
    let elems = document.querySelectorAll('select');
    console.log('inithack  elems')
    console.log(elems)
    let instances = M.FormSelect.init(elems, {});

  }


    return (
      <div className='valign-wrapper'>
        {/* <button onClick={() => { console.log(props); setIsOpen(true); } }>create filter</button> */}
        <a 
          className=" btn filt-button z-depth-0"
          onClick={() => { console.log(props); setIsOpen(true);  } }
          // class="waves-effect waves-light "
          >
            <i className="time-icon-help material-icons ">timelapse</i>
            
          </a>
        
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={close}
          shouldCloseOnEsc={ true}
          className="Modal card horizontal "
          overlayClassName="Overlay"
          onAfterOpen={initHack}
        >
          <div className="card-image filter-image hide-on-small-only">
            <img  src={Pic} />   
          </div>
          <div className="rename-content">
              <h5> {props.subObj.channelName}</h5>
              <h5> Only show videos that are ... </h5>
            
              <div></div>
                <MaxMinDurationDropdown 
                  maxOrMinState={minDur} 
                  maxOrMinHandler={handleMinDur} 
                  firstValue={"0"} 
                />
              <label>(Min) Longer than: </label>
              <div> (Max) Shorter than: </div>
                <MaxMinDurationDropdown 
                  maxOrMinState={maxDur} 
                  maxOrMinHandler={handleMaxDur} 
                  firstValue={"Infinity"} 
                />
            <div className="rename-mod-btn">
              <a onClick={save} className=" btn">Save</a>
              <a onClick={close} className=" btn">Close</a>
            </div>
          </div>
        </Modal>
      </div>
    );
}

