import React, { useState, useEffect } from 'react';
import { Container } from 'semantic-ui-react';

import axios from 'axios';

import 'semantic-ui-css/semantic.min.css';

import { IActivity } from '../models/activity';
import NavBar from '../../features/nav/NavBar';
import ActivitiyDashboard from '../../features/activities/dashboard/ActivitiyDashboard';

const App: React.FC = () => {
  const [activities, setActivities] = useState<IActivity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(null);

  const [editMode, setEditMode] = useState(false);

  const handleSelectActivity = (id: string) => {
    setSelectedActivity(activities.find(a => a.id === id)!);

    setEditMode(false);
  };

  const handleOpenCreateForm = () => {
    setSelectedActivity(null);

    setEditMode(true);
  };

  const handleCreateActivity = (activity: IActivity) => {
    setActivities([...activities, activity]);

    setSelectedActivity(activity);

    setEditMode(false);
  };

  const handleEditActivity = (activity: IActivity) => {
    setActivities([...activities.filter(a => a.id !== activity.id), activity]);

    setSelectedActivity(activity);

    setEditMode(false);
  };

  const handleDeleteActivity = (id: string) => {
    setActivities(activities.filter(a => a.id !== id));
  };

  useEffect(() => {
    axios.get<IActivity[]>('http://localhost:5000/api/activities').then(response => {
      const activities: IActivity[] = response.data.map(activity => {
        const formattedDateString = activity.date.split('.')[0]

        return {
          ...activity,
          date: formattedDateString
        }
      });

      setActivities(activities);
    });
  }, []);

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
        />
      </Container>
    </>
  );
};

export default App;
