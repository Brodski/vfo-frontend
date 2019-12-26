import React, { useState, useContext, useEffect } from 'react';
import { FilterDialog } from '../Components/FilterDialog';
import { RenameDialog } from '../Components/RenameDialog';
import Sortable2 from 'sortablejs';
import nextId  from "react-id-generator";


  /////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////
  ///////////////     A SHELF
  ///////////////
  /////////////////////////////////////////////////////////////////////////////////////////////
  
export const SettingsShelf = (props) => {
  const subsDrag = 'subListWrapper'
  const shelfDrag = 'draggable-shelf'
  const emptySpaceDrag = 'unSortDndWrap'

  useEffect(() => {
    makeDraggableShared('.' + subsDrag, 'subscriptions') // make subs elements draggable
    makeDraggableShared('.' + shelfDrag, 'shelfsdnd')     //make shelfs draggable
    makeDraggableShared('.' + emptySpaceDrag, 'subscriptions')  // make the empty space in Available Subs draggable

  }, [])

  // forceUpdate() for functional comp workaround https://reactgo.com/react-force-update-render/
  let [, setState] = useState();
  function updateForce() {
    setState({});
  }

  function makeDraggableShared(selector, groupName) {
    var nestedShelf = [].slice.call(document.querySelectorAll(selector));
    for (let i = 0; i < nestedShelf.length; i++) {
      new Sortable2(nestedShelf[i], {
        group: groupName,
        animation: 150,
        fallbackOnBody: true,
        swapThreshold: 0.65,
        onEnd: function (evt) {
          props.saveUi2Settings()
        }
      });
    }
  }

  const itemz = props.shelf.fewSubs.map((s, idx) => {
    let id = nextId('subid-')
    return (
      <div key={id} id={id} className="subitem"  >
        <div data-name={s.channelName} className="sub-QHack"  >
          {s.channelName}
        </div>
        <FilterDialog subObj={s} bindToId={id} userSettings={props.userSettings} setUserSettings={props.setUserSettings} />
      </div>
    )
  })



  function editTitle() {
    console.log("WE ARE EDDITING!!!")
    console.log('props')
    console.log(props)
    console.log('props.shelf')
    console.log(props.shelf)
    console.log('props.shelf.title')
    console.log(props.shelf.title)
    console.log('props.userSettings')
    console.log(props.userSettings)

  }

  
  const ShelfAux2 = () => {
    let shelfClasses = props.shelf.isSorted     ? "sh-QHack custom-shelf" : "sh-QHack unsort-shelf" 
  //let unSortDndWrap = props.shelf.isSorted    ? ""        : emptySpaceDrag 
    let dragClass = props.shelf.isSorted        ? shelfDrag : "" 
    let title     = props.shelf.isSorted        ? props.shelf.title : "Your Subscriptions"
    return(
    <div className={ dragClass + " shContainer"}  >
      <div data-name={props.shelf.title} data-issorted={props.shelf.isSorted} className={shelfClasses}  >
        <div  id={props.bindToId}  className="shelfTitleWrap"> 
          <h3 className="shelfText"> 
            {title}  
          </h3>

        { props.shelf.isSorted ? <RenameDialog  shelfObj={props.shelf} bindToId={props.bindToId} updateForce={updateForce} userSettings={props.userSettings} setUserSettings={props.setUserSettings}/>
                                : null  }
        </div>
          <div className={subsDrag}>
          {itemz}
          </div>
      </div>
    </div>
    )
  }
  /*
  const ShelfAuxAux = () => {
    let shelfClasses = props.shelf.isSorted   ? "sh-QHack custom-shelf" : "sh-QHack unsort-shelf" 
    let unSortDndWrap = props.shelf.isSorted  ? ""        : emptySpaceDrag 
    let dragClass = props.shelf.isSorted      ? shelfDrag : "" 
    return(
    <div className={ dragClass + " allShContainer"}  >
      <div data-name={props.shelf.title} data-issorted={props.shelf.isSorted} className={shelfClasses}  >
        <div  id={props.bindToId}  className="shelfTitleWrap"> 
          <h3 className="shelfText"> 
            {props.shelf.title}  
          </h3>

          <RenameDialog  shelfObj={props.shelf} bindToId={props.bindToId} updateForce={updateForce} userSettings={props.userSettings} setUserSettings={props.setUserSettings}/>
        </div>
        <div className={unSortDndWrap}>
          <div className={subsDrag}>
          {itemz}
          </div>
        </div>
      </div>
    </div>
    )
  }

  const ShelfAux = () => {
    if (props.shelf.isSorted) {
      return(
        <div className="auxSort">   <ShelfAuxAux /> </div>
      )
    } else { 
      return (
        <div className="auxUnsort"> <ShelfAuxAux /> </div> 
      )
    }
  }
  */
  // REMOVED key={props.title}  FROM classname="sh-QHack"
  //TO DO fix this class fiesta
  let shelfClasses = props.shelf.isSorted   ? "sh-QHack custom-shelf" : "sh-QHack unsort-shelf" 
  let unSortDndWrap = props.shelf.isSorted  ? ""        : emptySpaceDrag 
  let dragClass = props.shelf.isSorted      ? shelfDrag : "" 
  return (
    <div> <ShelfAux2 /> </div>
    )
    {/*<div className={ dragClass + " allShContainer"}  >
      <div data-name={props.shelf.title} data-issorted={props.shelf.isSorted} className={shelfClasses}  >
        <div  id={props.bindToId}  className="shelfTitleWrap"> 
          <h3 className="shelfText"> 
            {props.shelf.title}  
          </h3>
          
          <RenameDialog  shelfObj={props.shelf} bindToId={props.bindToId} updateForce={updateForce} userSettings={props.userSettings} setUserSettings={props.setUserSettings}/>
        </div>
        <div className={unSortDndWrap}>
          <div className={subsDrag}>
          {itemz}
          </div>
          <ShelfAux />
        </div>
      </div>
    </div>*/}
  
}
