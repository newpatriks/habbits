import React from 'react'
import ReactDOM from 'react-dom'

import Services from './services'
import Picture from './picture.jsx'
import ProfileInfo from './profile-info.jsx'

class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            token: '',
            userBio: {},
            profileImg: ''
        };
    }

    componentWillMount() {
        // get the data?
        var that = this;
        this.setState({
            token: this.props.token
        });

        let selfService = new Services('https://api.foursquare.com/v2/', this.props.token);
        selfService.get('users/self')
            .then(response => response.json())
            .then(json => {
                // console.log(json.response.user);
                selfService.createUser(json.response.user);
                this.setState({
                    userBio: json.response.user,
                    profileImg: json.response.user.photo.prefix + 'width300' + json.response.user.photo.suffix
                });
            });
    }

    render() {
        return(
            <div>
                <ProfileInfo data={this.state.userBio} />
                <Picture image={this.state.profileImg}/>
            </div>
        );
    }
}


export default Profile;
