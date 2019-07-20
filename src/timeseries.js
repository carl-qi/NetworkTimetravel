/**
 *  Copyright (c) 2016, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

/* eslint max-len:0 */

import React from "react/";

import {TimeEvent, TimeSeries, TimeRangeEvent, TimeRange } from "pondjs";

import {ChartContainer, ChartRow, Charts, EventChart, Resizable} from "react-timeseries-charts";

import {
    Button,
    Container,
    Grid,
    Header,
    Icon,
    Image,
    Item,
    Label,
    Menu,
    Segment,
    Step,
    Table,
  } from 'semantic-ui-react'
  
  const style = {
    h1: {
      marginTop: '3em',
    },
    h2: {
      margin: '4em 0em 2em',
    },
    h3: {
      marginTop: '2em',
      padding: '2em 0em',
    },
    last: {
      marginBottom: '300px',
    },
  }


function outageEventStyleFunc(event, state) {
    const  color = (event.get("status") === "up" || event.get("status").slice(-2) === "UP") ? "#998ec3" : event.get("rootCause") === "analyzing" ? "#6DA752": "#f1a340";
    switch (state) {
        case "normal":
            return {
                fill: color
            };
        case "hover":
            return {
                fill: color,
                opacity: 0.4
            };
        case "selected":
            return {
                fill: color
            };
        default:
        //pass
    }
}



class Dad extends React.Component{

    state = {timerange:null};


    callback = (timerange) => {
        // const tr = this.state.timerange;
        // console.log(tr===timerange);
        this.setState({timerange});
        // console.log(timerange);
    }

    componentDidMount = () => {
        const series = this.props.series1;
        this.setState({timerange:series.timerange()});
    }

    render() {
        const {service_series, series1, series2, series3, series4} = this.props;

        return (
            <div>
            <Outage 
            timerange={this.state.timerange}
            series={service_series}
            name={"Service"}
            callbackFromParent={this.callback}
            ></Outage>

            <Outage 
            timerange={this.state.timerange}
            series={series1}
            name={"Edge 1"}
            callbackFromParent={this.callback}
            ></Outage>

            <Outage 
            timerange={this.state.timerange}
            series={series2}
            name={"Edge 2"}
            callbackFromParent={this.callback}
            ></Outage>

            <Outage 
            timerange={this.state.timerange}
            series={series3}
            name={"Border"}
            callbackFromParent={this.callback}
            ></Outage>

            <Outage 
            timerange={this.state.timerange}
            series={series4}
            name={"Border and Control Plane"}
            callbackFromParent={this.callback}
            ></Outage>
            {/* <Outage timerange=this.state.timerange></Outage> */}
            </div>
        );
    }
}


class Outage extends React.Component{
    // const getInitialState = () => {
    //     return {
    //         tracker: null,
    //         timerange: series.timerange()};
    // }
    // state = {timerange:null};
    

    handleTimeRangeChange = (timerange) => {
        this.props.callbackFromParent(timerange);
    }

    // componentDidMount = () => {
    //     const {series} = this.props;
    //     this.props.callbackFromParent(series.timerange());
    // }
    
    render() {
        const {series} = this.props;
        const {timerange} = this.props;
        const {name} = this.props;
        // let timerange = series.timerange();

        return(
            <React.Fragment>



          <Grid>
           <Grid.Row>
             <Grid.Column floated='left' width={9}>
                 <h2>{name}</h2>
             </Grid.Column>
             <Grid.Column floated='right' width={7}>
             <div className="row">
                        <div className="col-md-12">
                            <Resizable>
                                <ChartContainer
                                    timeRange={timerange}
                                    enablePanZoom={true}
                                    onTimeRangeChanged={this.handleTimeRangeChange}
                                >
                                    <ChartRow height="40">
                                        <Charts>
                                            <EventChart
                                                series={series}
                                                size={45}
                                                style={outageEventStyleFunc}
                                                label={e => JSON.stringify(e.get("interfaces"))}></EventChart>
                                        </Charts>
                                    </ChartRow>
                                </ChartContainer>
                            </Resizable>
                        </div>
                    </div>   
             </Grid.Column>
           </Grid.Row>
         </Grid>
            {/* <Header as='h3' content = "hello" style={style.h3} textAlign='center' />
            <Grid container columns={2} stackable>
            <Grid.Column>
                <h3>{this.props.name}</h3>
            </Grid.Column>
            <Grid.Column>
                    <div className="row">
                        <div className="col-md-12">
                            <Resizable>
                                <ChartContainer
                                    timeRange={timerange}
                                    enablePanZoom={true}
                                    onTimeRangeChanged={this.handleTimeRangeChange}
                                >
                                    <ChartRow height="40">
                                        <Charts>
                                            <EventChart
                                                series={series}
                                                size={45}
                                                style={outageEventStyleFunc}
                                                label={e => JSON.stringify(e.get("interfaces"))}></EventChart>
                                        </Charts>
                                    </ChartRow>
                                </ChartContainer>
                            </Resizable>
                        </div>
                    </div>        
            </Grid.Column>
            </Grid> */}
      </React.Fragment>



            
            
        );
    }
}


export {Outage, Dad};
