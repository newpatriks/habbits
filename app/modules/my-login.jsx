import React from 'react';
import ReactDOM from 'react-dom';

class MyLogin extends React.Component {
    constructor(props) {
        super(props);
        this.apiServ = new Services('http://localhost:9000/api');
        console.log('>> constructor!');
        this.state = {

        };

        this.handleClick = this.handleClick.bind(this);
    }
    handleClick() {
        console.log('>> handle click!');
        this.apiServ.login();

    }
    render() {
        return(
            <div>
                {/* <button type="button" onClick={this.handleClick}>Login</button> */}
                <a href="http://localhost:9000/api/login">Login</a>
            </div>
        );
    }
}

export default MyLogin;
