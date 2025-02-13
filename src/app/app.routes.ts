import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/admin.guard';

// Components
import { HomeComponent } from './homepage/home/home.component';
import { CalendarPageComponent } from './calendar/calendar-page/calendar-page.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { EventsListComponent } from './events/events-list/events-list.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { EventFormComponent } from './events/event-form/event-form.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent, 
  },
  {
    path: 'calendar',
    component: CalendarPageComponent,
  },
  {
    path: 'events',
    component: EventsListComponent,
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'admin/add-event',
    component: EventFormComponent,
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'admin/edit-event/:eventId',
    component: EventFormComponent,
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'admin',
    component: AdminDashboardComponent,
    canActivate: [AuthGuard, AdminGuard] // Must be logged in + role=Admin
  },
  {
    path: '**',
    redirectTo: ''
  }
];
