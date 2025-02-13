import { EventStatus } from '../enums/event-status.enum';
import { EventScope } from '../enums/event-scope.enum';
import { ILocation } from './location.model';
import { IAllowedEventRole } from '../models/allowed-event-role';
import { IUser } from './user.model';

export interface IEvent {
  id: string;
  name: string;
  categoryName: string;
  startDateTime: string;
  endDateTime: string;
  description: string;
  status: EventStatus;
  scope: EventScope;
  imageUrl?: string;
  locationId: string;
  location?: ILocation; 
  allowedEventRoles?: IAllowedEventRole[];
  users?: IUser[];
}
