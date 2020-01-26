import React, { useContext, useEffect, useState } from 'react';

import Modal from 'react-modal';
import PropTypes from 'prop-types';

import { UserSettingsContext } from '../Contexts/UserContext.js'
import Filter from '../Classes/Filter';
import Pic from '../Images/cogs2.png'


function FilterDialog(props){
  const { userSettings, setUserSettings } = useContext(UserSettingsContext);
  // console.log(" dialog props")
//  console.log(props)
  const [modalIsOpen,setIsOpen] = useState(false);
  const [minDur, setMinDur] = useState()
  const [maxDur, setMaxDur] = useState()
  
  // const {userSettings, bindToId} = {props}

  FilterDialog.propTypes  = {
    bindToId: PropTypes.string.isRequired,
    subObj: PropTypes.shape({
      channelId: PropTypes.string.isRequired,
      channelName: PropTypes.string.isRequired,
      filter: PropTypes.object.isRequired,
    }).isRequired
    

  }

  useEffect(() => {
    // Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
    // if (!document.querySelectorAll('#' + props.bindToId)[1]) {
    if (!document.querySelectorAll(`#${props.bindToId}`)[1] ) {
      Modal.setAppElement(`#${props.bindToId}`) //TODO, this seems like the if is no longer needed
    }

    setMinDur(props.subObj.filter.minDuration)
    setMaxDur(props.subObj.filter.maxDuration)
    // let elems2 = document.querySelectorAll('h5');
    } ,[userSettings])


  const handleMinDur = (e) => {
    setMinDur(e.target.value)
  }
  const handleMaxDur = (e) => {
    setMaxDur(e.target.value)
  }

  const MaxMinDurationDropdown = ({maxOrMinState, maxOrMinHandler, firstValue}) => {
    return (
      <div className="select">
        {/* <select className="  browser-default" value={props.maxOrMinState} onChange={props.maxOrMinHandler} > */}
        <select className="  browser-default" value={maxOrMinState} onChange={maxOrMinHandler} >
          <option value={firstValue}> Off  </option>
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
        <div className="select__arrow" />
      </div>
    )
  }

  function findIndexesOfChannelName() {
  let subIndex;
  let shelfIndex = 0;
    for (let sh of userSettings.customShelfs) {
        subIndex =  sh.fewSubs.findIndex( s => s.channelName == props.subObj.channelName)
        if (subIndex > -1) { 
          break
        }
        shelfIndex = shelfIndex + 1;
      }
    return { subIndex, shelfIndex }
  }
      
  function save(e) {
    e.preventDefault()
    let { subIndex, shelfIndex } = findIndexesOfChannelName()

    setUserSettings(prevSettings => {
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
    
    setIsOpen(false)
  }


    return (
      //  Modal Trigger
      <div>
        <div className='valign-wrapper'> 
          <a
            className="btn filt-button z-depth-0"
            onClick={() => { console.log(props); setIsOpen(true);  } }
          >
            <i className="time-icon-help material-icons ">timelapse</i>
          </a>
        </div>
        {/* Modal Content */}
        {/* TODO No idea why submitting via Enter key is not working (form, input, ect) */}
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={close}
          shouldCloseOnEsc={true}
          className="Modal card horizontal "
          overlayClassName="Overlay"
        >
          
          <div className="card-image filter-image hide-on-small-only">
            <img src={Pic} />   
          </div>
          <div className="  filt-content">          
            {/* ONE */}
            <div>
              <h5 className="flow-text"> {props.subObj.channelName}</h5>
              <div className="divider" />
            </div>
            {/* {TWO} */}
            <div>
              <div className="filt-drop-wrap" > 
                <i className="icon-filt-min hide-on-small-only material-icons ">
                vertical_align_top
                </i>
                <div>Only show videos that are longer than: </div>
              </div>
              <div className="valign-wrapper select-wrap"> 
                <MaxMinDurationDropdown 
                  maxOrMinState={minDur} 
                  maxOrMinHandler={handleMinDur} 
                  firstValue="0"
                />
              </div>
              {/* {THREE} */}
          
              <div className="filt-drop-wrap"> 
                <i className=" icon-filt-max hide-on-small-only material-icons ">
                vertical_align_bottom
                </i>
                <div>Only show videos that are shorter than: </div>
              </div>
              <div className="filt-select-wrap">     
                <MaxMinDurationDropdown 
                  maxOrMinState={maxDur} 
                  maxOrMinHandler={handleMaxDur} 
                  firstValue="Infinity"
                />
              </div>
              <div className="rename-mod-btn">
                <a type="submit" onClick={save} className=" btn">Save</a>
                <a onClick={close} className=" btn">Close</a>
              </div>    
            </div>
          </div>
        </Modal>
      </div>
      

    )
}
export default FilterDialog