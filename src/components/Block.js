import moment from 'moment';
import { Container, Row, Col } from 'react-bootstrap';
import TimePicker from 'rc-time-picker';
import 'rc-time-picker/assets/index.css';

import React, { Component } from 'react';
import { Series } from './Content'

// import { BlockStore } from '../stores/ScheduleStore';

const default_contetnts = [["Помста1", 1, 1]];


class Block extends Component {
  constructor(props) {
    super(props);
    const { block_id, start_time, stop_time } = props;
    // this.state.blockStore = new BlockStore({ block_id, start_time, stop_time });
  }

  render() {
    const { block_id, start_time, stop_time, seriesStore } = this.props;
    // const { content } = this.state;
    return (
      <Row>
        <Col sm="2"><label>№ блоку<input type="text" defaultValue={block_id} /></label></Col>
        <Col sm="1"><TimePicker
          defaultValue={moment(start_time, "HH:mm")}
          showSecond={false}
          onChange={() => {
            // this.forceUpdate();
          }}
        />
        </Col>
        <Col sm="1"><TimePicker
          defaultValue={moment(stop_time, "HH:mm")}
          showSecond={false}
          onChange={() => {
            // this.forceUpdate();
          }}
        />
        </Col>
        <Col>
          <Series seriesStore={seriesStore} />
        </Col>
      </Row>
    );

  }
}

export default Block;