import React from 'react';
import { Container } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div>
      <Container style={{ marginTop: '7em' }}>
        <h1>HOME</h1>
        <h2>Go to <Link to='/activities'>Activities</Link></h2>
      </Container>
    </div>
  );
};

export default HomePage;
