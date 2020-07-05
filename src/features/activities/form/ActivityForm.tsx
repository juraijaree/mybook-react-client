import React, { useState, FormEvent, useContext } from 'react';
import { Segment, Form, Button } from 'semantic-ui-react';
import { v4 as uuid } from 'uuid';
import { observer } from 'mobx-react-lite';

import { IActivity } from '../../../app/models/activity';
import ActivityStore from '../../../app/stores/activityStore'

interface IProps {
  activity: IActivity;
}

const ActivityForm: React.FC<IProps> = ({ activity: initialFormState }) => {
  const { createActivity, editActivity, submitting, cancelFormOpen } = useContext(ActivityStore);

  const initializeForm = () => {
    if (initialFormState) {
      return initialFormState;
    }
    else {
      return {
        id: '',
        title: '',
        category: '',
        description: '',
        date: '',
        city: '',
        venue: ''
      };
    }
  };

  const [activity, setActivity] = useState<IActivity>(initializeForm);

  const handleInputChange = (e: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setActivity({
      ...activity,
      [e.currentTarget.name]: e.currentTarget.value
    });
  };

  const handleSubmit = () => {
    if (activity.id) {
      editActivity(activity);
    }
    else {
      createActivity({ ...activity, id: uuid() });
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
          onClick={cancelFormOpen}
          type='button'
          floated='right'
          content='Cancel'
        />
      </Form>
    </Segment>
  );
};

export default observer(ActivityForm);
