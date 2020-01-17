import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import { Filter } from '../Classes/Filter';
import { mdiTimelapse } from '@mdi/js'; 
import Icon from '@mdi/react'
//import Pic from './clock.png'
import Pic from './cogs2.png'
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
    if (!document.querySelectorAll('#' + props.bindToId)[1]) {
      Modal.setAppElement('#' + props.bindToId) //TODO, this seems like the if is no longer needed
    }
    setMinDur(props.subObj.filter.minDuration)
    setMaxDur(props.subObj.filter.maxDuration)
    // let elems2 = document.querySelectorAll('h5');
    } ,[props.userSettings])


  const handleMinDur = (e) => {
    setMinDur(e.target.value)
  }
  const handleMaxDur = (e) => {
    setMaxDur(e.target.value)
  }

  const MaxMinDurationDropdown = (props) => {
    return (
      <div className="select">
        <select className="hoverable browser-default" value={props.maxOrMinState} onChange={props.maxOrMinHandler} >
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
      <div class="select__arrow"></div>
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
    e.preventDefault()
    let { subIndex, shelfIndex } = findIndexesOfChannelName()

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
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={close}
          shouldCloseOnEsc={ true}
          className="Modal card horizontal "
          overlayClassName="Overlay"
        >
        <div className="card-image filter-image hide-on-small-only">
          <img src={Pic} />   
        </div>
        <div className="  filt-content">  
          {/* ONE */}
          <div>
            <h5> {props.subObj.channelName}</h5>
            <div className="divider" />
          </div>
           
           {/* {TWO} */}
          <div>
            <div > 
              Only show videos that are longer than: 
            </div>
            <div className="valign-wrapper select-wrap"> 
              <i className="icon-filt-min material-icons ">
                vertical_align_top
              </i>
              <MaxMinDurationDropdown 
                maxOrMinState={minDur} 
                maxOrMinHandler={handleMinDur} 
                firstValue={"0"} 
              />
            </div>
          {/* </div>
           {THREE} 
          <div> */}
            <div> 
              Only show videos that are shorter than: 
            </div>
            <div className="select-wrap"> 
              <i class=" icon-filt-max material-icons ">
                vertical_align_bottom
              </i>
              <MaxMinDurationDropdown 
                maxOrMinState={maxDur} 
                maxOrMinHandler={handleMaxDur} 
                firstValue={"Infinity"} 
              />
            </div>
            <div className="rename-mod-btn">
              <a onClick={save} className=" btn">Save</a>
              <a onClick={close} className=" btn">Close</a>
            </div>
          </div>
        </div>
      </Modal>
    </div>
      

    )
}














            //////////////////////////////////////////////

            // return (
            //   //  Modal Trigger
            //   <div>
            //     {/* <div className='valign-wrapper'> */}
            //       <a 
            //         href={'#mdl-'+props.bindToId}
            //         className="modal-trigger btn filt-button z-depth-0"
            //         onClick={() => { console.log(props); setIsOpen(true);  } }
            //       >
            //         <i className="time-icon-help material-icons ">timelapse</i>
            //       </a>
            //     {/* </div> */}
        
            //     {/* // Modal Structure */}
            //     <div id={'mdl-'+props.bindToId} className="modal filter-mod-help">
            //       <div class="card">
            //         <div class="card-content">
            //           <h4>Modal Header</h4>
            //           <p>A bunch of text</p>
            //         </div>
            //       </div>
            //     </div>
            //   </div>
            // );