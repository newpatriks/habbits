import React from 'react'
import ReactDOM from 'react-dom'

import Services from './services'
import Picture from './picture.jsx'
import ProfileInfo from './profile-info.jsx'
import History from './history.jsx'

class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            token: '',
            userBio: {},
            profileImg: '',
            exists: null
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
                selfService.checkUser(json.response.user.id)
                    .then(res => res.json())
                    .then(checkUsrResponse => {
                        // console.log('RESPONSE >> ', checkUsrResponse.data);
                        if (!checkUsrResponse.data) {
                            selfService.createUser(json.response.user);
                            this.setState({
                                exists: false,
                                foursquareId: json.response.user.id,
                                userBio: json.response.user,
                                profileImg: json.response.user.photo.prefix + 'width300' + json.response.user.photo.suffix
                            });
                        } else if (typeof(checkUsrResponse.data) === 'object') {
                            this.setState({
                                foursquareId: json.response.user.id,
                                exists: true,
                                userBio: checkUsrResponse.data,
                                profileImg: checkUsrResponse.picture
                            });
                        }
                    });
            });
    }

    render() {
        return(
            <div>
                <ProfileInfo data={this.state.userBio} />
                <Picture image={this.state.profileImg}/>
                <History token={this.state.token} foursquareId={this.state.foursquareId} exists={this.state.exists}/>
            </div>
        );
    }
}


export default Profile;
