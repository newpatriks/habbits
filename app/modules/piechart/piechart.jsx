import React from 'react'
import ReactDOM from 'react-dom'
import * as d3 from 'd3'

import Arc from './arc.jsx';


class Piechart extends React.Component {
    constructor(props) {
        super(props);
        this.pie = d3.pie().value((d) => d.value);
        this.colors = d3.schemeCategory10;
    }

    arcGenerator(d, i) {
        return (
            <Arc key={`arc-${i}`}
                data={d}
                innerRadius={this.props.innerRadius}
                outerRadius={this.props.outerRadius}
                color={this.colors[i]} />
        );
    }

    render() {
        let categories = [],
            keys = Object.keys(this.props.categories),
            translate = 'translate(400, 150)',
            pie;

        for (let i = 0; i < keys.length; i++) {
            categories.push(this.props.categories[keys[i]]);
        }
        categories.sort(function(a, b) {
            return parseFloat(a.price) - parseFloat(b.price);
        });

        pie = this.pie(categories.slice(0,5));

        return (
            <g transform={translate}>
                {pie.map((d, i) => this.arcGenerator(d, i))}
            </g>
        )
    }
}

export default Piechart;
