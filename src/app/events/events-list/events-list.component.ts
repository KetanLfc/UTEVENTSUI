import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EventService } from '../../core/services/event.service';
import { UserEventService } from '../../core/services/user-event.service';
import { AuthService } from '../../core/services/auth.service';
import { IEvent } from '../../core/models/event.model';
import { IUserEvent } from '../../core/models/user-event.model';
import { RSVPStatus } from '../../core/enums/rsvp-status.enum';

@Component({
  selector: 'app-events-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './events-list.component.html',
  styleUrls: ['./events-list.component.scss']
})
export class EventsListComponent implements OnInit {
  events: IEvent[] = [];
  userRsvpMap: { [eventId: string]: RSVPStatus } = {};
  errorMessage: string | null = null;
  RSVPStatus = RSVPStatus;

  constructor(
    private eventService: EventService,
    private userEventService: UserEventService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadEvents();
    this.loadUserRsvps();
  }

  loadEvents(): void {
    this.eventService.getEvents().subscribe({
      next: (data) => {
        this.events = data;
      },
      error: (err) => {
        console.error('Failed to load events', err);
        this.errorMessage = 'Could not fetch events. Please try again later.';
      }
    });
  }

  loadUserRsvps(): void {
    if (!this.authService.isLoggedIn()) return;
    const userId = this.authService.getUserId();
    if (!userId) {
      this.errorMessage = 'Could not determine user ID. Please log in again.';
    } else {
    this.userEventService.getAllUserEventsForUser(userId).subscribe({
      next: (userEvents: IUserEvent[]) => {
        userEvents.forEach(ue => {
          this.userRsvpMap[ue.eventId] = ue.rsvpStatus;
        });
      },
      error: (err) => console.error('Failed to load user RSVPs', err)
    });
  }
}

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  onAddEvent(): void {
    // Navigate to "Add Event" form (admin only)
    this.router.navigate(['/admin/add-event']);
  }

  onEditEvent(eventId: string): void {
    // Admin: navigate to "Add Event" form in edit form
    this.router.navigate(['/admin/edit-event', eventId]);
  }

showDeleteModal = false;
deleteEventId: string | null = null;

openDeleteModal(eventId: string) {
  if (!this.isAdmin()) return;
  this.deleteEventId = eventId;
  this.showDeleteModal = true;
}

cancelDelete() {
  this.showDeleteModal = false;
  this.deleteEventId = null;
}

confirmDelete() {
  if (!this.deleteEventId) return;
  this.eventService.deleteEvent(this.deleteEventId).subscribe({
    next: () => {
      this.events = this.events.filter(e => e.id !== this.deleteEventId);
      this.showDeleteModal = false;
      this.deleteEventId = null;
    },
    error: (err) => {
      console.error('Delete event failed', err);
      this.errorMessage = 'Could not delete event.';
    }
  });
}

onRsvp(eventId: string, status: RSVPStatus): void {
  // 1) Check if user is logged in
  if (!this.authService.isLoggedIn()) {
    this.errorMessage = 'Please log in to RSVP.';
    return;
  }

  // 2) Get userId from the token
  const userId = this.authService.getUserId();
  if (!userId) {
    this.errorMessage = 'Could not determine your user ID. Please log in again.';
    return;
  }

  // 3) Check whether there's already an RSVP in userRsvpMap for this event
  const existingRsvp = this.userRsvpMap[eventId];

  // 4) If no existing RSVP, do a POST => userEventService.addUserEvent(...)
  if (!existingRsvp) {
    const newRsvp: IUserEvent = {
      userId: userId,
      eventId: eventId,
      eventRole: 'Participant', //default 
      rsvpStatus: status
    };
    this.userEventService.addUserEvent(newRsvp).subscribe({
      next: () => {
        // Update UI
        this.userRsvpMap[eventId] = status;
      },
      error: (err) => {
        console.error('Failed to add RSVP', err);
        this.errorMessage = 'Could not set RSVP. Try again later.';
      }
    });
  } 
  // 5) Otherwise we already have an RSVP => do a PUT => userEventService.updateUserEventStatus(...)
  else {
    this.userEventService.updateUserEventStatus(userId, eventId, status).subscribe({
      next: () => {
        // Update UI
        this.userRsvpMap[eventId] = status;
      },
      error: (err) => {
        console.error('Failed to update RSVP', err);
        this.errorMessage = 'Could not update RSVP. Try again later.';
      }
    });
  }
}

  determineEventImage(event: IEvent): string {
    return event.imageUrl ? event.imageUrl : 'assets/default-event.jpg';
  }
}
