import React from 'react'
import ReactDOM from 'react-dom'

class Picture extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div>
                <img src={this.props.image} />
            </div>
        );
    }
}


export default Picture;
