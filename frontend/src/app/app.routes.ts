import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { ProtectedPageComponent } from './protected-page/protected-page';
import { HomeComponent } from './protected-page/home/home';
import { EventsComponent } from './protected-page/events/events';
import { EventDetailComponent } from './protected-page/events/event-detail/event-detail';
import { EventNewComponent } from './protected-page/events/event-new/event-new';
import { EventEditComponent } from './protected-page/events/event-edit/event-edit';
import { MuziekComponent } from './protected-page/muziek/muziek';
import { SongDetailComponent } from './protected-page/muziek/song-detail/song-detail';
import { SongNewComponent } from './protected-page/muziek/song-new/song-new';
import { SongEditComponent } from './protected-page/muziek/song-edit/song-edit';
import { DocumentenComponent } from './protected-page/documenten/documenten';
import { authGuard, adminGuard } from './auth/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'unauthorized', redirectTo: '' },
  {
    path: '',
    component: ProtectedPageComponent,
    canActivate: [authGuard],
    children: [
      { path: '', component: HomeComponent },
      { path: 'events', component: EventsComponent },
      { path: 'events/new', component: EventNewComponent },
      { path: 'events/:id', component: EventDetailComponent },
      { path: 'events/:id/edit', component: EventEditComponent, canActivate: [adminGuard] },
      { path: 'muziek', component: MuziekComponent },
      { path: 'muziek/new', component: SongNewComponent },
      { path: 'muziek/:id', component: SongDetailComponent },
      { path: 'muziek/:id/edit', component: SongEditComponent },
      { path: 'documenten', component: DocumentenComponent },
    ],
  },
];
