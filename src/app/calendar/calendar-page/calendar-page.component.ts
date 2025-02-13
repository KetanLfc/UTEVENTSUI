import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FullCalendarModule, FullCalendarComponent } from '@fullcalendar/angular';
import { CalendarOptions, EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { EventService } from '../../core/services/event.service';
import { UserEventService } from '../../core/services/user-event.service';
import { AuthService } from '../../core/services/auth.service';
import { IEvent } from '../../core/models/event.model';
import { RSVPStatus } from '../../core/enums/rsvp-status.enum';
import { IUserEvent } from '../../core/models/user-event.model';

@Component({
  selector: 'app-calendar-page',
  standalone: true,
  imports: [CommonModule, FormsModule, FullCalendarModule],
  templateUrl: './calendar-page.component.html',
  styleUrls: ['./calendar-page.component.scss']
})
export class CalendarPageComponent implements OnInit {

  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;

  // For date search
  searchDate: string = '';

  // Calendar config
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth'
    },
    // eventClick callback
    eventClick: this.handleEventClick.bind(this),
  };

  // For the modal
  showEventModal = false;
  selectedEvent: IEvent | null = null;
  userRsvp: RSVPStatus | null = null; // store the user's RSVP status for this event

  // enum reference for template
  RSVPStatus = RSVPStatus;

  constructor(
    private eventService: EventService,
    private userEventService: UserEventService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadEventsFromBackend();
  }

  // Load events from .NET back-end
  loadEventsFromBackend(): void {
    this.eventService.getEvents().subscribe({
      next: (allEvents) => {
        // Map each IEvent to FullCalendar's event format
        const mapped = allEvents.map(ev => ({
          id: ev.id, // store the event's ID so we know which to fetch
          title: ev.name,
          start: ev.startDateTime,
          end: ev.endDateTime,
          allDay: true
        }));
        // put them into the calendar
        this.calendarOptions.events = mapped;
      },
      error: (err) => console.error('Failed to load events for calendar', err)
    });
  }

  // user clicks on a date in the date search
  onDateSearch(): void {
    if (!this.searchDate) return;
    const calendarApi = this.calendarComponent.getApi();
    calendarApi.gotoDate(this.searchDate); // e.g. '2025-02-14'
  }

  // ========== EVENT CLICK ========== //
  async handleEventClick(arg: EventClickArg) {
    // 'arg.event.id' is the event's ID we set in 'mapped = allEvents.map(...)'
    const eventId = arg.event.id;
    if (!eventId) return;

    try {
      // 1) Fetch the event details from the server
      const evt = await this.eventService.getEventById(eventId).toPromise();
      if (!evt) return;

      this.selectedEvent = evt;

      // 2) If user is logged in, fetch user's RSVP for this event
      if (this.isLoggedIn()) {
        const userId = this.authService.getUserId();
        if (userId) {
          // fetch all RSVPs for user
          const userEvents: IUserEvent[] = await this.userEventService.getAllUserEventsForUser(userId).toPromise() ?? [];


          // find the RSVP for 'eventId'
          const match = userEvents.find(ue => ue.eventId === evt.id);
          this.userRsvp = match ? match.rsvpStatus : null;
        }
      } else {
        this.userRsvp = null;
      }

      // 3) show the modal
      this.showEventModal = true;
    } catch (error) {
      console.error('Error loading event details', error);
    }
  }

  // close the modal
  closeEventModal() {
    this.showEventModal = false;
    this.selectedEvent = null;
    this.userRsvp = null;
  }

  // ========== RSVP LOGIC ========== //
  onRsvp(eventId: string, status: RSVPStatus) {
    if (!this.isLoggedIn()) {
      // you can show an error or do nothing
      return;
    }

    const userId = this.authService.getUserId();
    if (!userId) return;

    // if we have no existing RSVP, do add. Otherwise do update
    if (!this.userRsvp) {
      // POST => userEventService.addUserEvent(...)
      const newRsvp: IUserEvent = {
        userId: userId,
        eventId: eventId,
        eventRole: 'Participant', // default role
        rsvpStatus: status
      };
      this.userEventService.addUserEvent(newRsvp).subscribe({
        next: () => {
          this.userRsvp = status; // update local UI
        },
        error: (err) => console.error('Could not add RSVP', err)
      });
    } else {
      // we have an existing RSVP => do PUT => updateUserEventStatus
      this.userEventService.updateUserEventStatus(userId, eventId, status).subscribe({
        next: () => {
          this.userRsvp = status; // update local UI
        },
        error: (err) => console.error('Could not update RSVP', err)
      });
    }
  }

  // convenience
  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
}
