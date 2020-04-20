import React from 'react';
import logo from './logo.svg';
import './App.css';
// import { render } from '@testing-library/react';
import Weather from './component/Weather';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div>날씨 확인 <Weather /></div>
      </header>
    </div>
  );
}

export default App;
