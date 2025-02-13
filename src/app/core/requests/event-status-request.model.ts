import { EventStatus } from '../enums/event-status.enum';

export interface EventStatusRequest {
  id: string;          
  status: EventStatus; 
}
