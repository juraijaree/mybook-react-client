import React, { useContext, useEffect } from 'react';
import { Grid } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';

import { RootStoreContext } from '../../../app/stores/rootStore';
import ActivityList from './ActivityList';
import LoadingComponent from '../../../app/layout/LoadingComponent';

const ActivitiyDashboard: React.FC = () => {
  const { loadActivities, loadingInitial } = useContext(RootStoreContext).activityStore;

  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  if (loadingInitial)
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
