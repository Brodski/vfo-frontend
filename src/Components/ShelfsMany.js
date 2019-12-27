import React from 'react'
import { Video } from './Video'
import { Shelf } from './Shelf'
import { Shelf2 } from './Shelf'
import nextId  from "react-id-generator";

export const ShelfsMany = props => {

/*
  console.log('%%%%%%%%%%%%%%%%%% TOP ALL SHELFS %%%%%%%%%%%%%%%%%%')
  console.log("PROPS.SHELFS")
  console.log(props)
  console.log('%%%%%%%%%%%%%%%%%% END ALL SHELFS %%%%%%%%%%%%%%%%%%')
  */
  return (
    <div> 
    {props.shelfs.map(sh => {
    //console.log("//// SHELF //// ")
//    console.log(sh)
      return (
        <div  key={nextId('shelfid-')} className="ytShelfWrap">
          <Shelf  isActs={props.isActs} shelf={sh} />
        </div>
        )
      })}
  </div>
  )
}