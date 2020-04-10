import { Link } from 'react-router-dom'
import React, { Fragment, useContext, useEffect, useState } from 'react';

import { Button, Divider, Dropdown, Icon, NavItem,Navbar } from 'react-materialize';
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
    
    let elem2 = document.querySelectorAll('.dropdown-trigger');
   // let instances = M.Dropdown.init(elems, {});
    // let instance = M.Dropdown.getInstance(elem2);
    console.log("elems")
    console.log("elems")
    console.log(elems)
    console.log(elem2)
    //M.Sidenav.init(elems, {});
    // M.Dropdown.init(elem2, {});
    // for (let i = 0; i < elem2.length; i++){
    //   M.Dropdown.init(elem2[i]);
    // }
    // M.Sidenav.init(elem2, {});
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
  

  const UserDropdown = () => (
    <Dropdown
      id="Dropdown_6"
      options={{
        alignment: "left",
        coverTrigger: "false",
      }}
      trigger={<a href=""> <ProfileImg /> </a>}
      // trigger={<Button node="button">Drop Me!</Button>}
    >
      <a href="#"> one </a>
      <a href="#"> two </a>
      <Divider />
      <a href="#"> three </a>
      <a href="#">
        <Icon> view_module </Icon>
        four
      </a>
      <a href="#"> 
        <Icon> cloud </Icon>
        {'    '}five
      </a>
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

  const LargeScreenNav = () => (
    <Fragment>
      <nav>
        <div className="nav-wrapper ">
          <div className="left brand-logo  hide-on-small-only">
            <Link to='/'> <Logo /> </Link>
          </div>
          <ul className="right hide-on-small-only">
            <Contents />
            <li>
              <ProfileImg />
            </li>
            <UserDropdown />
          </ul>
        </div>
      </nav>
    </Fragment>
  )

  
  const LargeScreenNav2 = () => (
    // <!-- Dropdown Structure -->
    <Fragment>
      <Navbar
        alignLinks="right"
        //menuIcon={null}
        menuIcon={<Icon>menu</Icon>}
        options={{
        }}
        brand={<Link to="/" className="brand-logo "> <Logo /> </Link>}
        sidenav={<SmallScreenSideNav2 />}
      >
        <Link to='/'> Home </Link>
        <Link to='/customize'>Customize </Link>
        <Link to='/about'> About </Link>
        <Link to='/delete'> Privacy </Link>
        {isInitFinished ? <LoginButton isSideNav={true}/> : null}
        <UserDropdown />
      </Navbar>
    </Fragment>
  )

  const SmallScreenSideNav2 = () => (
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
      <Contents />
    </Fragment>
  )

  const SmallScreenSideNav = () => (
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
      {/* <Contents /> */}
    </ul>
  )

  return (
    <Fragment>
      <LargeScreenNav2 /> 
      {/* <SmallScreenSideNav /> */}
    </Fragment>
  );
}
export default Nav;