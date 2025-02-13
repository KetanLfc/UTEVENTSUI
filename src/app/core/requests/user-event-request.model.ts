import { RSVPStatus } from '../enums/rsvp-status.enum';

export interface UserEventRequest {
  userId: string;    
  eventId: string;   
  rsvpStatus: RSVPStatus;
}
