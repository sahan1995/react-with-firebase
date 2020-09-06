import React from 'react';
import Navbar from './components/NavBar/NavBar'
import './App.css';
import Posts from "./components/posts/Posts";
import CreatePosts from "./components/CreatePosts/createPosts";
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";

function App() {
  return (
      <Router>
          <div className="App">
              <Navbar />

                  <Route path='/' exact component={Posts}></Route>
                  <Route path='/submit' component={CreatePosts}></Route>

              {/*<Posts/>*/}
          </div>
      </Router>

  );
}
export default App;
