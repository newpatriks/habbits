import React from 'react'
import ReactDOM from 'react-dom'
import * as d3 from 'd3'

console.log(d3);

class LineChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            width: this.props.width
        }
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

        return (
            <div>
                <svg id={this.props.chartId} width={this.state.width} height={this.props.height}>
                    <g transform={transform}>
                        <path className="line shadow" d={line(data)} strokeLinecap="round"/>
                    </g>
                </svg>
            </div>
        );
    }
};

LineChart.defaultProps = {
    width: 800,
    height: 250,
    chartId: 'histogram'
};

export default LineChart;
