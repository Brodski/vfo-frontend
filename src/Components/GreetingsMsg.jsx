import { Link } from 'react-router-dom';
import React, { Fragment, useContext } from 'react';

import PropTypes from 'prop-types';

import { IsLoggedContext, UserContext } from '../Contexts/UserContext.js';
// import DevWithYT from "../Images/DevWithYT-black.png"
import DevWithYt from '../Components/DevWithYt.jsx';

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
    // let extraClasses = isSettingsPage ? "left" : "center-align";
    let extraClasses = isSettingsPage ? "center-align" : "center-align";
    console.log("isSettingsPage")
    console.log("isSettingsPage")
    console.log("isSettingsPage")
    console.log("isSettingsPage")
    console.log("isSettingsPage")
    console.log(isSettingsPage)
    return (
      <div className={` demo-greeting-wrap ${extraClasses}`}>
        {!isSettingsPage ? <GetStarted /> : null }
        <div className="flow-text">
          Currently using a demo profile.
          {isSettingsPage 
            // ? <div> <img className="dev-with-yt-demo-setting" src={DevWithYT} /> </div> 
            // ? <div> <DevWithYt /> </div> 
            ? <div className='flow-text'> Log in to organize your Youtube subscriptions </div>
            : <div>
                {/* <div className='flow-text'> Log in to organize your Youtube subscriptions </div>  */}
                {/* <img className="dev-with-yt-demo-home" src={DevWithYT} /> */}
                <DevWithYt />
              </div>
          }
          {/* <br />
          Log in with your Youtube account to organize your subscriptions */}
        </div>
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
          <DevWithYt />
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

