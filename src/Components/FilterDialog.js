import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import { Filter } from '../Classes/Filter';

//https://github.com/reactjs/react-modal



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
      Modal.setAppElement('#' + props.bindToId)
    }
    setMinDur(props.subObj.filter.minDuration)
    setMaxDur(props.subObj.filter.maxDuration)
    } ,[props.userSettings])


  const handleMinDur = (e) => {
    setMinDur(e.target.value)
  }
  const handleMaxDur = (e) => {
    setMaxDur(e.target.value)
  }

  
  const IconHelper = () => {
    return (
    <i className="fas fa-info-circle infoIcon">
      <span> Comma separated </span>
    </i> )
  }

  const MaxMinDurationDropdown = (props) => {
    return (
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
      //console.log('newU')
      //console.log('newU')
      //console.log('newU')
      //console.log('newU')
      //console.log('newU')
      //console.log(newU)
      let newFilter = new Filter()
      newFilter.channelId = prevSettings.customShelfs[shelfIndex].fewSubs[subIndex].filter.channelId 
      newFilter.maxDuration = maxDur
      newFilter.minDuration = minDur
      newU.customShelfs[shelfIndex].fewSubs[subIndex].filter = newFilter
      //console.log('newFilter')
      //console.log(newFilter)
      //console.log('newU')
      //console.log(newU)
      //console.log('shelfIndex')
      //console.log(shelfIndex)
      //console.log('subIndex')
      //console.log(subIndex)
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
      <div>
        <button onClick={() => { console.log(props); setIsOpen(true); } }>create filter</button>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={close}
          shouldCloseOnEsc={ true}
          className="Modal"
          overlayClassName="Overlay"
        >

          <h2>Customize {props.subObj.channelName}</h2>
          <h3>Only show videos that are ... </h3>
          <form>
            <div>(Min) Longer than: </div>
            {/*<MinDurationDropdown />*/}
              <MaxMinDurationDropdown maxOrMinState={minDur} maxOrMinHandler={handleMinDur} firstValue={"0"} />
            <div> (Max) Shorter than: </div>
              <MaxMinDurationDropdown maxOrMinState={maxDur} maxOrMinHandler={handleMaxDur} firstValue={"Infinity"} />
            {/*<MaxDurationDropdown />*/}

            {/*<div id={props.bindToId + reqIdSuffix}>Title must contain:
                <Tags settings={tagSettings} /> 
                <IconHelper />
               </div>
            */}
          <div> </div>
            <button onClick={save}>Save</button>
            <button onClick={close}>Close</button>
          </form>
        </Modal>
      </div>
    );
}

