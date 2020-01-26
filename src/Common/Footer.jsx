import React,  { useState, useContext, useEffect } from 'react';
import { IsLoggedContext, UserSettingsContext, UserContext } from '../Contexts/UserContext.js';


const Footer = () => {
  return(
    <footer key='someFooter' className="page-footer">
      <div className="container">
        <div className="row">
          <div className="col l6 s12">
            <h5 className="white-text">Better Youtube</h5>
            <p className="grey-text text-lighten-4">by Chris Brodski</p>
          </div>
          <div className="col l4 offset-l2 s12">
            <h6 className="white-text">Info</h6>
            <ul>
              <li><a className="grey-text text-lighten-3" >Contact: cbrodski@gmail.com</a></li>
              <li><a className="grey-text text-lighten-3" href="https://github.com/Brodski/"> Github</a> </li>
              <li><a className="grey-text text-lighten-3" href="https://www.linkedin.com/in/christopher-brodski/">LinkedIn</a></li>
              
            </ul>
          </div>
        </div>
      </div>
      <div className="footer-copyright">
        <div className="container">
          <a className="grey-text text-lighten-4 right" href="#!" />
        </div>
      </div>
    </footer>
  )
}
export default Footer