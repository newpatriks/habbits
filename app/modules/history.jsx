import React from 'react'
import ReactDOM from 'react-dom'
import d3 from 'd3'

import Services from './services'
import Piechart from './piechart/piechart.jsx'

class History extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            token: '',
            categories: {},
            checkins: {
                count: 0,
                items: []
            }
        };
    }

    getInfiniteData() {
        let itemCheckins = this.state.checkins.items || [],
            allCheckins;

        this.checkinsService.get('users/self/checkins','&offset='+this.offset+'&limit=250')
            .then(response => response.json())
            .then(json => {
                allCheckins = itemCheckins.concat(json.response.checkins.items);
                this.setState({
                    checkins: {
                        items: allCheckins,
                        count: json.response.checkins.count
                    }
                }, this.parseData);

                this.offset+=250;
                console.log(allCheckins.length, json.response.checkins.count);

                if (this.offset > 300) {
                    // if (json.response.checkins.items.length === 0) {
                    clearInterval(this.state.intervalId);
                    return;
                }
            });
    }

    getData() {
        let that = this;
        let intervalId;

        this.checkinsService = new Services('https://api.foursquare.com/v2/', this.props.token);
        this.offset = 0;
        // this.getInfiniteData();
        // this.offset +=250;
        intervalId = setInterval(function() {
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
            console.log(this.state.checkins);
            if (this.state.checkins.items.length > 0) {
                // this.checkinsService.update(this.userId, {checkins: this.state.checkins});

                let lastCheckin = this.state.checkins.items[0];
                let firstCheckin = this.state.checkins.items[this.state.checkins.items.length - 1];
                let firstVenue = firstCheckin.venue;

                let lastVenue = lastCheckin.venue;
                let lastCheckinDate = new Date(0);
                let firstCheckinDate = new Date(0);
                lastCheckinDate.setUTCSeconds(lastCheckin.createdAt);
                firstCheckinDate.setUTCSeconds(firstCheckin.createdAt);

                let myCategories = this.state.categories;
                this.state.checkins.items.forEach(function(checkin) {
                    if (checkin.venue && checkin.venue.categories && checkin.venue.categories.length > 0) {
                        let checkinCategories = checkin.venue.categories;
                        checkinCategories.forEach(function(category) {
                            if (!myCategories[category.id]) {
                                myCategories[category.id] = {
                                    value: 1,
                                    label: category.name
                                };
                            } else {
                                myCategories[category.id].value += 1;
                            }
                        });
                    }
                });

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
                    firstMonth: this.parseMonth(firstCheckinDate),
                    categories: myCategories
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
                <svg width={800} height={400}>
                    <Piechart x={300} y={100} outerRadius={100} innerRadius={50}
                    data={[{value: 92-34, label: 'Code lines'}, {value: 34, label: 'Empty lines'}]}
                    categories={this.state.categories}/>
                </svg>

            </div>
        );
    }
}


export default History;
