import React from 'react';
import ReactDOM from 'react-dom';
import {Route, Switch, BrowserRouter as Router} from 'react-router-dom';
import {Editor} from './editor';
import {Login} from './login';
import {Register} from './register';
import {NotFound} from './not-found';

// Make Bootstrap and some custom styling available to the entire front-end
import './shared/scss/main.scss';

function EraClient() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Editor} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
}

ReactDOM.render(<EraClient />, document.getElementById('main'));
