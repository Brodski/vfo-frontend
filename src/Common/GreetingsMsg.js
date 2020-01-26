import React, { useState, useEffect, useContext, createContext, Fragment } from 'react';
import { UserContext, UserSettingsContext, IsLoggedContext, IsInitFinishedContext } from '../Contexts/UserContext.js';
import PropTypes from 'prop-types';

const GreetingsMsg = (props) => {

  GreetingsMsg.propTypes = {
     isSettingsPage: PropTypes.bool.isRequired
  }

  const { isSettingsPage} = props
  
  console.log("GREETINGS!!!!!!")
  console.log("GREETINGS!!!!!!")
  console.log("GREETINGS!!!!!!")
  console.log("GREETINGS!!!!!!")
  console.log("GREETINGS!!!!!!")
  console.log(props)
  console.log(isSettingsPage)

  const { isLogged2, setIsLogged2 } = useContext(IsLoggedContext);

  const { user, setUser } = useContext(UserContext);
  const { userSetings, setUserSettings } = useContext(UserSettingsContext);
  const { isInitFinished2, setIsInitFinished2 } = useContext(IsInitFinishedContext);

  const LoggedOut = () => {
    let extraClasses =  isSettingsPage ? "left" : "center-align";
    return (    
      <div className={` demo-greeting-wrap ${extraClasses}`}>
      {/* <div className="center-align demo-greeting-wrap"> */}
        <div className="flow-text">
          Currently using a demo profile.
          <br />  
          Log in to customize your homepage
        </div>
        { ! isSettingsPage ? <div className='div-aux' /> : null }
        {/* <div className='div-aux' /> */}
      </div>
    )
  }

  const LoggedIn = () => {
    let extraClasses =  isSettingsPage ? "left" : "";
    return(
      // <div className=" profile-greeting-wrap">
      <div className= {`  profile-greeting-wrap  ${extraClasses}`}>
        {/* <img className="profile-pic" src={user.pictureUrl}></img> */}
        <h4 className="profile-msg2 "> 
          Hi, {user.username}   
        </h4> 
        { ! isSettingsPage ? <div className='div-aux' /> : null }
        {/* <div className="divider"></div> */}
      </div>
      )
  }
  
  
    return ( 
      <Fragment>
        { isLogged2 === true && !user.isDemo ? <LoggedIn /> : <LoggedOut /> }   
        
      </Fragment>
    )
  }
  export default GreetingsMsg
  
