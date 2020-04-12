import { Link } from 'react-router-dom'
import React, { Fragment, useContext, useEffect, useState } from 'react';

import {  Divider, Dropdown, Icon, Navbar } from 'react-materialize';

import * as Common from '../BusinessLogic/Common.js';
import * as GApiAuth from '../HttpRequests/GApiAuth';
import { IsLoggedContext, UserContext, UserSettingsContext } from '../Contexts/UserContext.js';
import LoginButton from './LoginButton'
import Logo from '../Images/Logo.jsx'
import NavImage from "../Images/profile-background.jpg";

const Nav = () => {

  const { user, setUser } = useContext(UserContext);
  const { setUserSettings } = useContext(UserSettingsContext);
  const [isInitFinished, setIsInitFinished] = useState(false)
  const { isLogged2 } = useContext(IsLoggedContext);

  async function checkIfInitFinished() {
    
    await Common.betterLogin(setUser, setUserSettings)
    setIsInitFinished(true)
  }

  useEffect(() => {
    checkIfInitFinished()
  })

  const LoggedInDropdown = () => (
    <Fragment>
      <Link to='/delete'> 
        <Icon> security </Icon>  Your Data 
      </Link>
      <a onClick={() => { GApiAuth.logout() }}> 
        <Icon> person_outline </Icon>
        Logout
      </a>    
    </Fragment>
  )

  const LoggedOutDropdown = () => (
    <a onClick={() => { GApiAuth.login() }}> 
      <Icon> person_outline </Icon>
      Login
    </a>    
  )

  const UserDropdown = () => (
    <Dropdown
      id="dropdownId"
      options={{
        constrainWidth: false,
      }}
      trigger={<a href=""> <ProfileImg /> </a>}
    >
      {isLogged2 ? <LoggedInDropdown /> : <LoggedOutDropdown />}
    </Dropdown>
  )

  const ProfileImg = () => {
    if (isInitFinished){
      return (
        <div className="center-align nav-profile-icon">
          <img className="profile-pic" src={user.pictureUrl} alt="profile img" />
        </div>
      )
    }
    return (null)
  }
  
  const SideNavBar = () => (
    <Fragment>
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
      <li> <Link to='/'> Home </Link> </li>
      <li> <Link to='/customize'> Customize </Link> </li>
      <Divider />
      <li> <Link to='/about'> About </Link> </li>
      {isLogged2 ? <li> <Link to='/delete'> Your Data </Link> </li> : null}
      <li>
        {isInitFinished ? <LoginButton /> : null}
      </li>
    </Fragment>
  )

  return (
    <Navbar
      alignLinks="right"
      menuIcon={<Icon>menu</Icon>}
      options={{ }}
      brand={<Link to="/" className="brand-logo "> <Logo /> </Link>}
      sidenav={<SideNavBar />}
    >
      <Link to='/'> Home </Link>
      <Link to='/customize'>Customize </Link>
      <Link to='/about'> About </Link>
      {isInitFinished ? <LoginButton isSideNav={true} /> : null}
      <UserDropdown />
    </Navbar>
  );
}
export default Nav;