import React from 'react';
import ReactLoading from 'react-loading';
import nextId  from "react-id-generator";

const LoadingMain = () => {
  return (
    <div key={nextId('loaderid-')} className="loading-main-animation">
      <ReactLoading type='spinningBubbles' color='black' />
    </div>
  )
}
export default LoadingMain