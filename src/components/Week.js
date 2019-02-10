import React, { Component } from 'react';
import DayRow from './DayRow'
import { Container, Row, Col } from 'react-bootstrap';

class Week extends Component {
  render() {
    const dates = this.props.schedule.dates;

    console.log(dates)
    return (
      <Row>
        {this.props.schedule.days.map((day, i) =>
          <DayRow
            key={dates[i]}
            day={day}
            date={dates[i]}
            blocks={this.props.schedule.getBlocks(dates[i])}
            schedule={this.props.schedule}
          />)}
      </Row>
    );
  }
}

export default Week;