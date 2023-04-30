import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Card } from 'antd';
import { Login } from './components/Login/Login';

function App() {
  return (
    <div className="App">
      <Card>
        <Login />
      </Card>
    </div>
  );
}

export default App;
