import React, { Fragment, useContext, useEffect } from 'react';
import { Segment, Header, Form, Button, Comment } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { Form as FinalForm, Field } from 'react-final-form';
import { observer } from 'mobx-react-lite';
import { formatDistance } from 'date-fns';

import { RootStoreContext } from '../../../app/stores/rootStore';
import TextAreaInput from '../../../app/common/form/TextAreaInput';

const ActivityDetailedChat = () => {
  const {
    createHubConnection,
    stopHubConnection,
    addComment,
    activity
  } = useContext(RootStoreContext).activityStore;

  useEffect(() => {
    createHubConnection(activity!.id);

    return stopHubConnection;
  }, [createHubConnection, stopHubConnection, activity])

  return (
    <Fragment>
      <Segment
        textAlign='center'
        attached='top'
        inverted
        color='teal'
        style={{ border: 'none' }}
      >
        <Header>Chat about this event</Header>
      </Segment>
      <Segment attached>
        <Comment.Group>
          {
            activity?.comments.map(({ id, body, image, username, displayName, createdAt }) => (
              <Comment key={id}>
                <Comment.Avatar src={image || '/assets/user.png'} />
                <Comment.Content>
                  <Comment.Author as={Link} to={`/profile/${username}`}>
                    {displayName}
                  </Comment.Author>

                  <Comment.Metadata>
                    <div>{formatDistance(createdAt, new Date())}</div>
                  </Comment.Metadata>

                  <Comment.Text>{body}</Comment.Text>
                </Comment.Content>
              </Comment>
            ))
          }

          <FinalForm
            onSubmit={addComment}
            render={({ handleSubmit, submitting, form }) => (
              <Form onSubmit={() => handleSubmit()!.then(() => form.reset())}>
                <Field
                  name='body'
                  component={TextAreaInput}
                  rows={2}
                  placeholder='Add your comment'
                />
                <Button
                  loading={submitting}
                  content='Add Reply'
                  labelPosition='left'
                  icon='edit'
                  primary
                />
              </Form>
            )}
          />
        </Comment.Group>
      </Segment>
    </Fragment>
  )
}

export default observer(ActivityDetailedChat);
