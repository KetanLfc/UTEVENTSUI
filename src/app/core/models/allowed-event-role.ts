import { EventRole } from '../enums/event-role.enum';

export interface IAllowedEventRole {
  eventId: string;
  eventRole: EventRole;
  canSubscribe: boolean;
}
