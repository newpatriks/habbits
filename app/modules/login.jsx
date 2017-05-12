import React from 'react';
import ReactDOM from 'react-dom';

class Login extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return(
            <div className="login-container">
                <a className="btn btn-block btn-social btn-lg btn-foursquare" href="http://localhost:9000/api/login">
                {/* <a className="btn btn-block btn-social btn-lg btn-foursquare" href="https://fsq-habits.herokuapp.com/api/login"> */}
                    <span className="fa fa-foursquare"></span> Sign in with Foursquare
                </a>
            </div>
        );
    }
}

export default Login;
