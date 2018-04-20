import React, { Component } from 'react';
import BarChart from './components/BarChart';
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
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <Matrix />
        <Linear />
        <Words />
        <AdjusmentList />
      </div>
    );
  }
}

export default App;
