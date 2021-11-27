import { Button, FormControl, InputLabel, Link, MenuItem, Paper, Select, TextField } from "@material-ui/core";
import { SERVER_URL, linkifyCode } from "./common";

import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const querystring = require('querystring');

class SearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: '', password: '', listing: '', results: '' };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.passwordChange = this.passwordChange.bind(this);
    this.listingChange = this.listingChange.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  passwordChange(event) {
    this.setState({ password: event.target.value });
  }

  listingChange(event) {
    // Submit the search whenever the user chooses the listing
    this.setState({ listing: event.target.value }, this.handleSubmit);
  }

  async handleSubmit(event) {
    if (event) {
      event.preventDefault();
    }

    const query = {
      password: this.state.password || '',
      search: this.state.value || '',
      listing: this.state.listing || ''
    }

    const response = await fetch(`${SERVER_URL}/data?${querystring.encode(query)}`, {
      headers: {
        'Bypass-Tunnel-Reminder': 1,
        'Content-Type': 'application/json'
      }
    }).catch((e) => {
      console.error(e);
      this.setState({ results: 'Server connection failed. Try again in a few minutes. If this issue persists, please contact the developer.' });
      return
    });
    const body = await response.json();

    if (response.status !== 200) {
      this.setState({ results: 'Error: ' + body.error })
      return
    }
    if (body.results.length === 0) {
      this.setState({ results: 'No results found. Make a new chat and put it in the sheet!' })
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
              <TableCell style={{ whiteSpace: "nowrap" }}>{linkifyCode(data.code)}</TableCell>
              <TableCell>{data.name}</TableCell>
              <TableCell>{data.extra}</TableCell>
              <TableCell><Link href={data.link} target="_blank" underline="always">{data.link}</Link></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>;
    this.setState({ results: tableResults });
  }

  render() {
    return (
      <div>
        <form id="searchform" onSubmit={this.handleSubmit}>
          <div class="searchrow">
            <TextField label="Password" type="text" value={this.state.password} onChange={this.passwordChange} />
          </div>
          <div class="searchrow">
            <FormControl variant="standard">
              <InputLabel id="select-listing-label">Choose Listing</InputLabel>
              <Select label="Choose Listing" labelId="select-listing-label" value={this.state.listing} onChange={this.listingChange}>
                {this.props.listings.map((data, index) => <MenuItem key={index} value={data.name}>{data.name}</MenuItem>)}
              </Select>
            </FormControl>
          </div>
          <div class="searchrow">
            <TextField label="Search for a class" type="text" value={this.state.value} onChange={this.handleChange} />
          </div>
          <Button type="submit">Submit</Button>
        </form>
        <br></br>
        <Paper className="container" style={{ whiteSpace: 'pre-line', overflowX: 'auto' }}>
          {this.state.results}
        </Paper>
      </div>
    );
  }
}

export default SearchForm;