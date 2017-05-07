import React from 'react'
import ReactDOM from 'react-dom'
import * as d3 from 'd3'

// console.log(d3);

class LineChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            width: this.props.width,
            yearList: []
        }
    }

    componentWillReceiveProps(nextProps) {
        let that = this;
        this.setState({
            width: nextProps.width,
            data: nextProps.data
        });
    }

    render() {
        let data = this.props.data;

        let margin = {top: 5, right: 50, bottom: 20, left: 50},
            w = this.state.width - (margin.left + margin.right),
            h = this.props.height - (margin.top + margin.bottom);

        let parseDate = d3.timeParse("%d/%m/%Y");

        data.forEach(function (d) {
            d.date = parseDate(d.date);
            d.value = parseInt(d.value);
        });

        let yearList = [];
        for (let i = 0; i < data.length; i++) {
            let currentDate = data[i].date;
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

        let transform='translate(' + margin.left + ',' + margin.top + ')';

        // GENERATE VERTICAL LINES ------
        let miniComponents;
        if (yearList.length > 0) {
            miniComponents = yearList.map(function(itemData) {
                let date = parseDate('1/1/'+itemData);
                let linePoints = [{'date': date, 'value': 0}, {'date': date, 'value': h}];
                return <path className="line--vertical" key={itemData} className="line shadow" d={line(linePoints)} strokeLinecap="round"/>
            });
        }
        // -------------------------------


        return (
            <div>
                <svg id={this.props.chartId} width={this.state.width} height={this.props.height}>
                    <g transform={transform}>
                        <g className="vertical-lines--container">{miniComponents}</g>
                        <path className="line shadow" d={line(data)} strokeLinecap="round"/>
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
