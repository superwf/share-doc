import React from 'react';
import logo from './logo.svg';
import './App.css';
import 'myelement';
import { transformToReact } from './transform'

export const MyElement = transformToReact('my-element')

const data = {
  a: 1,
  b: 2
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <MyElement data={data}></MyElement>
      </header>
    </div>
  );
}

export default App;
