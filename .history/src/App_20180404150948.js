import React, { Component } from 'react';
import AdjusmentList from './components/AdgustmentList';
import Linear from './components/Linear';
import Words from './components/Words';
import Matrix from './components/Matrix';
import logo from './logo.svg';
import './App.scss';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Matrix />
        <Linear />
        <Words />
        <AdjusmentList />
      </div>
    );
  }
}

export default App;
