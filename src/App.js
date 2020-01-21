import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import About from './Common/Home';
import Nav from './Common/Nav';


import { YoutubeNEW } from './Youtube/YoutubeNEW';

import { SettingsNEW } from './Settings/SettingsNEW';
import { UserContext, UserSettingsContext, IsLoggedContext } from './Contexts/UserContext.js'

import * as GApiAuth from './HttpRequests/GApiAuth'
import * as ServerEndpoints from './HttpRequests/ServerEndpoints'
import { User } from './Classes/User';

import * as Common                    from './BusinessLogic/Common.js';
import * as ytLogic                     from './BusinessLogic/ytLogic.js'
import moment from 'moment';
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
// $ npm i --save react-google-button
// $ npm i --save install materialize-css@next
// $ npm install --save @material-ui/core
// $ npm install --save @mdi/font
// $ npm install --save @mdi/react @mdi/js
// $ npm install --save node-sass
// $ npm install --save human-format
// $ npm install react-responsive-carousel --save
//

// get w/ useEffect & useState...... https://www.youtube.com/watch?v=bYFYF2GnMy8
// useEffect ... forms, button https://reactjs.org/docs/hooks-effect.html 

function App() {

  useEffect(() => {
    console.log("\n\n\n\n HELLO WELCOME TO 'APP.JS' !!!!!!!!!!!!\n\n\n\n")
    initGApi()
    //This is b/c adblock will block the googleapi script/link/cdn if its in the HTML
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://apis.google.com/js/client.js";
    script.async = true
    document.body.appendChild(script)
    script.onload = () => {
      initGApi()
    }
    
    moment.updateLocale('en', {
      relativeTime: {
        m: "1 minute",
        h: "1 hour",
        d: "1 day",
        M: "1 month",
        y: "1 year",
      }
    });
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
      initGApi()
      return;
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
        <Switch>
          <UserContext.Provider value={{ user, setUser }}>
          <UserSettingsContext.Provider value={{ userSettings, setUserSettings }}>
          <IsLoggedContext.Provider value={{ isLogged2, setIsLogged2 }}>
            <Nav />
            <Route path="/" exact component={YoutubeNEW} />

            <Route path="/about" component={About} />
        
            
            <Route path="/customize" component={SettingsNEW} />
            
          </IsLoggedContext.Provider>
          </UserSettingsContext.Provider>     
          </UserContext.Provider>
        </Switch>
    </Router> 
  );
}

export default App;