import React, { Component } from 'react';

class DayDate extends Component {

  onDateChanged = (event) => {
    this.props.onChange(event);
  }

  render() {
    const value = this.props.value;
    return (
      <input
        type="date"
        onChange={this.onDateChanged}
        readOnly={!this.props.editable}
        value={value}
      />
    );
  }
}


export default DayDate;