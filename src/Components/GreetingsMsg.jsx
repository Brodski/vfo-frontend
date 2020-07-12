import { Link } from 'react-router-dom';
import React, { Fragment, useContext } from 'react';

import PropTypes from 'prop-types';

import { IsLoggedContext, UserContext } from '../Contexts/UserContext.js';
import DevWithYT from "../Images/DevWithYT-black.png"

const GreetingsMsg = (props) => {

  GreetingsMsg.propTypes = {
    isSettingsPage: PropTypes.bool,
  }

  GreetingsMsg.defaultProps = {
    isSettingsPage: false,
  };

  const { isSettingsPage } = props
  const { isLogged, setIsLogged } = useContext(IsLoggedContext);
  const { user, setUser } = useContext(UserContext);

  const GetStarted = () => {
    return (
      <Fragment>
        <div>
          <div className="flow-text">
            <Link to='/organize'> Click here to try it out! </Link>
          </div>
        </div>
      </Fragment>
    )
  }

  const LoggedOut = () => {
    let extraClasses = isSettingsPage ? "left" : "center-align";
    return (
      <div className={` demo-greeting-wrap ${extraClasses}`}>
        {!isSettingsPage ? <GetStarted /> : null }
        <div className="flow-text">
          Currently using a demo profile.
          <br />
          Log in with your Youtube account to organize your subscriptions
        </div>
        {/* {!isSettingsPage ? <img className="dev-with-yt-demo" src={DevWithYT} /> : null } */}
        <div> This is a third party app not owned by Youtube </div>
        {!isSettingsPage ? <div className='div-aux' /> : null }
      </div>
    )
  }

  const LoggedIn = () => {
    let extraClasses = isSettingsPage ? "left" : "";
    return (
      <div className={`profile-greeting-wrap  ${extraClasses}`}>
        <h4 className="profile-msg2 ">
          Hi, {user.username}
          <div />
          <img className="dev-with-yt-main" src={DevWithYT} />
        </h4>
        {!isSettingsPage ? <div className='div-aux' /> : null}
      </div>
    )
  }


  return (
    <Fragment>
      {isLogged === true && !user.isDemo ? <LoggedIn /> : <LoggedOut />}
    </Fragment>
  )
}
export default GreetingsMsg
