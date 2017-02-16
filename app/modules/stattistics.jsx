import React from 'react'
import ReactDOM from 'react-dom'

class Stattistics extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div className="stattistics--simple">
                <h2 className="stattistics--simple--number">{this.props.number}</h2>
                <label className="stattistics--simple--label">{this.props.label}</label>
            </div>
        );
    }
}


export default Stattistics;
