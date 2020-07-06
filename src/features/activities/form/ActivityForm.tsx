import React, { useState, FormEvent, useContext, useEffect } from 'react';
import { Segment, Form, Button } from 'semantic-ui-react';
import { v4 as uuid } from 'uuid';
import { observer } from 'mobx-react-lite';

import { IActivity } from '../../../app/models/activity';
import ActivityStore from '../../../app/stores/activityStore'
import { RouteComponentProps } from 'react-router-dom';

interface DetailsParams {
  id: string;
}

const ActivityForm: React.FC<RouteComponentProps<DetailsParams>> = ({ match, history }) => {
  const {
    createActivity,
    editActivity,
    submitting,
    activity: initialFormState,
    loadActivity,
    clearActivity
  } = useContext(ActivityStore);

  const [activity, setActivity] = useState<IActivity>({
    id: '',
    title: '',
    category: '',
    description: '',
    date: '',
    city: '',
    venue: ''
  });

  useEffect(() => {
    if (match.params.id && !activity.id) {
      loadActivity(match.params.id).then(() => initialFormState && setActivity(initialFormState));
    }

    return clearActivity;
  }, [loadActivity, match.params.id, initialFormState, clearActivity, activity.id]);

  const handleInputChange = (e: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setActivity({
      ...activity,
      [e.currentTarget.name]: e.currentTarget.value
    });
  };

  const handleSubmit = () => {
    if (activity.id) {
      editActivity(activity).then(() => {
        history.push(`/activities/${activity.id}`);
      });
    }
    else {
      const id = uuid();

      createActivity({ ...activity, id }).then(() => {
        history.push(`/activities/${id}`);
      });
    }
  };

  return (
    <Segment clearing>
      <Form onSubmit={handleSubmit}>
        <Form.Input
          name='title'
          value={activity.title}
          onChange={handleInputChange}
          placeholder='Title'
        />
        <Form.TextArea
          name='description'
          value={activity.description}
          onChange={handleInputChange}
          rows={2}
          placeholder='Description'
        />
        <Form.Input
          name='category'
          value={activity.category}
          onChange={handleInputChange}
          placeholder='Category'
        />
        <Form.Input
          name='date'
          value={activity.date}
          onChange={handleInputChange}
          type='datetime-local'
          placeholder='Date'
        />
        <Form.Input
          name='city'
          value={activity.city}
          onChange={handleInputChange}
          placeholder='City'
        />
        <Form.Input
          name='venue'
          value={activity.venue}
          onChange={handleInputChange}
          placeholder='Venue'
        />

        <Button
          type='submit'
          floated='right'
          positive
          content='Submit'
          loading={submitting}
        />
        <Button
          onClick={() => history.push('/activities')}
          type='button'
          floated='right'
          content='Cancel'
        />
      </Form>
    </Segment>
  );
};

export default observer(ActivityForm);
