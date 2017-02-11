import React from 'react'
import ReactDOM from 'react-dom'

class ProfileInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            profile: {
                firstName: '',
                checkins: {
                    count: 0
                }
            }
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.data) {
            this.setState({
                profile: nextProps.data
            });
            // console.log('>> ', nextProps);
        }
    }

    render() {
        return(
            <div>
                <p>Hi {this.state.profile.firstName}! You have a total of {this.state.profile.checkins.count} checkins, cool! </p>
            </div>
        );
    }
}


export default ProfileInfo;
