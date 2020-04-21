import React from 'react';
import logo from './logo.svg';
import './App.css';
// import { render } from '@testing-library/react';
import Weather from './component/Weather';
import NaverRank from './component/NaverRank';

const lists = [
  {"title": "날씨 확인", "component": <Weather />},
  {"title": "실시간 검색어 확인", "component": <NaverRank />},
];

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {lists.map((data, idx) => (
          <div key={idx} className="div_item">
            {data.title}
            {data.component}
          </div>
        ))}
      </header>
    </div>
  );
}

export default App;
