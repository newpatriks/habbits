import React from 'react';
import ReactDOM from 'react-dom';

class MyLogin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick() {
        console.log('>> handle click!');
    }
    render() {
        return(
            <div>
                <button type="button" onClick={this.handleClick}>Login</button>
            </div>
        );
    }
}

export default MyLogin;
