import React, { useEffect, useContext, useState } from 'react';
import { UserContext } from '../Contexts/UserContext.js'
import { UserSettingsContext } from '../Contexts/UserContext.js'
import * as ytLogic from '../BusinessLogic/ytLogic'
function About() {
  const { user, setUser } = useContext(UserContext);
  const { userSettings, setUserSettings } = useContext(UserSettingsContext);
  useEffect(() => {
    console.log('HOME!!!!!!!!!!!!!!!!')
    console.log('user')
    console.log(user)
    console.log('userSettings')
    console.log(userSettings)
    //ytLogic.saveToLocal([])
  },[])
  return (
    <div>
      <h1>Home</h1>
    </div>
  );
}

export default About;