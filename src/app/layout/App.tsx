import React, { useState, useEffect, SyntheticEvent } from 'react';
import { Container } from 'semantic-ui-react';

import 'semantic-ui-css/semantic.min.css';

import { IActivity } from '../models/activity';
import NavBar from '../../features/nav/NavBar';
import ActivitiyDashboard from '../../features/activities/dashboard/ActivitiyDashboard';
import agent from '../api/agent';
import LoadingComponent from './LoadingComponent';

const App: React.FC = () => {
  const [activities, setActivities] = useState<IActivity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(null);

  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [target, setTarget] = useState('');

  const handleSelectActivity = (id: string) => {
    setSelectedActivity(activities.find(a => a.id === id)!);

    setEditMode(false);
  };

  const handleOpenCreateForm = () => {
    setSelectedActivity(null);

    setEditMode(true);
  };

  const handleCreateActivity = (activity: IActivity) => {
    setSubmitting(true);

    agent.Activities.create(activity).then(() => {
      setActivities([...activities, activity]);

      setSelectedActivity(activity);

      setEditMode(false);
    })
    .then(() => setSubmitting(false));
  };

  const handleEditActivity = (activity: IActivity) => {
    setSubmitting(true);

    agent.Activities.update(activity).then(() => {
      setActivities([...activities.filter(a => a.id !== activity.id), activity]);

      setSelectedActivity(activity);

      setEditMode(false);
    })
    .then(() => setSubmitting(false));
  };

  const handleDeleteActivity = (e: SyntheticEvent<HTMLButtonElement>, id: string) => {
    setSubmitting(true);

    setTarget(e.currentTarget.name);

    agent.Activities.delete(id).then(() => {
      setActivities(activities.filter(a => a.id !== id));
    })
    .then(() => setSubmitting(false));
  };

  useEffect(() => {
    agent.Activities.list()
      .then(response => {
        const activities: IActivity[] = response.map(activity => {
          const formattedDateString = activity.date.split('.')[0]

          return {
            ...activity,
            date: formattedDateString
          }
        });

        setActivities(activities);
      })
      .then(() => setLoading(false));
  }, []);

  if (loading) return <LoadingComponent content='Loading Activities...' />

  return (
    <>
      <NavBar openCreateForm={handleOpenCreateForm} />

      <Container style={{ marginTop: '7em' }}>
        <ActivitiyDashboard
          activities={activities}
          selectedActivity={selectedActivity}
          setSelectedActivity={setSelectedActivity}
          selectActivity={handleSelectActivity}
          editMode={editMode}
          setEditMode={setEditMode}
          createActivity={handleCreateActivity}
          editActivity={handleEditActivity}
          deleteActivity={handleDeleteActivity}
          submitting={submitting}
          target={target}
        />
      </Container>
    </>
  );
};

export default App;
