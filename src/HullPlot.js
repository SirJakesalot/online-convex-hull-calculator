import React, { Component } from 'react';
import { Panel } from 'react-bootstrap';
import Plot from 'react-plotly.js';
import { jarvisMarch, grahamScan, getXs, getYs, pointsToStr } from './ConvexHullLib.js';

const strToAlg = {
    "graham": grahamScan,
    "jarvis": jarvisMarch
};

class HullPlot extends Component {

    render() {
        if (this.props.points && this.props.points.length > 0) {
            let algorithm = strToAlg[this.props.algorithm];
            const hullPts = algorithm(this.props.points);
            const hullPtsStr = pointsToStr(hullPts);
            const xs = getXs(hullPts);
            const ys = getYs(hullPts);

            return (
                <div>
                    <Panel bsStyle="success">
                        <Panel.Heading>
                            <Panel.Title componentClass="h3">Convex Hull Points</Panel.Title>
                        </Panel.Heading>
                        <Panel.Body>{hullPtsStr}</Panel.Body>
                    </Panel>
                    <Plot data={[
                        {
                            x: xs,
                            y: ys,
                            type: 'scatter',
                            mode: 'lines+points',
                            marker: {color: 'red'},
                        }
                    ]}
                          layout={ {title: 'Convex Hull Plot'} }
                    />
                </div>
            )
        }
        return <div></div>
    }
}

export default HullPlot;