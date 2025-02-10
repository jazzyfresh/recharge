import React from 'react';
import logo from './/reshot-icon-battery-plug.svg';
import { Map } from './features/map/Map.tsx';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1 className="App-title">Recharge</h1>
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <Map />
    </div>
  );
}

export default App;
