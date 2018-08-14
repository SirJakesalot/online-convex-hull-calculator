import React, { Component } from 'react';
import { FormGroup, ControlLabel, HelpBlock, FormControl, PageHeader, Grid, Row, Col } from 'react-bootstrap';
import { strToPts } from './ConvexHullLib.js';
import HullPlot from "./HullPlot";

function isValidPointStr(s) {
    // ensure the given string is capable of being converted to a set
    return /^\(-?\d+,-?\d+\)(,\(-?\d+,-?\d+\)){2,}$/.test(s);
}

class App extends Component {
    constructor(props, context) {
        super(props, context);
        this.handlePointsStringChange = this.handlePointsStringChange.bind(this);
        this.handleAlgorithmChange = this.handleAlgorithmChange.bind(this);
        this.state = {
            algorithm: 'graham',
            pointsString: '',
            points: []
        };
    }

    getPointsStringValidationState() {
        if (!this.state.pointsString.length) {
            return 'warning';
        }
        if (isValidPointStr(this.state.pointsString)) {
            return 'success';
        }
        return 'error';
    }

    handlePointsStringChange(e) {
        // update
        let points = [];
        if (isValidPointStr(e.target.value)) {
            // parse input to points
            points = strToPts(e.target.value);
        }

        this.setState({
            pointsString: e.target.value,
            points: points,
            algorithm: this.state.algorithm
        });
    }

    handleAlgorithmChange(e) {
        // update algorithm selection
        this.setState({
            pointsString: this.state.pointsString,
            points: this.state.points,
            algorithm: e.target.value
        });
    }

    render() {
        return (
            <div>
                <Grid>
                    <Row className="show-grid">
                        <Col xs={0} md={2}/>
                        <Col xs={12} md={8}>
                            <PageHeader>Online 2D Convex Hull Calculator</PageHeader>
                            <form>
                                <FormGroup controlId="formControlsSelect">
                                    <ControlLabel>Select algorithm to use</ControlLabel>
                                    <FormControl componentClass="select" placeholder="select" onChange={this.handleAlgorithmChange}>
                                        <option value="graham">Graham Scan - O(nlogn)</option>
                                        <option value="jarvis">Jarvis March - O(nh)</option>
                                    </FormControl>
                                </FormGroup>
                                <FormGroup
                                    controlId="formBasicText"
                                    validationState={this.getPointsStringValidationState()}
                                >
                                    <ControlLabel>Calculate convex hull of the given points</ControlLabel>
                                    <FormControl
                                        type="text"
                                        value={this.state.pointsString}
                                        placeholder="Enter point values e.g. (1,1),(4,4),(5,1)"
                                        onChange={this.handlePointsStringChange}
                                    />
                                    <FormControl.Feedback />
                                    <HelpBlock>Please enter the point list in the valid format (using parenthesis, commas, and integers)</HelpBlock>
                                </FormGroup>
                            </form>
                            <HullPlot points={this.state.points} algorithm={this.state.algorithm} />
                        </Col>
                        <Col xs={0} md={2}/>
                    </Row>
                </Grid>
            </div>
        );
    }
}

export default App;
