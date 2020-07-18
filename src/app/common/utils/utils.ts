import { IActivity, IAttendee } from "../../models/activity";
import { IUser } from "../../models/user";

export const combineDateAndTime = (date: Date, time: Date) => {
    const [dateString] = date.toISOString().split('T');
    const [, timeString] = time.toISOString().split('T');

    return new Date(dateString + 'T' + timeString);
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
