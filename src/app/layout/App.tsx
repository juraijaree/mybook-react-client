import React, { useEffect, useContext } from 'react';
import { Container } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';

import 'semantic-ui-css/semantic.min.css';

import ActivityStore from '../stores/activityStore';
import NavBar from '../../features/nav/NavBar';
import ActivitiyDashboard from '../../features/activities/dashboard/ActivitiyDashboard';
import LoadingComponent from './LoadingComponent';

const App: React.FC = () => {
  const activityStore = useContext(ActivityStore);

  useEffect(() => {
    activityStore.loadActivities();
  }, [activityStore]);

  if (activityStore.loadingInitial) return <LoadingComponent content='Loading Activities...' />

  return (
    <>
      <NavBar />

      <Container style={{ marginTop: '7em' }}>
        <ActivitiyDashboard />
      </Container>
    </>
  );
};

export default observer(App);
