import React from 'react';
import './App.css';
import {Outage,Dad} from './timeseries';
import {TimeEvent, TimeSeries, TimeRangeEvent, TimeRange } from "pondjs";
import ReactDOM from 'react-dom';

function clean(suite) {
    let prev_event = suite[0]
    let status = prev_event.state
    let interfaces = {}
    interfaces[prev_event.sapid] = prev_event.serviceImpact
    let events = []
    let event
    for (event of suite) {
        // console.log(event);
        if (suite.length === 1) {
            break;
        }
        if (event.timestamp === prev_event.timestamp) {
            interfaces[event.sapid] = event.serviceImpact
            status = event.state
            prev_event = event;
            continue;
        }
        
            // console.log(event.timestamp);
        else {
            
            // console.log(prev_event.timestamp);
            // console.log(event.timestamp);
        let new_event = new TimeRangeEvent(new TimeRange(new Date(1000 * prev_event.timestamp), new Date(1000 * event.timestamp)),
               {status: status, interfaces: interfaces, startTime:prev_event.timestamp, endTime: event.timestamp});
           interfaces[event.sapid] = event.serviceImpact
           events.push(new_event);
           status = event.state;
           prev_event = event;
        }
    }
        let curr_time = new Date()
        let new_event = new TimeRangeEvent(new TimeRange(new Date(1000 * prev_event.timestamp), curr_time), 
                {status:status, interfaces:interfaces, startTime:prev_event.timestamp, endTime: curr_time});
        events.push(new_event);
    return new TimeSeries({ name: "chunks", events: events });
}



function clean_service (suite) {
    let events = []
    let prev_event = suite[0];
    let event;
    for (event of suite) {
        if (event != prev_event) {
            let new_event = new TimeRangeEvent(new TimeRange(new Date(prev_event.timestamp * 1000), new Date(event.timestamp * 1000)), 
            {status:prev_event.conclusion, interfaces:prev_event.conclusion, startTime:prev_event.timestamp, endTime: event.timestamp});
            events.push(new_event);
            console.log(prev_event.timestamp, event.timestamp)
            prev_event = event;
        }
    }
    let curr_time = new Date((prev_event.timestamp + 30) * 1000)
    let new_event = new TimeRangeEvent(new TimeRange(new Date(1000 * prev_event.timestamp), curr_time), {status:prev_event.conclusion, interfaces:prev_event.conclusion, startTime:prev_event.timestamp, endTime: curr_time});
    events.push(new_event);
    return new TimeSeries({ name: "services", events: events });
}

function App() {

    let d = require("./device_notifications.json");



    const es = d["deviceNotificationHistory"];

    const suite1 = es.filter(event => event.source === "Edge 1");
    const suite2 = es.filter(event => event.source === "Edge 2");
    const suite3 = es.filter(event => event.source === "Border");
    const suite4 = es.filter(event => event.source === "Border and Control Plane");

    const series1 = clean(suite1);
    const series2 = clean(suite2);
    const series3 = clean(suite3);
    const series4 = clean(suite4);
    
    let s = require("./service.json");
    const sn = s["serviceNotifications"];

    const service_series = clean_service(sn);

    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.js</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
    // </div>

    return (
        <Dad
        service_series={service_series}
        series1={series1}
        series2={series2}
        series3={series3}
        series4={series4}>
        </Dad>
        );
}

export default App;
