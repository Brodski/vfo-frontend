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
import { UserContext } from './Contexts/UserContext.js'
import { IsSignedContext } from './Contexts/IsSignedContext.js'
import * as GApiAuth from './HttpRequests/GApiAuth'
import * as ServerEndpoints from './HttpRequests/ServerEndpoints'

// $ npm install --save googleapis
// $ npm install --save moment <------For iso 8601 duration conversion

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
    console.log('ServerEndpoints.getDummyUser()')
    console.log(ServerEndpoints.getDummyUser())
    setUser(await ServerEndpoints.getDummyUser())
    console.timeEnd("initshit()")
    console.log('POST INITSHIT: GoogleAuth - ')
    console.log(GoogleAuth)
  }
  
  const [isSigned, setIsSigned] = useState(false)
  const [user, setUser] = useState(null)

  return (
    <Router>
      <Nav />
      <Switch>
        <UserContext.Provider value={{ user, setUser }}>
          <Route path="/" exact component={Home} />
          <Route path="/about" component={About} />
          <Route path="/getServer" component={GetServer} />
          <Route path="/doPost" component={PostDo} />
          <Route path="/youtube" component={YoutubeNEW} />
          <Route path="/settings" component={Settings} />
        </UserContext.Provider>
      </Switch>
    </Router> 
  );
}

export default App;