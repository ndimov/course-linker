import React, { Component } from 'react';
import './App.css';
import SearchForm from './SearchForm.js';
import { ThemeProvider } from '@material-ui/core/styles';
import theme from './theme';
import Header from './Header';
import Container from '@material-ui/core/Container';


class App extends Component {
  render() {
    return (
      <ThemeProvider theme={theme}>
        <Header />
        <br></br>
        <Container maxWidth="sm">
          <SearchForm />
        </Container>
      </ThemeProvider>
    );
  }
}

export default App;
