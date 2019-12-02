import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import About from './Pages/About';
import Home from './Pages/Home';
import Nav from './Pages/Nav';
import GetServer from './Pages/GetServer';
import PostDo from './Pages/PostDo';
//import Youtube from './Pages/Youtube';
import { Youtube } from './Pages/Youtube';
import { YoutubeNEW } from './Pages/YoutubeNEW';

// $ npm install --save googleapis
// $ npm install --save moment <------For iso 8601 duration conversion

// get w/ useEffect & useState...... https://www.youtube.com/watch?v=bYFYF2GnMy8
// useEffect ... forms, button https://reactjs.org/docs/hooks-effect.html 
function App() {
  return (
    <Router>
      <Nav />
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/about" component={About} />
        <Route path="/getServer" component={GetServer} />
        <Route path="/doPost" component={PostDo} />
        <Route path="/youtube" component={Youtube} />
        <Route path="/youtube1" component={YoutubeNEW} />
      </Switch>
    </Router> 
  );
}

export default App;