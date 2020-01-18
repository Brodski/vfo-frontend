import React, { useState, useEffect, useContext, createContext } from 'react';
import ReactLoading from 'react-loading';
import nextId  from "react-id-generator";

  export const LoadingMain = props => {
    return (
      <div key={nextId('loaderid-')} className="loading-main-animation">
        <ReactLoading type={'spinningBubbles'} />
      </div>
    )
  }