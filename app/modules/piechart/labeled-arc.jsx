import Arc from './arc.jsx'

class LabeledArc extends Arc {
    render() {
        let [labelX, labelY] = this.arc.centroid(this.props.data),
            labelTranslate = 'translate(${labelX}, ${labelY})';

        return (
            <g>
                {super.render()}
                <text transform={labelTranslate}
                      textAnchor="middle">
                    {this.props.data.data.label}
                </text>
            </g>
        );
    }
}

export { LabeledArc };
