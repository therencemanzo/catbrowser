import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.css';

import CatDetails from './CatDetails';
import CatList from './CatList';

class App extends Component {


  // I use router to route the link
  // <link>/:catid for cat page
  // <link> for cat list

  render(){
    return (
      <Router>
        
          <Switch>
            <Route path="/:id" component={CatDetails} />
            <Route path="/" component={CatList} />
          </Switch>
        
      </Router>
    )
  }
}


export default App;