import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { DaySchedule, Series, Schedule, Sery, Block } from "./components/Content"

import {
  schedule,
  dateToString,
  init_schedule,
  dateToBlockid, SeriesStore, DayScheduleStore,
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

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: dateToString(new Date()),
      schedule: schedule,
      // dates: today_week_dates,
      // seriesStores: today_week_dates.map(date => new SeriesStore({ date })),
    };
    // 
    // this.state = {
    //   schedule: schedule
    // }
    // const s = new ScheduleStore();
  }

  changeWeekDate = (e) => {
    const new_date = e.target.value;
    init_schedule(new_date);

    this.setState({
      schedule: schedule,
      date: new_date
    });
    console.log(schedule);
    // alert(e.target.value);
    // schedule.changeDate(new Date(new_date));
    // this.setState({ schedule: schedule });
  }

  render() {
    // const seore = new SeriesStore({ series: [["Вечірка", 1, 1, "Розваж."], ["Вечірка", 1, 3, "УКР."]] });
    // const def_srs = [
    //   new SeriesStore({ series: [["Вечірка", 1, 1, "Розваж."], ["Вечірка", 1, 3, "УКР."]] }),
    //   new SeriesStore({ series: [["Вечірка", 1, 1, "Розваж."], ["Вечірка", 1, 3, "УКР."]] })
    // ];
    // const sc = new DayScheduleStore();
    return (

      <Container>
        <Sery sery="Помста1" types={types} first={1} last={2} series_names={series_names} type="УКР." />

        <Series series={[["Вечірка", 1, 12, "Розваж."], ["Вечірка", 11, 13, "УКР."]]} />

        <Block block_id="08020001" start_time="22:00" stop_time="23:00" series={[["Помста2", 1, 12, "Розваж."], ["Помста3", 11, 13, "УКР."]]} />

        <DaySchedule />
        {/* <Row>
          <input
            type="date"
            value={this.state.date}
            onChange={this.changeWeekDate}
          />
        </Row>

        <Schedule key={this.state.date} schedule={this.state.schedule} /> */}
        {/* <Series series={[["Вечірка", 1, 1, "Розваж."], ["Вечірка", 1, 3, "УКР."]]} start_time="08:00" /> */}
        {/* {this.state.seriesStores.map(seriesStore => <DaySchedule date={seriesStore.date} />)} */}
        {/* <Series /> */}
        {/* <Series series={{ series: [["Вечірка", 1, 1, "Розваж."], ["Вечірка", 1, 3, "УКР."]] }} /> */}
        {/* <Series series={def_srs} /> */}

        {/* <Series /> */}

        {/* <Content block_id="01010001" /> */}
        {/* <Row>
          <Col>
            <DayDate
              value={schedule.monday_date}
              editable={true}
              onChange={this.changeWeekDate}
            />
          </Col>
        </Row>

        {schedule.days.map((day, i) =>
          <Row>
            <Col>
              <label>{day}<input type="date" value={schedule.dates[i]} readOnly /></label>
            </Col>
            <Block block_id={dateToBlockid(schedule.dates[i])} start_time="07:00" stop_time="11:00" schedule={schedule} />

          </Row>
        )} */}
      </Container >
    );
  }
}

export default App;
