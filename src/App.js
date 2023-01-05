import logo from './logo.svg';
import './App.css';
import React from 'react';


function App() {
  return (
    <div className="App">
      <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
        <img src={logo} className="App-logo-animation" alt="logo" />
        <p>
        Plataforma Open-source Online de Visualización Tridimensional Multivariable de Bases de Datos Científicos
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Visualizar Bases de Datos
        </a>
        <div style={{ textAlign: "center" }}>
            <h1>REACTJS CSV IMPORT EXAMPLE </h1>
            <form>
                <input type={"file"} accept={".csv"} />
                <button>IMPORT CSV</button>
                
            </form>
        </div>
      </header>
  
    </div>
  );
}
export default App;
