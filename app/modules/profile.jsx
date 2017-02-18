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
            friends: 0,
            tips: 0,
            checkins: 0,
            userBio: {},
            profileImg: '',
            exists: false
        };
        this.handleClick = this.handleClick.bind(this); // we need this if we want to use THIS inside handleClick
    }

    handleClick() {
        this.synchronyzeCheckins();
    }

    handleClick() {
        let that = this;
        let selfService = new Services('https://api.foursquare.com/v2/', this.props.token);
        selfService.get('users/self')
            .then(response => response.json())
            .then(json => {
                console.log('1');
                console.log(json.response.user.checkins.count);
                console.log(that.state.userBio.checkins.count);
                if (json.response.user.checkins.count > that.state.userBio.checkins.count) {
                    that.updateStateWithRemoteData(json.response, true);
                }
            });
    }

    updateStateWithRemoteData(data, exists) {
        let timeSince = this.getAge(new Date(data.user.createdAt*1000));
        this.setState({
            foursquareId: data.user.id,
            exists: exists,
            checkins: {count: data.user.checkins.count},
            friends: {count: data.user.friends.count},
            tips: {count: data.user.tips.count},
            userBio: data.user,
            profileImg: data.user.photo.prefix + 'width300' + data.user.photo.suffix,
            yearsFrom: timeSince[0],
            monthsFrom: timeSince[1],
            daysFrom: timeSince[2]
        });
    }

    updateStateWithLocalData(data, userId) {
        let timeSince = this.getAge(new Date(parseInt(data.createdAt)*1000));
        console.log(data);
        this.setState({
            foursquareId: userId,
            exists: true,
            checkins: {count: data.checkins.count},
            friends: {count: data.friends.count},
            tips: {count: data.tips},
            userBio: data,
            profileImg: data.picture,
            yearsFrom: timeSince[0],
            monthsFrom: timeSince[1],
            daysFrom: timeSince[2]
        });
    }


    updateData() {
        let that = this;
        let selfService = new Services('https://api.foursquare.com/v2/', this.props.token);

        selfService.get('users/self')
            .then(response => response.json())
            .then(json => {
                selfService.checkUser(json.response.user.id)
                    .then(res => res.json())
                    .then(localResponse => {
                        if (!localResponse.data) {
                            selfService.createUser(json.response.user);
                            that.updateStateWithRemoteData(json.response, false);
                        } else if (typeof(localResponse.data) === 'object') {
                            that.updateStateWithLocalData(localResponse.data, json.response.user.id);
                        }
                    });
            });
    }

    componentWillMount() {
        // get the data?
        this.setState({
            token: this.props.token
        }, this.updateData);
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

        return age;
    }

    render() {
        return(
            <div className="profile container">
                <div className="row">
                    <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                        <ProfileInfo data={this.state.userBio} />
                    </div>
                    <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6 text-align--right">
                        <button className="profile--update-btn" onClick={this.handleClick}>Update checkins</button>
                    </div>
                </div>
                <div className="fullSeparator"></div>
                <div className="row">
                    <div className="profile--info col-xs-12 col-sm-3 col-md-3 col-lg-3">
                        <Picture image={this.state.profileImg} />
                    </div>
                    <div className="col-xs-12 col-sm-9 col-md-9 col-lg-9">
                        <div className="row">
                            <div className="profile--stattistics col-xs-4 col-sm-4 col-md-4 col-lg-4 border--right">
                                <StattisticsSimple number={this.state.checkins.count} label='Checkins' />
                            </div>
                            <div className="profile--stattistics col-xs-4 col-sm-4 col-md-4 col-lg-4 border--right">
                                <StattisticsSimple number={this.state.friends.count} label='Friends' />
                            </div>
                            <div className="profile--stattistics col-xs-4 col-sm-4 col-md-4 col-lg-4">
                                <StattisticsSimple number={this.state.tips.count} label='Tips' />
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
                <div className="fullSeparator"></div>
                <History token={this.state.token} foursquareId={this.state.foursquareId} checkinsNum={this.state.checkins.count} exists={this.state.exists}/>
            </div>
        );
    }
}


export default Profile;
