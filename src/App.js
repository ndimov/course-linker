import './App.css';

import { Container, Typography } from '@material-ui/core'
import React, { Component } from 'react';

import AddLinkModal from './AddLinkModal';
import Header from './Header';
import SearchForm from './SearchForm.js';
import { ThemeProvider } from '@material-ui/core/styles';
import { fetchListings } from './common';
import theme from './theme';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      listings: []
    }
  }

  async componentDidMount() {
    fetchListings().then(listings => { this.setState( { listings: listings})})
  }

  render() {
    return (
      <ThemeProvider theme={theme}>
        <Header />
        <br></br>
        <Container maxWidth="md">
          <Typography paragraph="true" className="helper-text">
            Enter the password in the password field (to avoid GroupMe bots) and the search query in the search field. A course is matched if the query string is fully contained in either the class code (e.g. "B50 ACCT 2610") or the class name (e.g. "Principles of Financial Accounting"), ignoring case.
          </Typography>
          <Typography paragraph="true" className="helper-text">
            Press submit with just the password to see all classes.
          </Typography>
          <Typography paragraph="true" className="helper-text">
            Note: If you try to join too many groups, GroupMe will say "not joinable" for a bit, so try the link again later.
          </Typography>
          <SearchForm {...this.state} />
          <AddLinkModal {...this.state} />
        </Container>
      </ThemeProvider>
    );
  }
}

export default App;
