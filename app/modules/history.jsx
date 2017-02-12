import React from 'react'
import ReactDOM from 'react-dom'
import d3 from 'd3'

import Services from './services'
import Piechart from './piechart/piechart.jsx'

class History extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            exists: null,
            foursquareId: '',
            token: '',
            categories: {},
            checkins: {
                count: 0,
                items: []
            }
        };
        this.handleClick = this.handleClick.bind(this); // we need this if we want to use THIS inside handleClick
    }
    handleClick() {
        this.synchronyzeCheckins();
    }

    getInfiniteData() {
        let itemCheckins = this.state.checkins.items || [],
            that = this,
            allCheckins = [];

        this.checkinsService.get('users/self/checkins','&offset='+this.offset+'&limit=250')
            .then(response => response.json())
            .then(json => {
                allCheckins = itemCheckins.concat(json.response.checkins.items);

                that.setState({
                    checkins: {
                        items: allCheckins,
                        count: json.response.checkins.count
                    }
                }, that.parseData);

                that.offset+=250;
                // console.log(allCheckins.length, json.response.checkins.count);

                if (that.offset > 300) {
                    // if (json.response.checkins.items.length === 0) {
                    clearInterval(that.state.intervalId);
                    return;
                }
            });
    }

    getLocalUserData() {
        this.checkinsService = new Services();

        this.checkinsService.getUserCheckins(this.state.foursquareId)
            .then(response => response.json())
            .then(checkinsJson => {
                console.log('USER DATA (LOCAL)');
                console.log(checkinsJson.data);
                console.log('-----------------------------------------');
                this.setState({
                    checkins: {
                        items: checkinsJson.data,
                        count: checkinsJson.data.length
                    }
                }, this.parseData);
            });
    }

    synchronyzeCheckins() {
        console.log(this.state.checkins.items);
        let allCheckins = this.state.checkins.items,
            newestCheckinLocal = allCheckins[0],
            that = this;

        this.checkinsService = new Services('https://api.foursquare.com/v2/', this.props.token);
        this.checkinsService.get('users/self/checkins','&offset=0&limit=250&afterTimestamp='+newestCheckinLocal.createdAt + 100)
            .then(response => response.json())
            .then(json => {
                let checkinList = json.response.checkins.items;
                if (checkinList.length > 0) {
                    // update with new checkins
                    allCheckins = json.response.checkins.items.concat(allCheckins);
                    this.checkinsService.update(that.state.foursquareId, allCheckins)
                        .then(() => {
                            that.setState({
                                checkins: allCheckins
                            }, that.parseData);
                        });
                }

            });
    }

    handlesDataOrigin() {
        let that = this;
        let intervalId;

        if (this.state.exists === false) {
            this.checkinsService = new Services('https://api.foursquare.com/v2/', this.props.token);
            this.offset = 0;
            // this.getInfiniteData();
            // this.offset +=250;
            intervalId = setInterval(function() {
                that.getInfiniteData();
            }, 1500);
            this.setState({intervalId: intervalId});
        } else {
            console.log('THIS USER EXIST!');
            this.getLocalUserData();
        }
    }

    parseMonth(d) {
        let monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
        return monthNames[d.getMonth()];
    }

    parseData() {
        if (this.state.checkins.items) {
            if (this.state.checkins.items.length > 0) {
                this.checkinsService.update(this.state.foursquareId, this.state.checkins.items);

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

    componentWillMount() {
        this.setState({
            token: this.props.token,
            foursquareId: this.props.foursquareId,
            checkins: {
                count: 0,
                items: []
            }
        });
    }

    componentWillReceiveProps(nextProps) {
        // console.log('>> componentWillReceiveProps', nextProps);
        this.setState({
            token: nextProps.token,
            foursquareId: nextProps.foursquareId,
            exists: nextProps.exists
        }, function() {
            if (this.props.exists !== null) {
                this.handlesDataOrigin();
            }
        });
    }

    render() {
        return(
            <div>
                {/* <p>Your last checkin was in {this.state.lastPlace} on {this.state.data}, {this.state.monthWord} {this.state.day} of {this.state.year}</p> */}
                <p>Last checkin was in {this.state.lastPlace} on {this.state.month} {this.state.day}, {this.state.year}</p>
                <p>First checkin was in {this.state.firstPlace} on {this.state.firstMonth} {this.state.firstDay}, {this.state.firstYear}</p>
                <svg width={800} height={400}>
                    <Piechart x={300} y={100} outerRadius={100} innerRadius={50}
                    data={[{value: 92-34, label: 'Code lines'}, {value: 34, label: 'Empty lines'}]}
                    categories={this.state.categories}/>
                </svg>
                <button onClick={this.handleClick}>Update checkins</button>
            </div>
        );
    }
}


export default History;
