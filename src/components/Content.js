import React, { Component } from 'react';
import moment from 'moment';
import TimePicker from 'rc-time-picker';
import 'rc-time-picker/assets/index.css';
import './components.css'
import shortid from 'shortid';




import {
  SeriesStore,
  existy, ua_day,
  dateToString,
  datestrToBlockId,
  dateToBlockId,
  get_week_dates,
  schedule,
  default_sery,
}
  from '../stores/ScheduleStore'
import { Col, Row } from 'react-bootstrap';

import { assertSeriesNumber, getFirstLast, getNamesOfSeries, durations } from '../stores/SeriesData'

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
    const { idx, type, types, sery_name, series_names, first, last, removeSery, block_id, changeSery } = this.props;
    return (

      <table>
        <tbody>
          <tr>
            <td>
              <select
                onChange={changeSery(block_id, idx, 3)}
                name={`type_${block_id}_${idx}`}
                defaultValue={type}
              >
                {types.map(type =>
                  <option key={type} value={type}>{type}</option>
                )}
              </select>
            </td>
            <td>
              <select
                onChange={changeSery(block_id, idx, 0)}
                name={`seryName_${block_id}_${idx}`}
                defaultValue={sery_name}>
                {series_names.map(sery =>
                  <option key={sery} value={sery}>{sery}</option>
                )}
              </select>
            </td>
            <td>
              <input
                onChange={changeSery(block_id, idx, 1)}
                className="number" min="1" name={`first_${block_id}_${idx}`} type="number" defaultValue={first} />
            </td>
            <td>
              <input
                onChange={changeSery(block_id, idx, 2)}
                className="number" min="1" name={`last_${block_id}_${idx}`} type="number" defaultValue={last} />
            </td>
            <td><button onClick={removeSery(block_id, idx)}>-</button></td>
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
            <Sery
              block_id={props.block_id}
              idx={idx} sery_name={sery[0]}
              types={types} first={sery[1]}
              last={sery[2]}
              series_names={series_names}
              type={sery[3]}
              removeSery={props.removeSery}
              changeSery={props.changeSery}
            // addSery={props.addSery}

            />
          </td>
        </tr>
      )}
      <tr>
        <td>
          <button onClick={e => props.addSery(props.block_id)}>+</button>
        </td>
      </tr>
    </tbody></table>
  </>

class Block extends Component {
  change = (e) => console.log(e.target.name, '=', e.target.value)
  render() {
    const { block_id, series, removeSery, addSery, changeTime, getTime, changeSery } = this.props;
    const start_time = getTime(block_id, "start");
    const stop_time = getTime(block_id, "stop");
    return (
      <table><tbody>
        <tr>
          <td>{block_id}</td>
          <td>
            <input
              type="time" className="time" name={`${block_id}_start_time`} value={start_time}//defaultValue={start_time}
              onChange={changeTime(block_id, "start")}
            />
          </td>
          <td>
            <input
              type="time" className="time" name={`${block_id}_stop_time`} value={stop_time}//defaultValue={stop_time}
              onChange={changeTime(block_id, "stop")}
            />
          </td>
          <td><Series series={series} block_id={block_id} removeSery={removeSery} addSery={addSery} changeSery={changeSery} /></td>
        </tr>
      </tbody></table>
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
            <tr key={uid()}>
              <td>
                <button
                  onClick={() => props.removeBlock(block[0])}
                >-</button>
              </td>
              <td>
                <Block
                  block_id={block[0]}
                  start_time={block[1]}
                  stop_time={block[2]}
                  series={block[3]}
                  removeSery={props.removeSery}
                  addSery={props.addSery}
                  changeTime={props.changeTime}
                  getTime={props.getTime}
                  changeSery={props.changeSery}
                />
              </td>
            </tr>
          )}
          <tr>
            <td>
              <button
                onClick={() => props.addBlock(props.date)}
              >+</button>
            </td>
          </tr>
        </tbody></table>
      </div>
    </div>
  )
}

class Schedule extends Component {
  constructor(props) {
    super(props);
    const today = new Date();
    const init_schedule = this.initSchedule(today)
    this.state = {
      week_date: dateToString(today),
      schedule: init_schedule,
    };
    this.prev_schedules = [init_schedule];
  }

  initSchedule = (today) => get_week_dates(today).map(date =>
    [dateToString(date), [
      [datestrToBlockId(dateToString(date), 1), "20:00", "21:00", [["Помста1", 1, 12, "Розваж."], ["Помста3", 11, 13, "УКР."]]],
      [datestrToBlockId(dateToString(date), 2), "22:00", "23:00", [["Помста2", 5, 12, "Розваж."], ["Помста3", 11, 13, "УКР."]]],
      [datestrToBlockId(dateToString(date), 3), "23:00", "03:00", [["Помста3", 7, 12, "Розваж."], ["Помста3", 11, 13, "УКР."]]],
    ]],
  );

  changeWeekDate = (e) => {
    console.log(e.target.value);
    const dt = e.target.value
    const sc = this.state.schedule;
    this.prev_schedules.push(sc);
    this.setState({
      week_date: dt,
      schedule: this.initSchedule(new Date(dt))
    });
  }

  removeSchedule = (idx) => (e) => {
    const sc = this.state.schedule;
    this.prev_schedules.push(sc);
    this.setState({
      schedule: sc.filter((_, i) => i !== idx)//slice(0,idx+1).concat([sc[idx][0],[]],sc.slice[idx+1]) 
    });//
  }

  makeSomethingWithBlock = (block_func) => {
    const sc = this.state.schedule;
    this.prev_schedules.push(sc);
    this.setState({
      schedule:
        sc.map(([date, blocks]) => [
          date,
          blocks.map(block_func)
        ])
    });
  }

  makeSomethinWithSery = (block_id, idx, sery_func) => {
    console.log("mod ser");
    let sc = this.state.schedule;
    this.prev_schedules.push(sc);
    sc.forEach(([date, blocks]) => {
      blocks.forEach(([bl_id, start, stop, series]) => {
        series.forEach((sery, i) => {
          if (block_id == bl_id && i == idx)
            series[i] = sery_func(sery);
        })
      })
    })
    this.setState({
      schedule: sc
    });
  }

  removeSery = (block_id, idx) => (e) => {
    console.log("rem ser");
    const rem_f = ([b_id, start, stop, series]) => {
      if (b_id === block_id) {
        console.log(b_id);
        return [b_id, start, stop, series.filter((_, i) => i !== idx)];
      } else {
        return [b_id, start, stop, series];
      }
    }
    this.makeSomethingWithBlock(rem_f)
  }

  removeBlock = (block_id) => {
    const sc = this.state.schedule;
    this.prev_schedules.push(sc);
    this.setState({
      schedule: sc.map(([date, blocks]) => [date, blocks.filter(block => {
        // console.log("bl", block, block_id !== block);
        return block_id !== block[0]
      })])
    })
    console.log(this.prev_schedules);
  }

  addSery = (block_id, sery = default_sery) => {
    console.log("add sery", block_id);
    const add_func = ([b_id, start, stop, series]) => {
      if (b_id === block_id) {
        console.log(b_id);
        // console.log(sc)
        return [b_id, start, stop, [...series, sery]];
      } else {
        return [b_id, start, stop, series];
      }
    }
    this.makeSomethingWithBlock(add_func);
  }

  addBlock = (date, start = "20:00", stop = "06:00", series = [default_sery]) => {
    const sc = this.state.schedule;
    this.prev_schedules.push(sc);
    sc.forEach(([dt, blocks]) => {
      if (dt === date) {
        const len = blocks.length;
        blocks.push([datestrToBlockId(date, len + 1), start, stop, series]);
      }
    });
    this.setState({ schedule: sc });
  }

  undoScedule = () => {
    if (this.prev_schedules.length > 0) {
      const prev_sc = this.prev_schedules.pop();
      console.log("UNDO", prev_sc);
      this.setState({ schedule: prev_sc });
    }
  }

  getTime = (block_id, time_idx) => {
    let some_time = null;
    this.state.schedule.forEach((day_schedule) => {
      day_schedule[1].forEach(block => {
        const bl_id = block[0];
        if (bl_id === block_id) {
          if (time_idx === "start") {
            console.log("start", block[1]);
            some_time = block[1];
          }
          else {
            some_time = block[2];
          }

        }
      })
    })
    return some_time;
  }

  changeTime = (block_id, time_idx) => (e) => {
    e.preventDefault();
    const value = e.target.value;
    console.log("chng time", block_id, time_idx, value);
    const chng_time = ([b_id, start, stop, series]) => {
      if (b_id === block_id) {
        console.log([b_id, value, time_idx === "start" ? value : start, time_idx === "stop" ? value : stop, series]);
        return [b_id, time_idx === "start" ? value : start, time_idx === "stop" ? value : stop, series];
      } else {
        return [b_id, start, stop, series];
      }
    };
    this.makeSomethingWithBlock(chng_time);
    console.log(this.state.schedule);
  }


  changeSery = (block_id, idx, type_idx) => (e) => {
    e.preventDefault();
    const change_sery = (sery) => {
      let val = e.target.value;
      let t = sery;
      console.log(typeof (val));
      if (type_idx === 1 || type_idx === 2) {
        val = parseInt(val);
        if (!assertSeriesNumber(val, sery[0]))
          return t;
      }
      if (type_idx === 0) {
        [t[1], t[2]] = getFirstLast(val);
      }
      t[type_idx] = val;
      return t;
    }

    this.makeSomethinWithSery(block_id, idx, change_sery)

    console.log(e.target.name, e.target.value);
  }

  render() {
    // console.log([...range(1,5)])
    // console.log(getSeriesNames("Помста1", 1, 7));
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
                    removeBlock={this.removeBlock}
                    addBlock={this.addBlock}
                    removeSery={this.removeSery}
                    addSery={this.addSery}
                    changeTime={this.changeTime}
                    getTime={this.getTime}
                    changeSery={this.changeSery}
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <ul>
          {this.state.schedule.map(([date, blocks]) =>
            <li key={uid()}>
              {date}
              <textarea rows="10" cols="150" defaultValue={
                blocks.map(
                  // ([block_id, start, stop, series]) => series.map( (sery) => {
                  //   console.log("hhhh")
                  //   console.log(getNamesOfSeries(sery[0],sery[1],sery[2]))
                  //   return [sery[0], sery[1], sery[2]]
                  // }).join('\n')
                  ([block_id, start, stop, series]) => {

                    return series.map(
                      sery => getNamesOfSeries(sery[0], sery[1], sery[2]).map(name =>
                        `${date} ${start}:00;${name};${date} ${stop}:00;${durations[name]};${block_id}\r\n`).join(''))

                  }
                ).join('\r\n\r\n')
              }>
              </textarea>
            </li>
          )}
        </ul>
      </>
    );
  }
}

export {
  DaySchedule,
  Series,
  Schedule,
  Sery,
  Block,
};