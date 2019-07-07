import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom'
import Main from './main'
import Login from './login'
import Register from './register'
import NotFound from './notfound'

import { Store } from './interface/index'

ReactDOM.render(
    <Provider store={Store}>
        <Router>
            <Switch>
                <Route exact path="/" component={Main} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/register" component={Register} />
                <Route component={NotFound} />
            </Switch>
        </Router>
    </Provider>,
    document.getElementById('main')
)
