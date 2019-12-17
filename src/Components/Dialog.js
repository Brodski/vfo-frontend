import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import { Filter } from '../Classes/Filter';
import Tagify from '@yaireo/tagify'
import Tags from "@yaireo/tagify/dist/react.tagify";
import '../CSS/index.css';
//https://github.com/reactjs/react-modal



export function FilterDialog(props){
  //console.log(" dialog props")
//  console.log(props)
  const [modalIsOpen,setIsOpen] = useState(false);
  const [minDur, setMinDur] = useState()
  const [maxDur, setMaxDur] = useState()
  var reqIdSuffix = '-req';
  var blockIdSuffix = '-block';
  
  useEffect(() => {
    if (!document.querySelectorAll('#' + props.bindToId)[1]) {
      Modal.setAppElement('#' + props.bindToId)
    }
    setMinDur(props.subObj.filter.minDuration)
    setMaxDur(props.subObj.filter.maxDuration)
    } ,[])

    
  function close(e) {
    console.log("close!")
    e.preventDefault();
    setIsOpen(false)
  }

  const IconHelper = () => {
    return (
    <i className="fas fa-info-circle infoIcon">
      <span> Comma separated </span>
    </i> )
  }

  const handleMinDur = (e) => {
    setMinDur(e.target.value)
    console.log(e)
    console.log(e.target.value)
    console.log(minDur)
  }
  const handleMaxDur = (e) => {
    setMaxDur(e.target.value)
    console.log(e)
    console.log(e.target.value)
    console.log(maxDur)
  }

  const MaxDurationDropdown = (props) => {
    return (
      <select value={maxDur} onChange={handleMaxDur} >
        <option value="Infinity" >  </option>
        <option value="0.5"> 30 seconds </option>
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
  const MinDurationDropdown = (props) => {
    return (
      <select value={minDur} onChange={handleMinDur} >
        <option value='0' >  </option>
        <option value="0.5"> 30 seconds </option>
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
  // function saveFilter() {
  //  myFilter.requireList.push("req word")
//    myFilter.blocklist   = _getTags(blockIdSuffix)
    //myFilter.requireList = _getTags(reqIdSuffix) }

  const tagSettings = { maxTags: 10, placeholder: "", dropdown: { enabled: 0 }, }// always show suggestions dropdown
    

  function save(e) {
    // TODO: It's ugly

    if(e) e.preventDefault();
    console.log("save filter")
    console.log(props)
    let tempUser = props.userSettings

    let shelfIndex = 0 ;
    let subIndex;
    let unSortedIdx;

    let myFilter = new Filter() 
    myFilter.maxDuration = maxDur;
    myFilter.minDuration = minDur;
    //myFilter.blocklist   = _getTags(blockIdSuffix)
    //myFilter.requireList = _getTags(reqIdSuffix) }
    
    //Find which shelf and location of the User on shelf
    //Search Custom Sub Shelfs
    for (let sh of props.userSettings.customShelfs) {
      subIndex =  sh.fewSubs.findIndex( s => s.channelName == props.subObj.channelName)//props.subObj.channelName)
      if (subIndex > -1) { break }
      shelfIndex += 1;
    }

    //if not in custom subshelf, then it's in Unsorted Subs
    if (subIndex == -1) {
      unSortedIdx = props.userSettings.unsortedSubs.findIndex( s => s.channelName == props.subObj.channelName)  
    }

    //Save to tempUser
    if (unSortedIdx) {
      tempUser.unsortedSubs[unSortedIdx].filter = myFilter
    } else {
      tempUser.customShelfs[shelfIndex].fewSubs[subIndex].filter = myFilter
    }

    props.setUserSettings(tempUser)
  }
 


  function getBothTags(e) {
    e.preventDefault()
    var blocks = _getTags(blockIdSuffix)
    console.log(blockIdSuffix)
    console.log(blocks)
    var reqs = _getTags(reqIdSuffix)
    console.log(reqIdSuffix)
    console.log(reqs)
  }

  function _getTags(tagSuffix) {
    console.log("document.querySelectorAll(tags)")
    var myList = []
    document.getElementById(props.bindToId + tagSuffix).querySelectorAll('.tagify__tag').forEach(x => myList.push(x.textContent))
    //Note this: var nestedShelf = [].slice.call(document.querySelectorAll(selector));
    return myList

  }

  function closeModal() {
    save(); 
    setIsOpen(false)
  }


    return (
      <div>
        <button onClick={() => setIsOpen(true) }>create filter</button>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          shouldCloseOnEsc={ true}
          className="Modal"
          overlayClassName="Overlay"
        >

          <h2>Customize {props.subObj.channelName}</h2>
          <h3>Only show videos that are ... </h3>
          <form>
            <div>(Min) Longer than: </div>
              <MinDurationDropdown />
            <div> (Max) Shorter than: </div>
              <MaxDurationDropdown />
            {/*<div id={props.bindToId + reqIdSuffix}>Title must contain:
            <Tags settings={tagSettings} /> 
              <IconHelper />
               </div>
            <div id={props.bindToId + blockIdSuffix}>Title cannot contain: 
            <Tags settings={tagSettings} {...tagifyProps2}/>
             </div>
              <IconHelper />*/}
          <div> </div>
            {/*<button onClick={getBothTags} > Get Tags </button>*/}
            <button onClick={save}>Save</button>
            <button onClick={close}>Close</button>
          </form>
        </Modal>
      </div>
    );
}

//////////////////////////////////////////////////////////////
  /*
   
   */

    

// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
//ReactDOM.render(<Example />, document.getElementById('settings-main'));