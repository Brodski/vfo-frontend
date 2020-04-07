import { Link } from 'react-router-dom'
import React, { Fragment, useContext, useEffect, useState } from 'react';

import M from 'materialize-css';

import * as Common from '../BusinessLogic/Common.js';
import { UserContext, UserSettingsContext } from '../Contexts/UserContext.js';
import LoginButton from './LoginButton'
import Logo from '../Images/Logo.jsx'
import NavImage from "../Images/profile-background.jpg";

const Nav = () => {

  const { user, setUser } = useContext(UserContext);
  const { setUserSettings } = useContext(UserSettingsContext);
  const [isInitFinished, setIsInitFinished] = useState(false)


  async function checkIfInitFinished() {

    await Common.betterLogin(setUser, setUserSettings)
    setIsInitFinished(true)
  }

  useEffect(() => {
    checkIfInitFinished()
    let elems = document.querySelectorAll('.sidenav');
    M.Sidenav.init(elems, {});
  })

  const Contents = () => {
    return (
      <Fragment>
        <li> <Link to='/'> Home </Link> </li>
        <li> <Link to='/customize'> Customize </Link> </li>
        <li> <Link to='/about'> About </Link> </li>
        <li> <Link to='/delete'> Privacy </Link> </li>
        <li>
          {isInitFinished ? <LoginButton /> : null}
        </li>
      </Fragment>
    )
  }

  const ProfileImg = () => {
    return (
      <div className="center-align nav-profile-icon">
        <img className="profile-pic" src={user.pictureUrl} alt="profile img" />
      </div>
    )
  }
  const SmallScreenSideNav = () => (
    <nav>
      <div className="nav-wrapper ">
        <div className="left brand-logo  hide-on-small-only">
          <Link to='/'> <Logo /> </Link>
        </div>
        <a href="#" data-target="mobile-demo" className=" hide-on-med-and-up sidenav-trigger"><i className="material-icons">menu</i></a>
        <ul className="right  hide-on-small-only">
          <Contents />
          <li>
            {isInitFinished ? <ProfileImg /> : null}
          </li>
        </ul>
      </div>
    </nav>
  )

  const LargeScreenNav = () => (
    <ul className="right sidenav hide-on-med-and-up" id="mobile-demo">
      <li>
        <div className="user-view">
          <div className="background">
            <img src={NavImage} alt="pretty design" />
          </div>
          <div><img className="circle" src={user.pictureUrl} alt="profile pic" /> </div>
          <div><span className="white-text email"> </span></div>
          <div><span className="white-text email"> {user.username} </span></div>
        </div>
      </li>
      <Contents />
    </ul>
  )

  return (
    <Fragment>
      <SmallScreenSideNav />
      <LargeScreenNav /> 
    </Fragment>
  );
}
export default Nav;