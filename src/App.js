import logo from './logo.svg';
// Components
import About from './component/About';
import Cube from './component/Cube';
import CsvReader from './component/Csv'
import './App.css';
import React from 'react';

 

  function App() {
  return (
    <div className="App">
      <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
        <About></About>
      </header>
      <CsvReader></CsvReader>
      <div><canvas id="Threejs"><Cube></Cube></canvas></div>
  
    </div>
  );
}
export default App;

