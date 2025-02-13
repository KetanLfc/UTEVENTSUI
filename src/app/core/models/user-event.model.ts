import { RSVPStatus } from '../enums/rsvp-status.enum';

export interface IUserEvent {
  userId: string;
  eventId: string;
  eventRole: string;
  rsvpStatus: RSVPStatus;
}
