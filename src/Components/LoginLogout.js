import React, { useState, useContext } from 'react';
import { UserContext } from '../Contexts/UserContext';
import * as GApiAuth from '../HttpRequests/GApiAuth';
import * as ServerEndpoints from '../HttpRequests/ServerEndpoints';



const Logout = (props) => {

  console.log("Log Out msg??")

  return (<button onClick={ async () => {
    console.log("Logging out...");
    let rtn = await GApiAuth.logout();
    rtn ? props.setUser(null)                : console.log("Logout canceled")
    rtn ? console.log("Log out successful")  : console.log("Logout canceled")
      

    }}> Logout </button> )
}

const Login = (props) => {

  console.log("In")

  return (<button onClick={ async () => {
    console.log("Logging in...");
    let rtn = await GApiAuth.login()
    rtn ? props.setUser(await ServerEndpoints.getDummyUser() ) :  console.log("Login canceled")
    rtn ? console.log("Log in successful")              :  console.log("Login canceled")
      
  }}> Login </button> )
}

const LogButtons = (props) => {
  if (props.user) {
    return <Logout setUser={props.setUser} />;
  }
  else
    return <Login setUser={props.setUser}/>;
}


export const LoginLogout = (props) => {
  
  const { user, setUser } = useContext(UserContext);
  console.log('rnd message from loginLogout???"')
  const msg = user ? "Logout :(" : "Login :)"



  return (
    <div>
      <h3> {msg} </h3>
      LogButtons
      <LogButtons setUser={setUser} user={user} />
      <div/>
      user ternary
      {user ? <Logout setUser={setUser} /> : <Login setUser={setUser}/>}

    </div>
  );
}

