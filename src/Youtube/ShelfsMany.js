import React from 'react'
import { Video } from './Video'
import { Shelf } from './Shelf'
import { Shelf2 } from './Shelf'
import nextId  from "react-id-generator";
import { LoadingMain }   from '../Common/LoadingMain';
export const ShelfsMany = props => {

/*
  console.log('%%%%%%%%%%%%%%%%%% TOP ALL SHELFS %%%%%%%%%%%%%%%%%%')
  console.log("PROPS.SHELFS")
  console.log(props)
  console.log('%%%%%%%%%%%%%%%%%% END ALL SHELFS %%%%%%%%%%%%%%%%%%')
  */
  return (
    <div> 
    {props.shelfs.map( (sh, idx) => {
      return (
        <div  key={nextId('shelfid-')} className=" yt-shelf-outer-wrap ">
          <Shelf 
            shelf={sh} 
            numVids={props.numVids} 
            setNumVids={props.setNumVids} 
            _setIdx={idx} 
          />
          <div className='div-aux' />
        </div>
        )
      })}
      {props.hasMore ? null : <LoadingMain/> }
  </div>
  
  )
}