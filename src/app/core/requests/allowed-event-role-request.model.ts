import { EventRole } from '../enums/event-role.enum';

export interface AllowedEventRoleRequest {
  eventId: string;      
  eventRole: EventRole; 
  canSubscribe: boolean;
}
