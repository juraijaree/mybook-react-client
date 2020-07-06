import React, { useContext, useEffect } from 'react';
import { Grid } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';

import ActivityStore from '../../../app/stores/activityStore';
import ActivityList from './ActivityList';
import LoadingComponent from '../../../app/layout/LoadingComponent';

const ActivitiyDashboard: React.FC = () => {
  const activityStore = useContext(ActivityStore);

  useEffect(() => {
    activityStore.loadActivities();
  }, [activityStore]);

  if (activityStore.loadingInitial)
    return <LoadingComponent content='Loading Activities...' />;

  return (
    <Grid>
      <Grid.Column width={10}>
        <ActivityList />
      </Grid.Column>

      <Grid.Column width={6}>
        <h1>ACTIVITY FILTERS</h1>
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivitiyDashboard);
