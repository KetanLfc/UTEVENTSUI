import { EventStatus } from '../enums/event-status.enum';
import { EventScope } from '../enums/event-scope.enum';

export interface EventRequest {
  id?: string;
  name: string;
  categoryName: string;
  startDateTime: string;
  endDateTime: string;
  description: string;
  status: EventStatus;
  scope: EventScope;
  locationId: string;
  imageUrl: string;  
}
