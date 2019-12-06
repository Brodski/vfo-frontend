import React, { useState } from 'react';
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
// $ npm install --save googleapis
// $ npm install --save moment <------For iso 8601 duration conversion

// get w/ useEffect & useState...... https://www.youtube.com/watch?v=bYFYF2GnMy8
// useEffect ... forms, button https://reactjs.org/docs/hooks-effect.html 
function App() {

const [user, setUser] = useState('hello from contexttt')
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