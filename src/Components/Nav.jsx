import { Divider, Dropdown, Icon, Navbar } from 'react-materialize';
import { Link } from 'react-router-dom'
import React, { Fragment, useContext, useEffect, useState } from 'react';

import * as Common from '../BusinessLogic/Common.js';
import * as GApiAuth from '../HttpRequests/GApiAuth';
import { IsLoggedContext, UserContext, UserSettingsContext } from '../Contexts/UserContext.js';
import LoginButton from './LoginButton'
import Logo from '../Images/MainLogo.jsx'
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
        <Icon> https </Icon>  Your Data 
      </Link>
      <Link to='/privacy'> 
        <Icon> security </Icon>  Privacy
      </Link>
      <Divider />
      <a onClick={() => { GApiAuth.logout() }}> 
        <Icon> person_outline </Icon>
        Logout
      </a>    
    </Fragment>
  )

  const LoggedOutDropdown = () => {
    return (
      <a onClick={() => { GApiAuth.login() }}> 
        <Icon> person_outline </Icon>
        Login
      </a>    
  )
}

  const UserDropdown = () => (
    <Dropdown
      id="dropdownId"
      options={{
        constrainWidth: false,
      }}
      trigger={<a href=""> <ProfileImg /> </a>}
    >
      {/* {isLogged2 ? <LoggedInDropdown /> : <LoggedOutDropdown />} */}
      {isLogged2 ? <LoggedInDropdown /> : null }
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
      <li> <Link to='/'>          <Icon> home </Icon> Home </Link> </li>
      <li> <Link to='/organize'> <Icon> layers </Icon> Organize </Link> </li>
      <li> <Link to='/about'>     <Icon> info </Icon> About </Link> </li>
      <Divider />
      <li> <Link to='/privacy'>            <Icon> security </Icon> Privacy Policy </Link> </li> 
      {isLogged2 ? <li> <Link to='/delete'> <Icon> https </Icon> Your Data </Link> </li> : null}
      
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
      brand={<Link to="/" className="brand-logo brand-logo-aux"> <Logo /> </Link>}
      sidenav={<SideNavBar />}
    >
      <Link to='/'>           <div className="nav-text"> Home  </div>        </Link>
      <Link to='/organize'>  <div className="nav-text"> Organize </div></Link>
      <Link to='/about'>     <div className="nav-text"> About </div></Link>
      {isInitFinished ? <LoginButton /> : null}
      
      <UserDropdown />
    </Navbar>
  );
}
export default Nav;