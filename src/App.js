import React, { Component } from 'react';
import AdjusmentList from './components/AdjustmentList/AdjustmentList';
import Linear from './components/Linear/Linear';
import Words from './components/Words/Words';
import Matrix from './components/Matrix/Matrix';
import Map from './components/Map/Map';
import Globe from './components/Globe/Globe';
import Spots from './components/Spots/Spots';
import Tabs from './components/Tabs/Tabs';
import Tab from './components/Tabs/Tab';
import './App.scss';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Tabs defaultActiveTabIndex={0}>
          <Tab isActive={true} text="Spots">
            <Spots />
          </Tab>
          <Tab isActive={false} text="Globe">
            <Globe />
          </Tab>
          <Tab isActive={false} text="Map">
            <Map />
          </Tab>
          <Tab isActive={false} text="Matrix">
            <Matrix />
          </Tab>
          <Tab isActive={false} text="Linear">
            <Linear />
          </Tab>
          <Tab isActive={false} text="Words">
            
          </Tab>
          <Tab isActive={false} text="AdjusmentList">
            <AdjusmentList />
          </Tab>
        </Tabs>
      </div>
    );
  }
}

export default App;
