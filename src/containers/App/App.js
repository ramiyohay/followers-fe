/**
 * Main APP
 */

import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import LoginPage from '../LoginPage';
import PrivateRoute from "../../components/PrivateRoute";
import FollowersPage from "../FollowersPage";
import NotFoundPage from "../NotFoundPage";

/**
 * Set the routes of the web app
 * @returns {*}
 * @constructor
 */
const App = () => (
    <Router>
        <Switch>
            <Route exact path="/login" component={LoginPage}/>
            <PrivateRoute exact path="/" component={FollowersPage}/>
            <Route path="" component={NotFoundPage}/>
        </Switch>
    </Router>
);

export default App;
