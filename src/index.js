import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import CreatePosts from "./components/CreatePosts/createPosts";
import {Router, Route, browserHistory} from 'react-router'
import * as serviceWorker from './serviceWorker';
import { createBrowserHistory } from 'history';
ReactDOM.render(
    // <Router history={createBrowserHistory()}>
    //     <Route path={"/"} component={App}></Route>
    //     {/*<Route path={"/posts"} component={CreatePosts}></Route>*/}
    // </Router>,

    <App/>,

  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
