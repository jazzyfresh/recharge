import React from 'react';
import logo from './reshot-icon-battery-plug.svg';
import { ChargerDashboard } from './features/charger/ChargerDashboard.tsx';

function App() {
  return (
    <div className="App">
      <header className="">
        <div className="flex justify-center items-center">
          <h1 className="text-7xl font-bold">Recharge</h1>
          <img src={logo} className="h-30 w-30 object-scale-down" alt="logo" />
        </div>
      </header>
      <ChargerDashboard />
    </div>
  );
}

export default App;
