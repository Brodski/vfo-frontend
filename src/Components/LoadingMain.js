import React, { useState, useEffect, useContext, createContext } from 'react';
import ReactLoading from 'react-loading';


  export const LoadingMain = props => {
    return (
      <div className="loading-main-animation">
        <ReactLoading type={'spinningBubbles'} />
      </div>
    )
  }