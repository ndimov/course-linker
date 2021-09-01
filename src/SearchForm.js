import React from 'react';
import { Paper, Button, TextField } from "@material-ui/core";
import Linkify from 'react-linkify';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const SERVER_URL = 'http://localhost:5000'
// const SERVER_URL = 'https://course-linker.loca.lt'

class SearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: '', password: '', results: '' };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.passwordChange = this.passwordChange.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  passwordChange(event) {
    this.setState({ password: event.target.value});
  }

  async handleSubmit(event) {
    event.preventDefault();

    const response = await fetch(`${SERVER_URL}/data?p=${this.state.password}&q=${this.state.value}`, {
      headers: {
        'Bypass-Tunnel-Reminder': 1,
      }
    }).catch((e) => {
      this.setState({ results: 'Server connection failed. Try again in a few minutes.'});
      return
    });
    const body = await response.json();

    console.log(body);
    if (response.status !== 200) {
      this.setState({ results: 'Error: '+body.error})
      return
    }
    console.log(body);
    if (body.results.length === 0) {
      this.setState({ results: 'No results found. Make a new chat and put it in the sheet!'})
      return
    }
    let tableResults =
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Class Code</TableCell>
          <TableCell>Class Name</TableCell>
          <TableCell>Additional Info</TableCell>
          <TableCell>Link</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {body.results.map((data, index) => (
          <TableRow key={index}>
            <TableCell style={{whiteSpace: "nowrap"}}>{data.code}</TableCell>
            <TableCell>{data.name}</TableCell>
            <TableCell>{data.extra}</TableCell>
            <TableCell><Linkify>{data.link}</Linkify></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>;
    this.setState({ results: tableResults});
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>
            Password:
          </label>
          <TextField type="text" value={this.state.password} onChange={this.passwordChange} />
          <br></br>
          <label>
            Search for a class:
          </label>
          <TextField type="text" value={this.state.value} onChange={this.handleChange} />
          <Button type="submit">Submit</Button>
        </form>
        <br></br>
        <Paper className="container" style={{ whiteSpace: 'pre-line', overflowX: 'auto'}}>
          {this.state.results}
        </Paper>
      </div>
    );
  }
}

export default SearchForm;