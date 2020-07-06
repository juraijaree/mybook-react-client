import React from 'react';
import { Container } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { Route, useLocation } from 'react-router-dom';

import 'semantic-ui-css/semantic.min.css';

import NavBar from '../../features/nav/NavBar';
import ActivitiyDashboard from '../../features/activities/dashboard/ActivitiyDashboard';
import HomePage from '../../features/home/HomePage';
import ActivityForm from '../../features/activities/form/ActivityForm';
import ActivityDetails from '../../features/activities/details/ActivityDetails';

const App: React.FC = () => {
  const location = useLocation();

  return (
    <>
      <Route path='/' component={HomePage} exact />
      <Route
        path='/(.+)'
        render={() => (
          <>
            <NavBar />

            <Container style={{ marginTop: '7em' }}>
              <Route path='/activities' component={ActivitiyDashboard} exact />
              <Route path='/activities/:id' component={ActivityDetails} />
              <Route
                key={location.key}
                path={['/create-activity', '/edit-activity/:id']}
                component={ActivityForm}
              />
            </Container>
          </>
        )}
      />
    </>
  );
};

export default observer(App);
