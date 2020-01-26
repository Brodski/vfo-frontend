import React from 'react'
import nextId  from "react-id-generator";

import PropTypes from 'prop-types';

import LoadingMain   from '../Common/LoadingMain.jsx';
import Shelf from './Shelf'


const ShelfsMany = props => {

  ShelfsMany.propTypes = {
    setNumVids: PropTypes.func.isRequired,
    // numVids: PropTypes.arrayOf(PropTypes.object).isRequired,
    numVids: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.arrayOf(PropTypes.object)
    ]).isRequired,
    shelfs: PropTypes.arrayOf(PropTypes.object).isRequired,
    hasMore: PropTypes.bool.isRequired,

  }
  
  const {shelfs, numVids, setNumVids, hasMore} = props

  return (
    <div> 
      {shelfs.map( (sh, idx) => {
        return (
          <div key={nextId('shelfid-')} className=" yt-shelf-outer-wrap ">
            <Shelf 
              shelf={sh} 
              numVids={numVids} 
              setNumVids={setNumVids} 
              shelfIdx={idx} 
            />
            <div className='div-aux' />
          </div>
          )
        })}
      {hasMore ? null : <LoadingMain />}
    </div>
  
  )
}
export default ShelfsMany