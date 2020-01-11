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
import * as Common                    from './BusinessLogic/Common.js';
import * as ytLogic                     from './BusinessLogic/ytLogic.js'

// $ npm install --save googleapis
// $ npm install --save moment <------For iso 8601 duration conversion
// $ npm install --save react-sortablejs
// $ npm install --save sortablejs 
// $ npm install --save react-modal

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
    let GoogleAuth = await GApiAuth.initGoogleAPI()  // Usually 500msisSignedIn.get())
    console.timeEnd("initGApi()")

    setIsLogged2(GApiAuth.isHeSignedIn())

    // solution to the 2% crash chance where i get random thread bug saying GoogleAuth is null. I think the interpreter does not fully await for initGoogleAPI()???
    while (GoogleAuth == null) {
      console.log("Shits null af ", GoogleAuth)
      await Common.sleep(500)
    }

    GoogleAuth.isSignedIn.listen( function (val) {
      console.log('Signin state changed to ', val, "\nSetting to: ", GApiAuth.isHeSignedIn());
      setIsLogged2(GApiAuth.isHeSignedIn())
      window.location.reload(true);
    });
    
    //if (GApiAuth.isHeSignedIn() && user.isDemo) {
    //  console.log("Logged in: Should be doing fetch to server")
    //  //await ytLogic.loginAndSet(setUser, setUserSettings)
    //  let res = await ServerEndpoints.loginToBackend();
    //  if (res.status > 199 && res.status < 300) {
    //    console.log('Recieved user from server: ', res.status)
    //    let u = await ytLogic.processUserFromServer(res)
    //    setUser(prev => {
    //      prev.customShelfs = u.customShelfs
    //      prev.googleId = u.googleId
    //      prev.pictureUrl = u.pictureUrl
    //      prev.username = u.username
    //      prev.isDemo = false
    //      return prev
    //    })
    //    setUserSettings(prev => {
    //      prev.customShelfs = u.customShelfs
    //      prev.googleId = u.googleId
    //      prev.pictureUrl = u.pictureUrl
    //      prev.username = u.username
    //      prev.isDemo = false
    //      return prev
    //    } 
    //  }
    

  }
  
  const [user, setUser]                 = useState(Common.getMockUser())
  const [userSettings, setUserSettings] = useState(Common.getMockUser())
  const [isLogged2, setIsLogged2]       = useState(false)
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