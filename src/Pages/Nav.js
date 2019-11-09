import React from 'react';
import { Link } from 'react-router-dom'

class Nav extends React.Component {
  render() {
    return (
      <nav >
        <ul>
          <li> <Link to='/'> Home </Link> </li>
          <li> <Link to='/about'> About </Link> </li>
          <li> <Link to='/getServer'> getHost </Link> </li>
          <li> <Link to='/doPost'> doPost </Link> </li>
        </ul>
      </nav>
    );
  }
}
export default Nav;
