import React from 'react'
import ReactDOM from 'react-dom'

import Services from './services'

class History extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            token: '',
            checkins: {
                count: 0,
                items: []
            }
        };
    }

    getInfiniteData() {
        let itemCheckins = this.state.checkins.items || [];
        this.checkinsService.get('users/self/checkins','&offset='+this.offset+'&limit=250')
            .then(response => response.json())
            .then(json => {
                let allCheckins = itemCheckins.concat(json.response.checkins.items);
                this.offset+=250;
                // if (allCheckins.length >= json.response.checkins.count || this.offset > 500) {
                if (json.response.checkins.items.length === 0) {
                    clearInterval(this.state.intervalId);
                    return;
                }
                console.log(allCheckins.length, json.response.checkins.count);
                this.setState({
                    checkins: {
                        items: allCheckins,
                        count: json.response.checkins.count
                    }
                }, this.parseData);
            });
    }

    getData() {
        this.checkinsService = new Services('https://api.foursquare.com/v2/', this.props.token);
        let that = this;
        this.offset = 0;
        let intervalId = setInterval(function() {
            that.getInfiniteData();
        }, 1500);
        this.setState({intervalId: intervalId});
    }

    componentWillMount() {
        this.setState({
            token: this.props.token,
            checkins: {
                count: 0,
                items: []
            }
        });
        this.getData();
    }

    parseMonth(d) {
        let monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
        return monthNames[d.getMonth()];
    }

    parseData() {
        if (this.state.checkins.items) {
            if (this.state.checkins.items.length > 0) {
                let lastCheckin = this.state.checkins.items[0];
                let firstCheckin = this.state.checkins.items[this.state.checkins.items.length - 1];
                let firstVenue = firstCheckin.venue;

                let lastVenue = lastCheckin.venue;
                let lastCheckinDate = new Date(0);
                let firstCheckinDate = new Date(0);
                lastCheckinDate.setUTCSeconds(lastCheckin.createdAt);
                firstCheckinDate.setUTCSeconds(firstCheckin.createdAt);

                this.setState({
                    lastPlace: lastVenue.name,
                    firstPlace: firstVenue.name,
                    date: lastCheckinDate,
                    day: lastCheckinDate.getDate(),
                    year: lastCheckinDate.getFullYear(),
                    month: this.parseMonth(lastCheckinDate),
                    firstDate: firstCheckinDate,
                    firstDay: firstCheckinDate.getDate(),
                    firstYear: firstCheckinDate.getFullYear(),
                    firstMonth: this.parseMonth(firstCheckinDate)
                });
            }
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
                <h1>Last checkin was in {this.state.lastPlace} on {this.state.month} {this.state.day}, {this.state.year}</h1>
                <h1>First checkin was in {this.state.firstPlace} on {this.state.firstMonth} {this.state.firstDay}, {this.state.firstYear}</h1>
            </div>
        );
    }
}


export default History;
