import { IActivity, IAttendee } from "../../models/activity";
import { IUser } from "../../models/user";

export const combineDateAndTime = (date: Date, time: Date) => {
    const timeString = time.getHours() + ':' + time.getMinutes() + ':00';

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dateString = `${year}-${month}-${day}`;

    return new Date(dateString + ' ' + timeString);
}

export const setActivityProps = (activity: IActivity, user: IUser) => {
  return {
    ...activity,
    date: new Date(activity.date),
    isGoing: activity.attendees.some(attendee => (
      attendee.username === user.username
    )),
    isHost: activity.attendees.some(attendee => (
      attendee.isHost && attendee.username === user.username
    ))
  }
}

export const createAttendee = ({ displayName, username, image }: IUser): IAttendee => {
  return {
    displayName,
    username,
    image: image!,
    isHost: false
  }
}
