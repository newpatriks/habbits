import React from 'react'
import ReactDOM from 'react-dom'

import Services from './services'
import Picture from './picture.jsx'
import ProfileInfo from './profile-info.jsx'
import History from './history.jsx'
import StattisticsSimple from './stattistics.jsx'

class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            token: '',
            userBio: {
                friends: {
                    count: 0
                },
                checkins: {
                    count: 0
                },
                tips: ''
            },
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
                                profileImg: json.response.user.photo.prefix + 'width300' + json.response.user.photo.suffix,
                                yearsFrom: that.getNumYears(json.response.user.createdAt),
                                monthsFrom: that.getNumMonths(json.response.user.createdAt),
                                daysFrom: that.getNumDays(json.response.user.createdAt)
                            });
                        } else if (typeof(checkUsrResponse.data) === 'object') {
                            console.log(parseInt(checkUsrResponse.data.createdAt));
                            console.log(new Date(parseInt(checkUsrResponse.data.createdAt)*1000));
                            let timeSince = that.getAge(new Date(parseInt(checkUsrResponse.data.createdAt)*1000));
                            this.setState({
                                foursquareId: json.response.user.id,
                                exists: true,
                                userBio: checkUsrResponse.data,
                                profileImg: checkUsrResponse.data.picture,
                                yearsFrom: timeSince[0],
                                monthsFrom: timeSince[1],
                                daysFrom: timeSince[2]
                            }, function() {
                                console.log(this.state);
                            });
                        }

                    });
            });
    }

    getAge(fromdate, todate) {
        if (todate) {
            todate = new Date(todate);
        } else {
            todate= new Date();
        }

        let age = [],
            // fromdate = new Date(fromdate),
            y = [todate.getFullYear(), fromdate.getFullYear()],
            ydiff = y[0]-y[1],
            m = [todate.getMonth(), fromdate.getMonth()],
            mdiff = m[0]-m[1],
            d = [todate.getDate(), fromdate.getDate()],
            ddiff = d[0]-d[1];

        if (mdiff < 0 || (mdiff === 0 && ddiff < 0)) --ydiff;
        if (mdiff < 0) mdiff += 12;
        if (ddiff < 0){
            fromdate.setMonth(m[1]+1, 0);
            ddiff= fromdate.getDate()-d[1]+d[0];
            --mdiff;
        }
        if (ydiff> 0) age.push(ydiff);
        if (mdiff> 0) age.push(mdiff);
        if (ddiff> 0) age.push(ddiff);

        console.log('age >> ', age);

        return age;
    }

    getNumYears(seconds) {
        return new Date(seconds).getFullYear();
    }
    getNumMonths(seconds) {
        return Math.floor((seconds % 31536000) / 2592000);
    }
    getNumDays(seconds) {
        return Math.floor(((seconds % 31536000) % 2592000) / 3600);
    }

    render() {
        return(
            <div className="profile container">
                <div className="row">
                    <ProfileInfo data={this.state.userBio} />
                </div>
                <div className="fullSeparator"></div>
                <div className="row">
                    <div className="profile--info col-xs-12 col-sm-3 col-md-3 col-lg-3">
                        <Picture image={this.state.profileImg} />
                    </div>
                    <div className="col-xs-12 col-sm-9 col-md-9 col-lg-9">
                        <div class="row">
                            <div className="profile--stattistics col-xs-4 col-sm-4 col-md-4 col-lg-4 border--right">
                                <StattisticsSimple number={this.state.userBio.checkins.count} label='Checkins' />
                            </div>
                            <div className="profile--stattistics col-xs-4 col-sm-4 col-md-4 col-lg-4 border--right">
                                <StattisticsSimple number={this.state.userBio.friends.count} label='Friends' />
                            </div>
                            <div className="profile--stattistics col-xs-4 col-sm-4 col-md-4 col-lg-4">
                                <StattisticsSimple number={this.state.userBio.tips} label='Tips' />
                            </div>
                        </div>
                        <div className="row row--padding--centered">
                            <div className="profile--stattistics col-xs-4 col-sm-4 col-md-4 col-lg-4">
                                <StattisticsSimple number={this.state.yearsFrom} label="years" />
                            </div>
                            <div className="profile--stattistics col-xs-4 col-sm-4 col-md-4 col-lg-4">
                                <StattisticsSimple number={this.state.monthsFrom} label="months" />
                            </div>
                            <div className="profile--stattistics col-xs-4 col-sm-4 col-md-4 col-lg-4">
                                <StattisticsSimple number={this.state.daysFrom} label="days" />
                            </div>
                        </div>
                    </div>
                </div>

                <History token={this.state.token} foursquareId={this.state.foursquareId} exists={this.state.exists}/>
            </div>
        );
    }
}


export default Profile;
