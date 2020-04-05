import { Link } from 'react-router-dom';
import React from 'react';

const Footer = () => {
  return (
    <footer key='someFooter' className="page-footer">
      <div className="container">
        <div className="row">
          <div className="col l6 s12">
            <h5 className="white-text">Custom Youtube</h5>
            <ul>
              <li className="grey-text text-lighten-4">by Chris Brodski </li> 
              <li><a className="grey-text text-lighten-3" href="https://github.com/Brodski/customyoutube-frontend"> Github</a> </li>
              <li><a className="grey-text text-lighten-3" href="https://www.linkedin.com/in/christopher-brodski/">LinkedIn</a></li>
            </ul>
          </div>
          <div className="col l4 offset-l2 s12">
            <h6 className="white-text">Info</h6>
            <ul>
              <li><a className="grey-text text-lighten-3">Contact: cbrodski@gmail.com</a></li>
              <li><Link className="grey-text text-lighten-3" to="/privacy">Privacy Policy</Link></li>
              <li><Link className="grey-text text-lighten-3" to="/terms">Terms Of Use</Link></li>

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