import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import About from './Pages/About';
import Home from './Pages/Home';
import Nav from './Pages/Nav';
import GetServer from './Pages/GetServer';
import PostDo from './Pages/PostDo';
//import Youtube from './Pages/Youtube';
import { YoutubeNEW } from './Pages/YoutubeNEW';
import { Settings } from './Pages/Settings';
import { SettingsNEW } from './Pages/SettingsNEW';
import { UserContext, UserSettingsContext, IsSignedContext } from './Contexts/UserContext.js'

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
// $ npm install --save react-sortablejs <-- dele thtis trash
// $ npm install react-drag-and-drop

// get w/ useEffect & useState...... https://www.youtube.com/watch?v=bYFYF2GnMy8
// useEffect ... forms, button https://reactjs.org/docs/hooks-effect.html 
function App() {

  useEffect(() => {

    console.log("\n\n\n\nHELLO YOU SHOULD ONLY SEE ME ONCE!!!!!!!!!!!!!!!!!!\n\n\n\n")
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://apis.google.com/js/client.js";
    script.async = true
    document.body.appendChild(script)
    script.onload = () => {
      initShit()
    }
  }, [])

    
  async function initShit() {
    console.time("initshit()")
    var GoogleAuth = await GApiAuth.initGoogleAPI()  // Usually 500ms
    await GApiAuth.isHeSignedIn()
    console.log(GoogleAuth.isSignedIn.get())
    console.log(GoogleAuth)

    let theUser = ServerEndpoints.getMockUser
    setUser(theUser);
    setUserSettings(theUser);

    setIsSigned( GoogleAuth.isSignedIn.get())
    console.timeEnd("initshit()")
  }
  
  const [isSigned, setIsSigned] = useState(false)
  const [user, setUser]                 = useState(new User())
  const [userSettings, setUserSettings] = useState(new User())

  //<UserSettingsContext.Provider value={{ userSettings, setUserSettings }}>
   //     </UserSettingsContext.Provider>
  return (
    <Router>
      <div className="super-body-wrap">
        <Nav />
        <Switch>
          <UserContext.Provider value={{ user, setUser }}>
          <UserSettingsContext.Provider value={{ userSettings, setUserSettings }}>
          <IsSignedContext.Provider value={{isSigned, setIsSigned}} >
            <Route path="/" exact component={Home} />
            <Route path="/about" component={About} />
            <Route path="/getServer" component={GetServer} />
            <Route path="/doPost" component={PostDo} />
            <Route path="/youtube" component={YoutubeNEW} />
        
            <Route path="/settings" component={Settings} />
            <Route path="/settings2" component={SettingsNEW} />
          
          </IsSignedContext.Provider>
          </UserSettingsContext.Provider>     
          </UserContext.Provider>

        </Switch>
      </div>
    </Router> 
  );
}

export default App;