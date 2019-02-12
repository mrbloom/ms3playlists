import React, { Component } from 'react';
import moment from 'moment';
import TimePicker from 'rc-time-picker';
import 'rc-time-picker/assets/index.css';
import './components.css'
import shortid from 'shortid';

import {
  SeriesStore,
  existy, ua_day,
  DayScheduleStore,
  dateToString,
  get_week_dates,
  schedule
}
  from '../stores/ScheduleStore'
import { Col, Row } from 'react-bootstrap';

const types = [
  "Розваж.",
  "Власний",
  "Кінопоказ",
  "УКР."
];
const default_type = types[0];

const series_names = [
  "Помста1",
  "Помста2",
  "Помста3",
  "Вечірка",
];

const uid = () => shortid.generate();

class Sery extends Component {

  render() {
    const { idx, type, types, sery_name, series_names, first, last } = this.props;
    return (

      <table>
        <tbody>
          <tr>
            <td>
              <select name={`type_${idx}`} defaultValue={type}>
                {types.map(type =>
                  <option key={type} value={type}>{type}</option>
                )}
              </select>
            </td>
            <td>
              <select name={`sery_name_${idx}`} defaultValue={sery_name}>
                {series_names.map(sery =>
                  <option key={sery} value={sery}>{sery}</option>
                )}
              </select>
            </td>
            <td>
              <input className="number" min="1" name={"first_" + idx} type="number" defaultValue={first} />
            </td>
            <td>
              <input className="number" min="1" name={"last_" + idx} type="number" defaultValue={last} />
            </td>
          </tr>
        </tbody>
      </table>

    );
  }
}

const Series = props =>
  <>
    <table><tbody>
      {props.series.map((sery, idx) =>
        <tr key={uid()}>
          <td>
            <Sery idx={idx} sery_name={sery[0]} types={types} first={sery[1]} last={sery[2]} series_names={series_names} type={sery[3]} />
          </td>
        </tr>
      )}
    </tbody></table>
  </>

class Block extends Component {
  change = (e) => console.log(e.target.name, '=', e.target.value)
  render() {
    const { block_id, start_time, stop_time, series } = this.props;
    return (
      <form onChange={this.change}>
        <table><tbody>
          <tr>
            <td>{block_id}</td>
            <td><input type="time" className="time" name="start_time" defaultValue={start_time} /></td>
            <td><input type="time" className="time" name="start_time" defaultValue={stop_time} /></td>
            <td><Series series={series} /></td>
          </tr>
        </tbody></table>
      </form>
    );
  }
}
const DaySchedule = (props) => {
  return (
    <div>
      <div>
        {ua_day(new Date(props.date))} {props.date}
      </div>
      <div>
        <table><tbody>
          {props.blocks.map(block =>
            <tr key={uid()}><td>
              <Block block_id={block[0]} start_time={block[1]} stop_time={block[2]} series={block[3]} />
            </td></tr>
          )}
        </tbody></table>
      </div>
    </div>
  )
}

class Schedule extends Component {
  constructor(props) {
    super(props);
    const today = new Date();
    const init_schedule = get_week_dates(today).map(date =>
      [dateToString(date), [
        ["08020001", "20:00", "21:00", [["Помста1", 1, 12, "Розваж."], ["Помста3", 11, 13, "УКР."]]],
        ["08020002", "22:00", "23:00", [["Помста2", 5, 12, "Розваж."], ["Помста3", 11, 13, "УКР."]]],
        ["08020003", "23:00", "03:00", [["Помста3", 7, 12, "Розваж."], ["Помста3", 11, 13, "УКР."]]],
      ]],
    );
    this.state = {
      week_date: dateToString(today),
      schedule: init_schedule,
    };
    this.prev_schedules = [init_schedule];
  }

  changeWeekDate = (e) => {
    this.setState({ week_date: e.target.value });
  }

  removeSchedule = (idx) => (e) => {
    const sc = this.state.schedule;
    this.prev_schedules.push(sc);
    this.setState({
      schedule: sc.filter((_, i) => i !== idx)//slice(0,idx+1).concat([sc[idx][0],[]],sc.slice[idx+1]) 
    });//
  }

  undoScedule = () => {
    this.setState({ schedule: this.prev_schedules.pop() });
  }

  render() {
    // console.log(dateToString(this.state.week_date));
    return (
      <>

        <input
          type="date"
          value={this.state.week_date}
          onChange={this.changeWeekDate}
        />
        <button onClick={this.undoScedule}>Undo Schedule</button>

        <table>
          <tbody>
            {this.state.schedule.map((day_schedule, idx) =>
              <tr key={uid()}>
                <td>
                  <button
                    onClick={this.removeSchedule(idx)}
                  >
                    -
                  </button>
                </td>
                <td>
                  <DaySchedule
                    date={day_schedule[0]}
                    blocks={day_schedule[1]}
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </>
    );
  }
}

// class Block extends Component {
//   constructor(props) {
//     super(props);
//     console.log("constr");
//     this.state = {
//       schedule: schedule,
//       // block_id: props.block_id,
//       // start_time: props.start_time,
//       // stop_time: props.stop_time,
//     };
//     console.log('end');
//   }
//   render() {
//     // const { block_id, start_time, stop_time } = this.state;
//     return (
//       <Row>
//         <Col><input type="text" defaultValue={this.props.block_id} /></Col>
//         <Col><input type="time" defaultValue={this.props.start_time} /></Col>
//         <Col><input type="time" defaultValue={this.props.stop_time} /></Col>
//       </Row>
//     );
//   }
// }




// class Series extends Component {
//   constructor(props = {}) {
//     super(props);
//     console.log(this.state);
//     const seriesStore = new SeriesStore(props);
//     this.state = { seriesStore };
//     console.log(this.state);
//   }

//   change = (row_idx, cell_idx) => (e) => {
//     this.setState({ seriesStore: this.state.seriesStore.setValue(row_idx, cell_idx, e.target.value) });
//   }

//   push = () => {
//     console.log("add sery");
//     this.setState({ seriesStore: this.state.seriesStore.push() });
//   }
//   pop = () => this.setState({ seriesStore: this.state.seriesStore.pop() });

//   render() {
//     const { seriesStore } = this.state;
//     if (seriesStore === undefined) {
//       console.log("no props");
//       return null;
//     }
//     const { series, types, series_names, block_id, start_time, stop_time } = seriesStore;
//     const [NAME, FIRST, LAST, TYPE] = [
//       seriesStore.series_name_idx,
//       seriesStore.first_idx,
//       seriesStore.last_idx,
//       seriesStore.type_idx,
//     ]
//     console.log(this.state.seriesStore.series);
//     return (
//       <Row>

//         <Col sm="2">
//           <label>№ блоку<input type="text" defaultValue={block_id} /></label>
//         </Col>
//         <Col sm="1">
//           <TimePicker
//             defaultValue={moment(start_time, "HH:mm")}
//             showSecond={false}
//             onChange={() => {
//               // this.forceUpdate();
//             }}
//           />
//         </Col>
//         <Col sm="1">
//           <TimePicker
//             defaultValue={moment(stop_time, "HH:mm")}
//             showSecond={false}
//             onChange={() => {
//               // this.forceUpdate();
//             }}
//           />
//         </Col>

//         <Col>
//           {series.map((sery, idx) =>
//             <Row key={idx}>

//               <Col>
//                 <select
//                   onChange={this.change(idx, TYPE)}
//                   value={sery[TYPE]}>
//                   {types.map((type, idx) =>
//                     <option key={idx} value={type}>{type}</option>
//                   )
//                   }
//                 </select>

//                 <select
//                   onChange={this.change(idx, NAME)}
//                   value={sery[NAME]}>
//                   {series_names.map((name, idx) =>
//                     <option key={idx} value={name} >{name}</option>
//                   )
//                   }
//                 </select>
//                 <input type="number" onChange={this.change(idx, FIRST)} min="1" value={sery[1]} />
//                 <input type="number" onChange={this.change(idx, LAST)} min="1" value={sery[2]} />
//               </Col>
//             </Row>
//           )
//           }
//           <Row>
//             <Col>
//               <button onClick={this.push}>+</button>
//               <button onClick={this.pop}>-</button>
//             </Col>
//           </Row>
//         </Col>
//       </Row>
//     );
//   }
// }

// const DaySchedule = (props) =>
//   <>
//     {props.seriesStores.map(seriesStore =>
//       <Row>
//         <Col>
//           {ua_day(seriesStore.date)}
//           <input type="date" defaultValue={seriesStore.date.toISOString().slice(0, 10)} readOnly />
//         </Col>
//         <Col>
//           <Series seriesStore={seriesStore} />
//         </Col>
//       </Row>
//     )}
//   </>



export {
  DaySchedule,
  Series,
  Schedule,
  Sery,
  Block,
};