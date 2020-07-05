import React, { useContext } from 'react';
import { Menu, Container, Button } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite'

import ActivityStore from '../../app/stores/activityStore';

const NavBar: React.FC = () => {
  const { openCreateForm } = useContext(ActivityStore);

  return (
    <Menu inverted fixed='top'>
      <Container>
        <Menu.Item header>
          <img src='/assets/logo.png' alt='logo' style={{ marginRight: 8 }} />
          myBook
        </Menu.Item>

        <Menu.Item name='Activities' />

        <Menu.Item name='home'>
          <Button
            onClick={openCreateForm}
            positive
            content='Create Activity'
          />
        </Menu.Item>
      </Container>
    </Menu>
  );
};

export default observer(NavBar);
