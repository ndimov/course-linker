import React from 'react';
import { Paper, Button, TextField } from "@material-ui/core";
import Linkify from 'react-linkify';

const SERVER_URL = 'https://red-goat-15.loca.lt'

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
    });
    const body = await response.json();

    console.log(body);
    if (response.status !== 200) {
      this.setState({ results: 'Error: '+body.error})
      return
    }
    console.log(body);
    this.setState({ results: body.results.join('\n')});
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
        <Paper className="container" style={{ whiteSpace: 'pre-line' }}>
          <Linkify>{this.state.results}</Linkify>
        </Paper>
      </div>
    );
  }
}

export default SearchForm;