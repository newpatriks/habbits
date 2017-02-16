import React from 'react'
import ReactDOM from 'react-dom'

class Picture extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div className="profile--picture">
                <img className="picture--img" src={this.props.image} />
            </div>
        );
    }
}


export default Picture;
