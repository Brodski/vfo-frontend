import React, { useState, useContext } from 'react';
import { UserContext } from '../Contexts/UserContext.js'
import { ButtonsAuthDebug } from '../Components/ButtonsAuthDebug';

function UserGreeting(props) {
  return <h1>Welcome back!</h1>;
}

function GuestGreeting(props) {
  return <h1>Please sign up.</h1>;
}

function Greeting(props) {
  const isLoggedIn = props.isLoggedIn;
  if (isLoggedIn) {
    return <UserGreeting />;
  }
  return <GuestGreeting />;
}


export const Settings = () => {
  const [isSigned, setIsSigned] = useState()
  //setIsSigned(true)
  const { user, setUser } = useContext(UserContext);
  return (
    <div>
      <h1>this is the about settings</h1>
      <div> user message: {user} </div>
      <Greeting isLoggedIn={isSigned} />
      <button onClick={() => setIsSigned(!isSigned)} > Toggle Sign in </button>
      <button onClick={() => setUser('man this is it')} > change </button>

      <ButtonsAuthDebug/>
    </div>
  );
}

