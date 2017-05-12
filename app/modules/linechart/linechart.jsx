import React from 'react'
import ReactDOM from 'react-dom'
import * as d3 from 'd3'

import Services from '../services'
// console.log(d3);

class LineChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            width: this.props.width,
            foursquareId: this.props.foursquareId,
            yearList: [],
            timeline: []
        }
    }

    compare(a,b) {
        if (new Date(a.date) < new Date(b.date))
            return -1;
        if (new Date(a.date) > new Date(b.date))
            return 1;

        return 0;
    }

    parseSimpleHistoryData(data) {
        let globalArr = [];
        let numYears = Object.keys(data);
        let newObj = {};

        for (let i in data) {
            let currentYearObject = data[i];
            let year = currentYearObject._id.year;
            let monthList = currentYearObject.months;
            for (let j = 0; j < monthList.length; j++) {
                let currentMonthObj = monthList[j];
                newObj = {};
                newObj.date = new Date(year, currentMonthObj.month-1, 1);
                newObj.value = currentMonthObj.count;
                globalArr.push(newObj);
            }
        }

        globalArr = globalArr.sort(this.compare);

        this.setState({
            timeline: globalArr
        });
    }

    buildHistoryLineChart() {
        var that = this;
        this.service = new Services();
        this.service.getHistory(this.state.foursquareId)
            .then(response => response.json())
            .then(history => {
                that.parseSimpleHistoryData(history.data);
            });
    }

    componentWillReceiveProps(nextProps) {
        let that = this;
        this.setState({
            width: nextProps.width,
            data: nextProps.data,
            foursquareId: nextProps.foursquareId,
            firstCheckinVenue: nextProps.firstCheckinVenue,
            lastCheckinVenue: nextProps.lastCheckinVenue
        }, function() {
            if (nextProps.foursquareId) {
                that.buildHistoryLineChart();
            }
        });
    }

    render() {
        let data = this.state.timeline;
        // console.log(data);

        let yearList = [];

        let margin = {top: 5, right: 50, bottom: 20, left: 50},
            w = this.state.width - (margin.left + margin.right),
            h = this.props.height - (margin.top + margin.bottom);

        let parseDate = d3.timeParse("%d/%m/%Y");

        for (let i = 0; i < data.length; i++) {
            let currentDate = data[i].date;
            // console.log(data[i]);
            let year = currentDate.getFullYear();
            if (yearList.indexOf(year) === -1) {
                yearList.push(year);
            }
        }

        let x = d3.scaleTime()
            .domain(d3.extent(data, function(d) { return d.date; }))
            .range([0, w]);

        let y = d3.scaleLinear()
            .domain([0, d3.max(data, function(d) { return d.value; })])
            .range([h, 0]);

        let line = d3.line()
            .x(function(d) { return x(d.date); })
            .y(function(d) { return y(d.value); })
            .curve(d3.curveCatmullRom.alpha(0.5));

        let transform = 'translate(' + margin.left + ',' + margin.top + ')';

        // GENERATE VERTICAL LINES FOR EACH YEAR ------
        let miniComponents;
        if (yearList.length > 0) {
            miniComponents = yearList.map(function(itemData) {
                let date = parseDate('1/1/'+itemData);
                let linePoints = [{'date': date, 'value': 0}, {'date': date, 'value': h}];
                return <path className="line--vertical" key={itemData} className="line shadow" d={line(linePoints)} strokeLinecap="round"/>
            });
        }
        // -------------------------------

        // LOGIC TO DRAW THE INIT/END DOTS ----------------
        let startPoint = {x: -500, y: -500};
        let endPoint = {x: -500, y: -500};

        if (data.length > 0) {
            startPoint = {txt: this.state.firstCheckinVenue, x: x(data[0].date), y: y(data[0].value)};
            endPoint = {txt: this.state.lastCheckinVenue, x: x(data[data.length-1].date), y: y(data[data.length-1].value)};
        }
        // console.log('-------------------------------');
        // console.log('startPoint >> ', startPoint);
        // console.log('endPoint >> ', endPoint);
        // console.log('-------------------------------');
        // -------------------------------

        return (
            <div>
                <svg id={this.props.chartId} width={this.state.width} height={this.props.height}>
                    <g transform={transform}>
                        <g className="text-labels">
                            <text x={startPoint.x - 5} y={startPoint.y + 20}>{startPoint.txt}</text>
                            <text x={endPoint.x + 5} y={endPoint.y - 10}>{endPoint.txt}</text>
                        </g>
                        <g className="vertical-lines--container">{miniComponents}</g>
                        <path className="line shadow" d={line(data)} strokeLinecap="round"/>
                        <g className="sneak">
                            <circle className="sneak--start" cx={startPoint.x} cy={startPoint.y} r="5" />
                            <circle className="sneak--end" cx={endPoint.x} cy={endPoint.y} r="5" />
                        </g>
                    </g>
                </svg>
            </div>
        );
    }
};

LineChart.defaultProps = {
    width: 800,
    height: 200,
    chartId: 'histogram'
};

export default LineChart;
