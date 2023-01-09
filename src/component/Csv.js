import React from 'react';
import * as py from './Python_Blender_Csv.py';

class CSVReader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      csvfile: undefined
    };
    this.updateData = this.updateData.bind(this);
  }

  handleChange = event => {
    this.setState({
      csvfile: event.target.files[0]
    });
  };

  importCSV = () => {
    const { csvfile } = this.state;
    Papa.parse(csvfile, {
      complete: this.updateData,
      header: true
    });
  };

  updateData(result) {
    const data = result.data;
    // do something with the data
  }

  render() {
    return (
      <div>
        <h2>Import CSV File</h2>
        <input
          type="file"
          ref={input => {
            this.filesInput = input;
          }}
          name="file"
          placeholder={null}
          onChange={this.handleChange}
        />
        <button onClick={this.importCSV}> Upload now!</button>
      </div>
    );
  }
}

export default CSVReader;