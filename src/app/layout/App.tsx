import React, { useContext, useEffect } from 'react';
import { Container } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { Route, useLocation, Switch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import 'semantic-ui-css/semantic.min.css';

import NavBar from '../../features/nav/NavBar';
import ActivitiyDashboard from '../../features/activities/dashboard/ActivitiyDashboard';
import HomePage from '../../features/home/HomePage';
import ActivityForm from '../../features/activities/form/ActivityForm';
import ActivityDetails from '../../features/activities/details/ActivityDetails';
import LoginForm from '../../features/user/LoginForm';
import NotFound from './NotFound';
import { RootStoreContext } from '../stores/rootStore';
import LoadingComponent from './LoadingComponent';
import ModalContainer from '../common/modals/ModalContainer';
import ProfilePage from '../../features/profiles/ProfilePage';

const App: React.FC = () => {
  const location = useLocation();
  const rootStore = useContext(RootStoreContext);
  const { appLoaded, setAppLoaded, token } = rootStore.commonStore;
  const { getUser } = rootStore.userStore;

  useEffect(() => {
    if (token) {
      getUser().finally(setAppLoaded)
    }
    else {
      setAppLoaded()
    }
  }, [getUser, setAppLoaded, token])

  if (!appLoaded) return <LoadingComponent content='Loading app...' />

  return (
    <>
      <ModalContainer />
      <ToastContainer position='top-center' />

      <Route path='/' component={HomePage} exact />
      <Route
        path='/(.+)'
        render={() => (
          <>
            <NavBar />

            <Container style={{ marginTop: '7em' }}>
              <Switch>
                <Route path='/activities' component={ActivitiyDashboard} exact />
                <Route path='/activities/:id' component={ActivityDetails} />
                <Route
                  key={location.key}
                  path={['/create-activity', '/edit-activity/:id']}
                  component={ActivityForm}
                />
                <Route path='/login' component={LoginForm} />
                <Route path='/profile/:username' component={ProfilePage} />

                <Route component={NotFound} />
              </Switch>
            </Container>
          </>
        )}
      />
    </>
  );
};

export default observer(App);
