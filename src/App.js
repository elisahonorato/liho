import logo from './logo.svg';
// Components
import About from './component/About';
import Cube from './component/Cube';
import Point from './component/Points';
import './App.css';
import React from 'react';

 

  function App() {
  return (
    <div className="App">
      <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
        <About></About>
      </header>
      {/* create a form for the user to select a file */}
      <form>
                <input type={"file"} accept={".csv"} />
                <button>IMPORT CSV</button>
          </form>
          
      <div><canvas id="Threejs"></canvas></div>
  
    </div>
  );
}
export default App;

