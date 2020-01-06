import React, { useEffect, useContext, useState } from 'react';
import { UserContext } from '../Contexts/UserContext.js'
import { UserSettingsContext } from '../Contexts/UserContext.js'
import * as ytLogic from '../BusinessLogic/ytLogic'



function Home() {
  const { user, setUser } = useContext(UserContext);
  const { userSettings, setUserSettings } = useContext(UserSettingsContext);

  useEffect(() => {
    console.log('HOME!!!!!!!!!!!!!!!!')
    //ytLogic.saveToLocal([])
  },[])


  return (
    <div>
      <button onClick={() => console.log(user)}> log user </button>
      <button onClick={() => console.log(userSettings)}> log userSettings </button>
      <h1>Home</h1>
      <h3> This environment is for: {process.env.REACT_APP_ENV_NAME} </h3>
      <h3> DB/server at {process.env.REACT_APP_SPRINGB_DOMAIN} </h3>
    </div>
  );
}

export default Home;