import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { LocationService } from '../../core/services/location.service';
import { EventCategoryService } from '../../core/services/event-category.service';
import { EventService } from '../../core/services/event.service';
import { IEventCategory } from '../../core/models/event-category.model';
import { CommonModule } from '@angular/common';
import { ILocation } from '../../core/models/location.model';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss'],
})
export class EventFormComponent implements OnInit {
  isEdit = false;
  form!: FormGroup;
  // message modal state
  showMessageModal = false;
  modalTitle = '';
  modalMessage = '';

  // method to open modal
  openMessageModal(title: string, msg: string) {
    this.modalTitle = title;
    this.modalMessage = msg;
    this.showMessageModal = true;
  }

  // method to close modal
  closeMessageModal() {
    this.showMessageModal = false;
    this.modalTitle = '';
    this.modalMessage = '';
    // Optional: navigate to /events
    this.router.navigate(['/events']);
  }

  locations: ILocation[] = [];
  eventCategories: IEventCategory[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private locationService: LocationService,
    private eventCategoryService: EventCategoryService,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    this.isEdit = !!this.route.snapshot.paramMap.get('eventId');

    this.form = this.fb.group({
      name: ['', Validators.required],
      locationId: ['', Validators.required],
      description: ['', Validators.required],
      categoryName: ['', Validators.required],
      scope: [1, Validators.required],
      status: ['', Validators.required],
      startDateTime: ['', Validators.required],
      endDateTime: ['', Validators.required],
      imageUrl: ['']
    });

    // load locations & event categories
    this.locationService.getAllLocations().subscribe({
      next: (locs) => (this.locations = locs),
      error: (err) => console.error('Error fetching locations', err)
    });
    this.eventCategoryService.getAllCategories().subscribe({
      next: (cats) => (this.eventCategories = cats),
      error: (err) => console.error('Error fetching categories', err)
    });

    if (this.isEdit) {
      const eventId = this.route.snapshot.paramMap.get('eventId')!;
      this.eventService.getEventById(eventId).subscribe({
        next: (event) => {
          // Patch the form. event.startDateTime & event.endDateTime are strings.
          this.form.patchValue({
            name: event.name,
            locationId: event.locationId,
            description: event.description,
            categoryName: event.categoryName,
            scope: event.scope,
            status: event.status,
            startDateTime: this.convertToDateTimeLocal(event.startDateTime),
            endDateTime: this.convertToDateTimeLocal(event.endDateTime),
            imageUrl: event.imageUrl
          });
        },
        error: () => alert('Could not load event details.')
      });
    }
  }

  // If the stored date is "2024-01-10T10:30:00Z" or "2024-01-10T10:30:00"
  // slice(0,16) => "2024-01-10T10:30" for <input type="datetime-local">
  private convertToDateTimeLocal(dateStr: string): string {
    if (!dateStr) return '';
    // Safeguard against strings shorter than 16
    return dateStr.length >= 16 ? dateStr.slice(0, 16) : dateStr;
  }

  // CREATE
  saveEvent(): void {
    if (this.form.invalid) return;
    // pass string values for start/end times
    const eventRequest = {
      ...this.form.value 
      // e.g. startDateTime: "2025-01-10T14:30"
      // endDateTime:   "2025-01-10T16:00"
    };

    this.eventService.createEvent(eventRequest).subscribe({
      next: () => {
        this.openMessageModal('Success', 'Event created successfully!');
        this.router.navigate(['/events']);
      },
      error: () => {
        this.openMessageModal('Error', 'Failed to create event.');
      }
    });
  }

  // UPDATE
  updateEvent(): void {
    if (this.form.invalid) return;

    const eventId = this.route.snapshot.paramMap.get('eventId')!;
    const eventRequest = {
      ...this.form.value,
      id: eventId
    };

    this.eventService.updateEvent(eventId, eventRequest).subscribe({
      next: () => {
        this.openMessageModal('Success', 'Event updated successfully!');
        this.router.navigate(['/events']);
      },
      error: () => {
        this.openMessageModal('Error', 'Failed to update event.');
      }
    });
  }

  cancelEvent(): void {
    this.router.navigate(['/events']);
  }
}
