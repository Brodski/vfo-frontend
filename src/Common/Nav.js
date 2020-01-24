import React,  { useState, useContext, useEffect, Fragment } from 'react';
import { IsLoggedContext, UserSettingsContext, UserContext } from '../Contexts/UserContext.js';
import { Link } from 'react-router-dom'
import * as Common from  '../BusinessLogic/Common';
import GoogleButton from 'react-google-button'
import  * as GApiAuth                   from '../HttpRequests/GApiAuth';
import { mdiGoogle  } from '@mdi/js';
import Icon from '@mdi/react'
import Logo from './Logo'
import GoogleColor from './GoogleColor'
import LoginButton from './LoginButton'
import LoginButtonColor from './LoginButtonColor'
import M from 'materialize-css';
import NavImage from "../Images/navbar/green-depth.jpg";

//class Nav extends React.Component {
//const Nav = async () => {

const Nav = () => {
  
  const { isLogged2, setIsLogged2 } = useContext(IsLoggedContext);
  const { user, setUser } = useContext(UserContext);
  const { userSetings, setUserSettings } = useContext(UserSettingsContext);
  const [isInitFinished, setIsInitFinished] = useState(false)

  
  async function checkIfInitFinished(){
    await GApiAuth.getGoogleAuth() 
    if (GApiAuth.isHeSignedIn() && user.isDemo) {
      await Common.loginAndSet(setUser, setUserSettings)
    }
    setIsInitFinished(true)
  }

  useEffect( () => {
    checkIfInitFinished()
    let elems = document.querySelectorAll('.sidenav');
    M.Sidenav.init(elems, {});
  })

  const Contents = () => {
    return(
      <Fragment>
        <li> <Link to='/'> Home </Link> </li>
        <li> <Link to='/customize'> Customize </Link> </li>
        <li> <Link to='/about'> About </Link> </li>
        <li> 
          {isInitFinished  ? <LoginButton /> : null }
        </li>
      </Fragment>
    )
  }

  const ProfileImg = () => { 
    return(
      <div className="center-align nav-profile-icon">
        <img className="profile-pic" src={user.pictureUrl} alt="profile img" />
      </div>
    )
  }



    return (
      <Fragment>
        <nav>
          <div className="nav-wrapper ">
            <div className="left brand-logo  hide-on-small-only">
              <Link to='/'> <Logo /> </Link>
            </div>
            <a href="#" data-target="mobile-demo" className=" hide-on-med-and-up sidenav-trigger"><i className="material-icons">menu</i></a>
            <ul className="right  hide-on-small-only">
              <Contents />
              <li>
                {isInitFinished  ? <ProfileImg />  : null }
              </li>
            </ul>
          </div>
        </nav>    

        <ul className="right sidenav hide-on-med-and-up" id="mobile-demo">
          {/* Show at top */}
          <li>
            <div className="user-view">
              <div className="background">
                {/* multi colors heavy shadow
                <img src={"https://www.vactualpapers.com/web/wallpapers/modern-material-design-full-hd-wallpaper-no-581/thumbnail/lg.png"} /> */}
                {/* Green depth  */}
                {/* <img src={"https://ak2.picdn.net/shutterstock/videos/15526552/thumb/6.jpg"} />  */}
                <img src={NavImage} alt="pretty design" /> 
                {/* Green Flat
                <img src={"https://cdn.dribbble.com/users/588874/screenshots/2341875/dribbble.png"} />  */}
                {/* multi colors
                <img src={"https://lh6.ggpht.com/DTvbl6rnAQDxQFV38WfUrl70SwBXZLyAxAwe4lb01-OZlBGLYcVKn8WrMHe5Z6XjYACN=h900"} /> */}
              </div>
              <div><img className="circle" src={user.pictureUrl} alt="profile pic" /> </div>
              <div><span className="white-text email"> </span></div>
              <div><span className="white-text email"> {user.username} </span></div>
            </div>
          </li>
          <Contents />
        </ul>
      </Fragment>
    );
  }
export default Nav;


 // async function renderButton() {
  //   await GApiAuth.getGoogleAuth() 
    
  //   window.gapi.signin2.render('my-signin2', {
  //     //'scope': 'profile email',
  //     'width': 240,
  //     'height': 50,
  //     'longtitle': true,
  //     'theme': 'dark',
  //   })
  // }
  // // <div id="my-signin2"></div>
  // <li> 
  // <GoogleButton
  //   label='Signccccz in with Google'
  //   type="dark"
  //   disabled={false}
  //   onClick={() => { console.log('Google button clicked') }}
  //   style={baseStyle2}
  // />
  // </li>

  
  // const baseStyle2 = {
  //   height: '50px',
  //   width: '240px',
  // }