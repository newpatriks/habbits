import React from 'react'
import ReactDOM from 'react-dom'

import Services from './services'

class History extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            token: '',
            checkins: {}
        };
    }
    componentWillMount() {
        this.setState({
            token: this.props.token
        });

        let checkinsService = new Services('https://api.foursquare.com/v2/', this.props.token);
        checkinsService.get('users/self/checkins')
            .then(response => response.json())
            .then(json => {
                // console.log(json.response.checkins);
                this.setState({
                    checkins: json.response.checkins
                }, this.parseData);
            });
    }

    parseMonth(d) {
        let monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
        return monthNames[d.getMonth()];
    }

    parseData() {
        console.log('parseData >> 1 ', this.state);
        if (this.state.checkins.items) {
            if (this.state.checkins.items.length > 0) {
                let checkin = this.state.checkins.items[0];
                let venue = checkin.venue;
                let checkinDate = new Date(0);
                checkinDate.setUTCSeconds(checkin.createdAt);

                this.setState({
                    lastPlace: venue.name,
                    date: checkinDate,
                    day: checkinDate.getDate(),
                    year: checkinDate.getFullYear(),
                    month: this.parseMonth(checkinDate)
                });
            }
            console.log('parseData >> 2 ', this.state);
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            token: nextProps.token
        });
    }

    render() {
        return(
            <div>
                {/* <h1>Your last checkin was in {this.state.lastPlace} on {this.state.data}, {this.state.monthWord} {this.state.day} of {this.state.year}</h1> */}
                <h1>Your last checkin was in {this.state.lastPlace} on {this.state.month} {this.state.day}, {this.state.year}</h1>
            </div>
        );
    }
}


export default History;
