import React, { Component } from 'react';
import AdjusmentList from './components/AdjustmentList/AdjustmentList';
import Linear from './components/Linear/Linear';
import Words from './components/Words/Words';
import Matrix from './components/Matrix/Matrix';
import Map from './components/Map/Map';
import Globe from './components/Globe/Globe';
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
        <Globe />
        {/* <Map /> */}
        <Matrix />
        <Linear />
        <Words />
        <AdjusmentList />
      </div>
    );
  }
}

export default App;
