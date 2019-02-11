import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { 
  DaySchedule, 
  Series, 
  Schedule, 
  Sery, 
  Block 
} from "./components/Content"

import {
  schedule,
  dateToString,
  init_schedule,
  get_week_dates,
  dateToBlockid, 
  SeriesStore, 
  DayScheduleStore,
  Week,
  types,
  series_names,
} from './stores/ScheduleStore'

function zip() {
  var args = [].slice.call(arguments);
  var shortest = args.length == 0 ? [] : args.reduce(function (a, b) {
    return a.length < b.length ? a : b
  });

  return shortest.map(function (_, i) {
    return args.map(function (array) { return array[i] })
  });
}

const today_week_dates = (new Week()).dates;

const k=[
  ["2019-01-01",
      [
          ["01010001", "07:00", "11:00",
              [
                  ["Помста1", 1, 1, "Розваж."],
                  ["Помста2", 2, 5, "Розваж."],
              ]
          ]
      ]
  ],
]

class App extends Component {
  constructor(props) {
    super(props);
    const today = new Date();
    this.state = {
      date: dateToString(today),
      schedule: schedule,
      week_dates: get_week_dates(today)
    };
  }

  changeWeekDate = (e) => {
    const new_date = e.target.value;
    init_schedule(new_date);

    this.setState({
      schedule: schedule,
      date: new_date
    });
  }

  render() {
    return (

      <Container>
        <Schedule />
        <Sery sery="Помста1" types={types} first={1} last={2} series_names={series_names} type="УКР." />

        <Series series={[["Вечірка", 1, 12, "Розваж."], ["Вечірка", 11, 13, "УКР."]]} />

        <Block block_id="08020001" start_time="22:00" stop_time="23:00" series={[["Помста2", 1, 12, "Розваж."], ["Помста3", 11, 13, "УКР."]]} />

        <DaySchedule date="2019-02-10" day="Неділя" blocks={
          [
            ["08020001","20:00","21:00",[["Помста1", 1, 12, "Розваж."], ["Помста3", 11, 13, "УКР."]]],
            ["08020002","22:00","23:00",[["Помста2", 5, 12, "Розваж."], ["Помста3", 11, 13, "УКР."]]],
            ["08020003","23:00","03:00",[["Помста3", 7, 12, "Розваж."], ["Помста3", 11, 13, "УКР."]]],
          ]
        } />


{/* 
        <Schedule day_schedules={
          [
            ["2019-08-02",
              [
                ["08020001","20:00","21:00",[["Помста1", 1, 12, "Розваж."], ["Помста3", 11, 13, "УКР."]]],
                ["08020002","22:00","23:00",[["Помста2", 5, 12, "Розваж."], ["Помста3", 11, 13, "УКР."]]],
                ["08020003","23:00","03:00",[["Помста3", 7, 12, "Розваж."], ["Помста3", 11, 13, "УКР."]]],
              ]
            ],
            ["2019-08-03",
              [
                ["08030001","20:00","21:00",[["Помста1", 1, 12, "Розваж."], ["Помста3", 11, 13, "УКР."]]],
                ["08030002","22:00","23:00",[["Помста2", 5, 12, "Розваж."], ["Помста3", 11, 13, "УКР."]]],
                ["08030003","23:00","03:00",[["Помста3", 7, 12, "Розваж."], ["Помста3", 11, 13, "УКР."]]],
              ]
            ]
          ] 
        } />*/}
      </Container >
    );
  }
}

export default App;
