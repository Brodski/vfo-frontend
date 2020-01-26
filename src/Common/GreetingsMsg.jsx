import React, { Fragment, useContext } from 'react';

import PropTypes from 'prop-types';

import { IsLoggedContext, UserContext } from '../Contexts/UserContext.js';


const GreetingsMsg = (props) => {

  GreetingsMsg.propTypes = {
    isSettingsPage: PropTypes.bool,
  }

  GreetingsMsg.defaultProps = {
    isSettingsPage: false,
  };

  const { isSettingsPage } = props
  const { isLogged2, setIsLogged2 } = useContext(IsLoggedContext);
  const { user, setUser } = useContext(UserContext);

  const LoggedOut = () => {
    let extraClasses = isSettingsPage ? "left" : "center-align";
    return (
      <div className={` demo-greeting-wrap ${extraClasses}`}>
        <div className="flow-text">
          Currently using a demo profile.
          <br />
          Log in to customize your homepage
        </div>
        {!isSettingsPage ? <div className='div-aux' /> : null}
      </div>
    )
  }

  const LoggedIn = () => {
    let extraClasses = isSettingsPage ? "left" : "";
    return (
      <div className={`profile-greeting-wrap  ${extraClasses}`}>
        <h4 className="profile-msg2 ">
          Hi, {user.username}
        </h4>
        {!isSettingsPage ? <div className='div-aux' /> : null}
      </div>
    )
  }


  return (
    <Fragment>
      {isLogged2 === true && !user.isDemo ? <LoggedIn /> : <LoggedOut />}
    </Fragment>
  )
}
export default GreetingsMsg

