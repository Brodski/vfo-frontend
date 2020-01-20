import React,  { useState, useContext, useEffect } from 'react';
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
import LoginButton2 from './LoginButton2'

// https://icons8.com/icons/set/google
// https://materialdesignicons.com/

//class Nav extends React.Component {
//const Nav = async () => {

const Nav = () => {
  const { isLogged2, setIsLogged2 } = useContext(IsLoggedContext);
  const { user, setUser } = useContext(UserContext);
  const { userSetings, setUserSettings } = useContext(UserSettingsContext);
  const [isInitFinished, setIsInitFinished] = useState(false)
  useEffect( () => {
    checkIfInitFinished()
  })

  const ProfileImg = () => { 
    return(
      <div className="center-align nav-profile-icon">
        <img className="profile-pic" src={user.pictureUrl} />
      </div>
    )
  }

async function checkIfInitFinished(){
  await GApiAuth.getGoogleAuth() 
  if (GApiAuth.isHeSignedIn() && user.isDemo) {
    await Common.loginAndSet(setUser, setUserSettings)
  }
  setIsInitFinished(true)
}

    return (
        <nav >
          <div className="nav-wrapper ">
            <div className="left brand-logo  hide-on-small-only">
              <Link to='/'> <Logo /> </Link>
            </div>
            <ul className="right">
              <li> <Link to='/'> Home </Link> </li>
              <li> <Link to='/customize'> Customize </Link> </li>
              <li> <Link to='/about'> About </Link> </li>
              <li> 
                {isInitFinished  ? <LoginButton /> : null }
              </li>
              <li>
                {isInitFinished  ? <LoginButton2 /> : null }
              </li>
              <li>
              {isInitFinished  ? <ProfileImg/>  : null }
              </li>
            </ul>
          </div>
        </nav>    
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