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

const k = [
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
      // <form>
      <Schedule />
      // </form>
    );
  }
}

export default App;
