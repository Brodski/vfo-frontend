import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
//import About from './Pages/About';
import SortableComponent from './Pages/About';
import Home from './Pages/Home';
import Nav from './Pages/Nav';
import GetServer from './Pages/GetServer';
import PostDo from './Pages/PostDo';
//import Youtube from './Pages/Youtube';
import { YoutubeNEW } from './Pages/YoutubeNEW';

import { SettingsNEW } from './Pages/SettingsNEW';
import { UserContext, UserSettingsContext, IsLoggedContext } from './Contexts/UserContext.js'

import * as GApiAuth from './HttpRequests/GApiAuth'
import * as ServerEndpoints from './HttpRequests/ServerEndpoints'
import { User } from './Classes/User'


// $ npm install --save googleapis
// $ npm install --save moment <------For iso 8601 duration conversion
// $ npm install --save react-sortablejs
// $ npm install --save sortablejs 
// $ npm install --save react-modal
// $ npm install --save @yaireo/tagify
// $ npm install --save react-infinite-scroller
// $ npm install --save array-move
// $ npm install --save react-id-generator
// $ npm install --save env-cmd 
// $ npm install --save react-loading

// get w/ useEffect & useState...... https://www.youtube.com/watch?v=bYFYF2GnMy8
// useEffect ... forms, button https://reactjs.org/docs/hooks-effect.html 
function App() {

  useEffect(() => {
    console.log("\n\n\n\n HELLO WELCOME TO 'APP.JS' !!!!!!!!!!!!\n\n\n\n")
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://apis.google.com/js/client.js";
    script.async = true
    document.body.appendChild(script)
    script.onload = () => {
      initGApi()
    }
  }, [])
      
  async function initGApi() {
  
    console.time("initGApi()")
    await GApiAuth.initGoogleAPI()  // Usually 500msisSignedIn.get())
    console.timeEnd("initGApi()")
    
    /*
    if (GoogleAuth.isSignedIn.get() == false) {
      let theUser = ServerEndpoints.getMockUser()
      setUser(theUser);
      setUserSettings(theUser);
    }
    */
  }
  
  const [user, setUser]                 = useState(ServerEndpoints.getMockUser())
  const [userSettings, setUserSettings] = useState(ServerEndpoints.getMockUser())
  const [isLogged2, setIsLogged2]       = useState('firstrun')
  return (
    <Router>
        <Nav />
        <Switch>
          <UserContext.Provider value={{ user, setUser }}>
          <UserSettingsContext.Provider value={{ userSettings, setUserSettings }}>
          <IsLoggedContext.Provider value={{ isLogged2, setIsLogged2 }}>
            <Route path="/" exact component={Home} />
            <Route path="/about" component={SortableComponent} />
            <Route path="/getServer" component={GetServer} />
            <Route path="/doPost" component={PostDo} />
            <Route path="/youtube" component={YoutubeNEW} />
        
            
            <Route path="/settings2" component={SettingsNEW} />
          </IsLoggedContext.Provider>
          </UserSettingsContext.Provider>     
          </UserContext.Provider>

        </Switch>
    </Router> 
  );
}

export default App;