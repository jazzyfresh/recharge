import React from 'react';
import { ChargerMap } from './ChargerMap.tsx';
import { ChargerPanel } from './ChargerPanel.tsx';
import './ChargerDashboard.css';

export function ChargerDashboard() {
  return (
    <div className="w-full flex flex-col sm:flex-row flex-wrap sm:flex-nowrap py-4 flex-grow">
      <main role="main" className="w-full flex-grow pt-1 px-3">
        <ChargerMap />
      </main>
      <div className="w-fixed w-full flex-shrink flex-grow-0 px-2">
        <ChargerPanel />
      </div>
    </div>
  );
};
