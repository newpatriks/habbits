import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, Link, IndexRoute, hashHistory, browserHistory } from 'react-router'

import Profile from './profile.jsx'
import Login from './login.jsx'

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
                <Route path='/' component={LoginComponent} />
                <Route path='/callback/:id' component={Callback} />
            </Router>
        );
    }
};

const LoginComponent = (props) => <div className="home--container">
    <h1>Habits</h1>
    <h2 className="subtitle">Lorem ipsum dolor sit amet, volutpat lorem eget vivamus luctus fusce justo. Nulla maecenas dictum rutrum. Tincidunt ad eget magni ipsum morbi, id ante vulputate elit mauris tortor nulla, ultricies tellus habitasse sit pede amet eget</h2>
    <Login />
</div>

const Callback = (props) => <div>
    <Profile token={props.params.id} />
</div>

const NotFound = () => (
  <h1>404.. This page is not found!</h1>
)

export default App
