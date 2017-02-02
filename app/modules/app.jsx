import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, Link, IndexRoute, hashHistory, browserHistory } from 'react-router'

import Profile from './profile.jsx'

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
    }
    render() {
        return(
            <Router history={hashHistory}>
                <Route path='/' component={Login} />
                <Route path='/callback/:id' component={Callback} />
            </Router>
        );
    }
};

const Login = (props) => <div>
    <a href="http://localhost:9000/api/login/">Login</a>
</div>

const Callback = (props) => <div>
    <Profile token={props.params.id} />
</div>

const NotFound = () => (
  <h1>404.. This page is not found!</h1>
)

export default App
