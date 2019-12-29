import React, { useState, useEffect } from 'react';
import { Header, Icon } from 'semantic-ui-react';
import './App.css';

import 'semantic-ui-css/semantic.min.css'

import axios from 'axios';

const App: React.FC = () => {
  const [value, setValue] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/values').then(response => {
      setValue(response.data);
    });
  }, []);

  return (
    <div className="App">
      <Header as='h2'>
        <Icon name='settings' />
        <Header.Content>
          Account Settings
          <Header.Subheader>Manage your preferences</Header.Subheader>
        </Header.Content>
      </Header>

      <ul>
        {
          value.map((v: any, i) => (
            <li key={v.id}>
              {v.name}
            </li>
          ))
        }
      </ul>
    </div>
  );
}

export default App;
