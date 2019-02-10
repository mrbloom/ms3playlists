import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import DayDate from './DayDate'
import Block from './Block'

class DayRow extends Component {

  render() {
    return (
      <Row>
        <Col sm={2}>
          {this.props.day}
          <DayDate value={this.props.date} editable={false} />
        </Col>
        <Col>
          {
            this.props.blocks.map((el, i) =>
              <Block key={el[0]} block_id={el[0]} start_time={el[1]} stop_time={el[2]} schedule={this.props.schedule} />
            )
          }


          <button
            onClick={() => {
              this.props.schedule.pushBlock(this.props.date);
              this.forceUpdate();
            }}
          >+</button>
          <button
            onClick={() => {
              this.props.schedule.popBlock(this.props.date);
              this.forceUpdate();
            }}
          >-</button>
        </Col>
      </Row>
    );
  }
}

export default DayRow;