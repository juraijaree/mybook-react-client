import { observable, action, computed, runInAction, reaction, toJS } from 'mobx';
import { SyntheticEvent } from 'react';
import { toast } from 'react-toastify';
import { HubConnection, HubConnectionBuilder, LogLevel, HubConnectionState } from '@microsoft/signalr';

import { IActivity } from '../models/activity';
import agent from '../api/agent';
import { history } from '../..';
import { RootStore } from './rootStore';
import { setActivityProps, createAttendee } from '../common/utils/utils';

const LIMIT = 2;
export default class ActivityStore {
  rootStore: RootStore;

  constructor (rootStore: RootStore) {
    this.rootStore = rootStore;

    reaction(
      () => this.predicate.keys(),
      () => {
        this.page = 0;
        this.activityRegistry.clear();
        this.loadActivities();
      }
    )
  }

  @observable activityRegistry = new Map();
  @observable activity: IActivity | null = null;
  @observable activityCount = 0;
  @observable page = 0;
  @observable predicate = new Map();

  @observable loadingInitial = false;
  @observable loading = false;
  @observable submitting = false;
  @observable target = '';

  @observable.ref hubConnection: HubConnection | null = null;

  @action setPredicate = (predicate: string, value: string | Date) => {
    this.predicate.clear();

    if (predicate !== 'all') {
      this.predicate.set(predicate, value);
    }
  }

  @computed get axiosParams () {
    const params = new URLSearchParams();

    params.append('limit', String(LIMIT));
    params.append('offset', `${this.page ? this.page * LIMIT : 0}`);

    this.predicate.forEach((value, key) => {
      if (key === 'startDate') {
        params.append(key, value.toISOString());
      }
      else {
        params.append(key, value);
      }
    })

    return params;
  }

  @computed get totalPages () {
    return Math.ceil(this.activityCount / LIMIT);
  }

  @action setPage = (page: number) => {
    this.page = page;
  }

  @action createHubConnection = (activityId: string) => {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(process.env.REACT_APP_API_CHAT_URL!, {
        accessTokenFactory: () => this.rootStore.commonStore.token!
      })
      .configureLogging(LogLevel.Information)
      .build();

    this.hubConnection
      .start()
      .then(() => console.log(this.hubConnection!.state))
      .then(() => {
        console.log('Attempting to join group');

        if (this.hubConnection!.state === HubConnectionState.Connected) {
          this.hubConnection!.invoke('AddToGroup', activityId);
        }
      })
      .catch(error => console.log('Error establishing connection: ', error));

    this.hubConnection.on('ReceiveComment', comment => {
      runInAction(() => {
        this.activity!.comments.push(comment);
      })
    })

    this.hubConnection.on('Send', toast.info);
  };

  @action stopHubConnection = () => {
    this.hubConnection!.invoke('RemoveFromGroup', this.activity!.id)
      .then(this.hubConnection!.stop)
      .then(() => console.log('Connection stopped'))
      .catch(console.log);
  };

  @action addComment = async (values: any) => {
    values.activityId = this.activity!.id;

    try {
      await this.hubConnection!.invoke('SendComment', values)
    }
    catch (error) {
      console.log(error);
    }
  };

  @computed get activitiesByDate () {
    return this.groupActivitiesByDate(Array.from(this.activityRegistry.values()));
  }

  groupActivitiesByDate (activities: IActivity[]) {
    const sortedActivities = activities.sort((a, b) => (
      a.date.getTime() - b.date.getTime()
    ));

    return Object.entries(sortedActivities.reduce((activities, activity) => {
      const [date] = activity.date.toISOString().split('T')

      activities[date] = activities[date] ? [...activities[date], activity] : [activity];

      return activities;
    }, {} as { [key: string]: IActivity[] }));
  }

  // ============ FETCH ACTIVITIES ===============

  @action loadActivities = async () => {
    this.loadingInitial = true;

    try {
      const activitiesEnvelope = await agent.Activities.list(this.axiosParams);
      const { activities, activityCount } = activitiesEnvelope;

      runInAction('loading activities', () => {
        activities.forEach(activity => {
          const activityWithProps = setActivityProps(activity, this.rootStore.userStore.user!);

          this.activityRegistry.set(activity.id, activityWithProps);
        });

        this.activityCount = activityCount;
        this.loadingInitial = false;
      });
    }
    catch (error) {
      runInAction('load activities error', () => {
        this.loadingInitial = false;
      });

      console.log(error);
    }
  };

  // ============ FETCH ACTIVITY ===============

  @action loadActivity = async (id: string) => {
    let activity = this.getActivity(id);

    if (activity) {
      this.activity = activity;

      return toJS(activity);
    }
    else {
      this.loadingInitial = true;

      try {
        activity = await agent.Activities.details(id);

        runInAction('getting activity', () => {
          const activityWithProps = setActivityProps(activity, this.rootStore.userStore.user!);

          this.activity = activityWithProps;

          this.activityRegistry.set(activity.id, activityWithProps);

          this.loadingInitial = false;
        })

        return activity;
      }
      catch (error) {
        runInAction('get activity error', () => {
          this.activity = activity;

          this.loadingInitial = false;
        });

        console.log(error);
      }
    }
  }

  @action clearActivity = () => {
    this.activity = null;
  }

  getActivity = (id: string) => {
    return this.activityRegistry.get(id);
  }

  // ============ CREATE ACTIVITY ===============

  @action createActivity = async (activity: IActivity) => {
    this.submitting = true;

    try {
      await agent.Activities.create(activity);

      const attendee = createAttendee(this.rootStore.userStore.user!);
      attendee.isHost = true;

      activity.attendees = [attendee];
      activity.isHost = true;
      activity.comments = [];

      runInAction('creating activity', () => {
        this.activityRegistry.set(activity.id, activity);

        this.submitting = false;
      });

      history.push(`/activities/${activity.id}`);
    }
    catch (error) {
      runInAction('create activity error', () => {
        this.submitting = false;
      });

      toast.error('Problem submitting data!');

      console.log(error.response);
    }
  };

  // ============ EDIT ACTIVITY ===============

  @action editActivity = async (activity: IActivity) => {
    this.submitting = true;

    try {
      await agent.Activities.update(activity);

      runInAction('editing activity', () => {
        this.activityRegistry.set(activity.id, activity);
        this.activity = activity;

        this.submitting = false;
      });

      history.push(`/activities/${activity.id}`);
    }
    catch (error) {
      runInAction('edit activity error', () => {
        this.submitting = false;
      });

      toast.error('Problem submitting data!');

      console.log(error);
    }
  }

  // ============ DELETE ACTIVITY ===============

  @action deleteActivity = async (e: SyntheticEvent<HTMLButtonElement>, id: string) => {
    this.submitting = true;

    this.target = e.currentTarget.name;

    try {
      await agent.Activities.delete(id);

      runInAction('deleting activity', () => {
        this.activityRegistry.delete(id);

        this.submitting = false;
        this.target = '';
      });
    }
    catch (error) {
      runInAction('delete activity error', () => {
        this.submitting = false;
        this.target = '';
      });

      console.log(error);
    }
  }

  // ============ ATTENDEE ===============

  @action attendActivity = async () => {
    const attendee = createAttendee(this.rootStore.userStore.user!);

    this.loading = true;

    try {
      await agent.Activities.attend(this.activity!.id);

      runInAction('signing up to activity', () => {
        if (this.activity) {
          this.activity.attendees.push(attendee);
          this.activity.isGoing = true;
          this.activityRegistry.set(this.activity.id, this.activity);
          this.loading = false;
        }
      })
    }
    catch (error) {
      runInAction('signing up to activity error', () => {
        this.loading = false;
      })

      toast.error('Problem signing up to activity');
    }
  }

  @action cancelAttendance = async () => {
    this.loading = true;

    try {
      await agent.Activities.attend(this.activity!.id);

      runInAction('cancelling attendance', () => {
        if (this.activity) {
          this.activity.attendees = this.activity.attendees.filter(attendee => (
            attendee.username !== this.rootStore.userStore.user!.username
          ));

          this.activity.isGoing = false;
          this.activityRegistry.set(this.activity.id, this.activity);
          this.loading = false;
        }
      })
    }
    catch (error) {
      runInAction('cancelling attendance error', () => {
        this.loading = false;
      })

      toast.error('Problem cancelling attendance');
    }
  }
}
