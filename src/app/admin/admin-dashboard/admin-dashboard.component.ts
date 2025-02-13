import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IEvent } from '../../core/models/event.model';
import { IUser } from '../../core/models/user.model';
import { ILocation } from '../../core/models/location.model';
import { IGroup } from '../../core/models/group.model';
import { IEventCategory } from '../../core/models/event-category.model';
import { EventService } from '../../core/services/event.service';
import { UserService } from '../../core/services/user.service';
import { LocationService } from '../../core/services/location.service';
import { GroupService } from '../../core/services/group.service';
import { EventCategoryService } from '../../core/services/event-category.service';
import { EventRequest } from '../../core/requests/event-request.model';
import { EventStatus } from '../../core/enums/event-status.enum';
import { EventScope } from '../../core/enums/event-scope.enum';
import { IUserEvent } from '../../core/models/user-event.model';
import { UserEventService } from '../../core/services/user-event.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  activeTab: string = 'events';

  // Data arrays
  events: IEvent[] = [];
  users: IUser[] = [];
  public userEvents: IUserEvent[] = [];
  locations: ILocation[] = [];
  groups: IGroup[] = [];
  categories: IEventCategory[] = [];

  // Loading flags
  loadingEvents = false;
  loadingUsers = false;
  public loadingUserEvents = false;
  loadingLocations = false;
  loadingGroups = false;
  loadingCategories = false;

  // =========== DELETE MODAL ===========
  showDeleteModal = false;
  deleteEntityType: 'event'|'user'|'location'|'group'|'category'|null = null;
  deleteTargetId: string | null = null;

  // =========== EVENT MODAL ===========
  showEventModal = false;
  editingEvent = false;
  tempEvent: Partial<IEvent> = {};

  // =========== USER MODAL ===========
  showUserModal = false;
  editingUser = false;
  tempUser: Partial<IUser> = {};

  errorMessage: string | null = null;

  constructor(
    private eventService: EventService,
    private userService: UserService,
    private locationService: LocationService,
    private userEventService: UserEventService,
    private groupService: GroupService,
    private categoryService: EventCategoryService
  ) {}

  ngOnInit(): void {
    this.loadAllData();  // Single method to load everything
  }

  private loadAllData() {
    this.loadEvents();
    this.loadUsers();
    this.loadUserEvents();
    this.loadLocations();
    this.loadGroups();
    this.loadCategories();
  }

  // --------------------------
  // LOAD DATA
  // --------------------------

  loadEvents(): void {
    this.loadingEvents = true;
    this.eventService.getEvents().subscribe({
      next: (data) => {
        this.events = data;
      },
      error: (err) => {
        console.error('Error fetching events', err);
        this.errorMessage = 'Error fetching events.';
      },
      complete: () => {
        this.loadingEvents = false;
      }
    });
  }

  loadUsers(): void {
    this.loadingUsers = true;
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (err) => {
        console.error('Error fetching users', err);
        this.errorMessage = 'Error fetching users.';
      },
      complete: () => {
        this.loadingUsers = false;
      }
    });
  }

  private loadUserEvents(): void {
    this.loadingUserEvents = true;
    this.userEventService.getAllUserEvents().subscribe({
      next: (data) => {
        this.userEvents = data;
        this.loadingUserEvents = false;
      },
      error: (err) => {
        console.error('Error fetching user events', err);
        this.errorMessage = 'Error fetching user events.';
        this.loadingUserEvents = false;
      }
    });
  }
  

  loadLocations(): void {
    this.loadingLocations = true;
    this.locationService.getAllLocations().subscribe({
      next: (data) => {
        this.locations = data;
      },
      error: (err) => {
        console.error('Error fetching locations', err);
        this.errorMessage = 'Error fetching locations.';
      },
      complete: () => {
        this.loadingLocations = false;
      }
    });
  }

  loadGroups(): void {
    this.loadingGroups = true;
    this.groupService.getAllGroups().subscribe({
      next: (data) => {
        this.groups = data;
      },
      error: (err) => {
        console.error('Error fetching groups', err);
        this.errorMessage = 'Error fetching groups.';
      },
      complete: () => {
        this.loadingGroups = false;
      }
    });
  }

  loadCategories(): void {
    this.loadingCategories = true;
    this.categoryService.getAllCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => {
        console.error('Error fetching categories', err);
        this.errorMessage = 'Error fetching categories.';
      },
      complete: () => {
        this.loadingCategories = false;
      }
    });
  }

  // --------------------------
  // TABS
  // --------------------------
  setActiveTab(tabName: string) {
    this.activeTab = tabName;
  }

  getUserName(userId: string): string {
    const user = this.users.find(u => u.id === userId);
    return user ? user.name : userId; // fallback to ID if not found
  }
  
  getEventName(eventId: string): string {
    const event = this.events.find(e => e.id === eventId);
    return event ? event.name : eventId; 
  }  

  getEventRsvpCounts(eventId: string) {
    const relevant = this.userEvents.filter(ue => ue.eventId === eventId);
    const goingCount = relevant.filter(r => r.rsvpStatus === 'Going').length;
    const interestedCount = relevant.filter(r => r.rsvpStatus === 'Interested').length;
    const notGoingCount = relevant.filter(r => r.rsvpStatus === 'NotGoing').length;
    return { goingCount, interestedCount, notGoingCount };
  }  

  // --------------------------
  // DELETE MODAL
  // --------------------------
  openDeleteModal(entityType: 'event'|'user'|'location'|'group'|'category', id: string) {
    this.deleteEntityType = entityType;
    this.deleteTargetId = id;
    this.showDeleteModal = true;
  }

  cancelDelete() {
    this.showDeleteModal = false;
    this.deleteEntityType = null;
    this.deleteTargetId = null;
  }

  confirmDelete() {
    if (!this.deleteEntityType || !this.deleteTargetId) return;

    switch (this.deleteEntityType) {
      case 'event':
        this.eventService.deleteEvent(this.deleteTargetId).subscribe({
          next: () => {
            // (Re-Fetch) Instead of manual patch => reload events
            this.loadEvents();
          },
          error: (err) => {
            console.error('Delete event failed', err);
            this.errorMessage = 'Could not delete event.';
          }
        });
        break;

      case 'user':
        this.userService.deleteUser(this.deleteTargetId).subscribe({
          next: () => {
            // (Re-Fetch)
            this.loadUsers();
          },
          error: (err) => {
            console.error('Delete user failed', err);
            this.errorMessage = 'Could not delete user.';
          }
        });
        break;

      case 'location':
        this.locationService.deleteLocation(this.deleteTargetId).subscribe({
          next: () => {
            // (Re-Fetch)
            this.loadLocations();
          },
          error: (err) => {
            console.error('Delete location failed', err);
            this.errorMessage = 'Could not delete location.';
          }
        });
        break;

      case 'group':
        this.groupService.deleteGroup(this.deleteTargetId).subscribe({
          next: () => {
            // (Re-Fetch)
            this.loadGroups();
          },
          error: (err) => {
            console.error('Delete group failed', err);
            this.errorMessage = 'Could not delete group.';
          }
        });
        break;

      case 'category':
        this.categoryService.deleteCategory(this.deleteTargetId).subscribe({
          next: () => {
            // (Re-Fetch)
            this.loadCategories();
          },
          error: (err) => {
            console.error('Delete category failed', err);
            this.errorMessage = 'Could not delete category.';
          }
        });
        break;
    }

    this.cancelDelete(); // close modal
  }

  // --------------------------
  // ADD/EDIT EVENT MODAL
  // --------------------------

  openEventModal(eventObj: IEvent | null): void {
    this.editingEvent = !!eventObj;
    if (eventObj) {
      // Clone the event
      this.tempEvent = { ...eventObj };
    } else {
      // Creating new
      this.tempEvent = {
        name: '',
        description: '',
        locationId: '',
        categoryName: '',
        scope: 0,
        status: 0,
        startDateTime: '',
        endDateTime: '',
        imageUrl: ''
      };
    }
    this.showEventModal = true;
  }

  closeEventModal(): void {
    this.showEventModal = false;
    this.editingEvent = false;
    this.tempEvent = {};
  }

  saveEvent(): void {
    const request: EventRequest = {
      id: this.tempEvent.id ?? undefined,
      name: this.tempEvent.name ?? '',
      categoryName: this.tempEvent.categoryName ?? '',
      startDateTime: this.tempEvent.startDateTime ?? '',
      endDateTime: this.tempEvent.endDateTime ?? '',
      description: this.tempEvent.description ?? '',
      status: this.tempEvent.status ?? EventStatus.Draft,
      scope: this.tempEvent.scope ?? EventScope.UniversityWide,
      locationId: this.tempEvent.locationId ?? '',
      imageUrl: this.tempEvent.imageUrl ?? ''
    };

    if (this.editingEvent && request.id) {
      // Update existing
      this.eventService.updateEvent(request.id, request).subscribe({
        next: () => {
          // (Re-Fetch)
          this.loadEvents();
          this.closeEventModal();
        },
        error: (err) => {
          console.error('Update event failed', err);
          this.errorMessage = 'Could not update event.';
        }
      });
    } else {
      // Create new
      this.eventService.createEvent(request).subscribe({
        next: () => {
          // (Re-Fetch)
          this.loadEvents();
          this.closeEventModal();
        },
        error: (err) => {
          console.error('Create event failed', err);
          this.errorMessage = 'Could not create event.';
        }
      });
    }
  }

  // --------------------------
  // ADD/EDIT USER MODAL
  // --------------------------

  openUserModal(userObj: IUser | null): void {
    this.editingUser = !!userObj;
    if (userObj) {
      // editing existing user
      this.tempUser = { ...userObj };
    } else {
      // adding new
      this.tempUser = {
        name: '',
        email: '',
        roleId: '',
        roleName: 'Student',
        isActive: true
      };
    }
    this.showUserModal = true;
  }

  closeUserModal(): void {
    this.showUserModal = false;
    this.editingUser = false;
    this.tempUser = {};
  }

  saveUser(): void {
    if (this.editingUser && this.tempUser.id) {
      // Update user
      this.userService.updateUser(this.tempUser.id, {
        id: this.tempUser.id,
        email: this.tempUser.email ?? '',
        name: this.tempUser.name ?? '',
        password: '', // empty => no password change
        isActive: this.tempUser.isActive ?? true,
        roleId: this.tempUser.roleId ?? '',
        groupId: this.tempUser.groupId ?? undefined,
      }).subscribe({
        next: () => {
          // (Re-Fetch)
          this.loadUsers();
          this.closeUserModal();
        },
        error: (err) => {
          console.error('Update user failed', err);
          this.errorMessage = 'Could not update user.';
        }
      });
    } else {
      // create user => placeholder logic or call authService.register(...)
      alert('No "create user" endpoint here — placeholder logic!');
      this.closeUserModal();
    }
  }

  // --------------------------
  // ADD/EDIT GROUP MODAL
  // --------------------------
  showGroupModal = false;
  editingGroup = false;
  tempGroup: Partial<IGroup> = {};

  openGroupModal(groupObj: IGroup | null): void {
    this.editingGroup = !!groupObj;
    if (groupObj) {
      this.tempGroup = { ...groupObj };
    } else {
      this.tempGroup = {
        groupName: '',
        description: ''
      };
    }
    this.showGroupModal = true;
  }

  closeGroupModal(): void {
    this.showGroupModal = false;
    this.editingGroup = false;
    this.tempGroup = {};
  }

  saveGroup(): void {
    if (this.editingGroup && this.tempGroup.id) {
      // update
      this.groupService.updateGroup(this.tempGroup.id, {
        id: this.tempGroup.id,
        groupName: this.tempGroup.groupName ?? '',
        description: this.tempGroup.description ?? ''
      }).subscribe({
        next: () => {
          // (Re-Fetch)
          this.loadGroups();
          this.closeGroupModal();
        },
        error: (err) => {
          console.error('Update group failed', err);
          this.errorMessage = 'Could not update group.';
        }
      });
    } else {
      // create
      this.groupService.createGroup({
        groupName: this.tempGroup.groupName ?? '',
        description: this.tempGroup.description ?? ''
      }).subscribe({
        next: () => {
          // (Re-Fetch)
          this.loadGroups();
          this.closeGroupModal();
        },
        error: (err) => {
          console.error('Create group failed', err);
          this.errorMessage = 'Could not create group.';
        }
      });
    }
  }

  // --------------------------
  // ADD/EDIT LOCATION MODAL
  // --------------------------
  showLocationModal = false;
  editingLocation = false;
  tempLocation: Partial<ILocation> = {};

  openLocationModal(locObj: ILocation | null): void {
    this.editingLocation = !!locObj;
    if (locObj) {
      this.tempLocation = { ...locObj };
    } else {
      this.tempLocation = {
        name: '',
        address: '',
        country: ''
      };
    }
    this.showLocationModal = true;
  }

  closeLocationModal(): void {
    this.showLocationModal = false;
    this.editingLocation = false;
    this.tempLocation = {};
  }

  saveLocation(): void {
    if (this.editingLocation && this.tempLocation.locationId) {
      // update location
      this.locationService.updateLocation(this.tempLocation.locationId, {
        locationId: this.tempLocation.locationId,
        name: this.tempLocation.name ?? '',
        address: this.tempLocation.address ?? '',
        country: this.tempLocation.country ?? ''
      }).subscribe({
        next: () => {
          // (Re-Fetch)
          this.loadLocations();
          this.closeLocationModal();
        },
        error: (err) => {
          console.error('Update location failed', err);
          this.errorMessage = 'Could not update location.';
        }
      });
    } else {
      // create
      this.locationService.createLocation({
        name: this.tempLocation.name ?? '',
        address: this.tempLocation.address ?? '',
        country: this.tempLocation.country ?? ''
      }).subscribe({
        next: () => {
          // (Re-Fetch)
          this.loadLocations();
          this.closeLocationModal();
        },
        error: (err) => {
          console.error('Create location failed', err);
          this.errorMessage = 'Could not create location.';
        }
      });
    }
  }

  // --------------------------
  // ADD/EDIT CATEGORY MODAL
  // --------------------------
  showCategoryModal = false;
  editingCategory = false;
  tempCategory: Partial<IEventCategory> = {};

  openCategoryModal(catObj: IEventCategory | null): void {
    this.editingCategory = !!catObj;
    if (catObj) {
      this.tempCategory = { ...catObj };
    } else {
      this.tempCategory = {
        categoryName: ''
      };
    }
    this.showCategoryModal = true;
  }

  closeCategoryModal(): void {
    this.showCategoryModal = false;
    this.editingCategory = false;
    this.tempCategory = {};
  }

  saveCategory(): void {
    if (this.editingCategory && this.tempCategory.categoryName) {
      // update category by primary key = categoryName
      this.categoryService.updateCategory(
        this.tempCategory.categoryName,
        { categoryName: this.tempCategory.categoryName }
      ).subscribe({
        next: () => {
          // (Re-Fetch)
          this.loadCategories();
          this.closeCategoryModal();
        },
        error: (err) => {
          console.error('Update category failed', err);
          this.errorMessage = 'Could not update category.';
        }
      });
    } else {
      // create category
      this.categoryService.createCategory({
        categoryName: this.tempCategory.categoryName ?? ''
      }).subscribe({
        next: () => {
          // (Re-Fetch)
          this.loadCategories();
          this.closeCategoryModal();
        },
        error: (err) => {
          console.error('Create category failed', err);
          this.errorMessage = 'Could not create category.';
        }
      });
    }
  }

  // Example helper
  reduceGroupDescription(description: string): string {
    const lengthThreshold = 100;
    if (description.length > lengthThreshold) {
      return description.substring(0, lengthThreshold) + '...';
    }
    return description;
  }
}
