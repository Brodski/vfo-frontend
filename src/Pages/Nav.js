import React from 'react';
import { Link } from 'react-router-dom'

class Nav extends React.Component {
  render() {
    return (
      <nav >
        <ul>
          <li> <Link to='/'> Home </Link> </li>

          <li> <Link to='/youtube'> youtube </Link> </li>

          <li> <Link to='/settings2'> Settings2 </Link> </li>
        </ul>
      </nav>
    );
  }
}
export default Nav;
