import React, { Component } from 'react';
import './App.css';
import SearchForm from './SearchForm.js';
import { ThemeProvider } from '@material-ui/core/styles';
import theme from './theme';
import Header from './Header';
import { Container, Typography } from '@material-ui/core'


class App extends Component {
  render() {
    return (
      <ThemeProvider theme={theme}>
        <Header />
        <br></br>
        <Container maxWidth="sm">
          <Typography paragraph="true" className="helper-text">
            Enter the password in the password field (to avoid GroupMe bots) and the search query in the search field. A course is matched if the query string is fully contained in either the class code (e.g. "B50 ACCT 2610") or the class name (e.g. "Principles of Financial Accounting"), ignoring case.
          </Typography>
          <Typography paragraph="true" className="helper-text">
            Note: If you try to join too many groups, GroupMe will say "not joinable" for a bit, so try the link again later.
          </Typography>
          <SearchForm />
        </Container>
      </ThemeProvider>
    );
  }
}

export default App;
