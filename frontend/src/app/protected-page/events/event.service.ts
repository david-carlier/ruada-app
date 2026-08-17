import { Injectable, signal, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { CalendarEvent } from './event.model';
import { firstValueFrom } from 'rxjs';

const API_URL = 'https://bzwjgd1pn4.execute-api.eu-west-1.amazonaws.com/prod/events';

@Injectable({ providedIn: 'root' })
export class EventService {
  private http = inject(HttpClient);
  private oidc = inject(OidcSecurityService);

  readonly events = signal<CalendarEvent[]>([]);

  private async getHeaders(): Promise<HttpHeaders> {
    const token = await firstValueFrom(this.oidc.getIdToken());
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  loadEvents(): void {
    this.oidc.getIdToken().subscribe(token => {
      const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
      this.http.get<any[]>(API_URL, { headers }).subscribe(items => {
        this.events.set(items.map(i => ({
          id: i.id,
          title: i.title,
          date: new Date(i.date),
          startTime: i.startTime,
          endTime: i.endTime,
          color: i.color,
          location: i.location,
          allDay: i.allDay === true || i.allDay === 'true',
          description: i.description,
        })));
      });
    });
  }

  async createEvent(event: Omit<CalendarEvent, 'id'>): Promise<void> {
    const headers = await this.getHeaders();
    const body = {
      ...event,
      date: event.date.toISOString().split('T')[0],
    };
    await firstValueFrom(this.http.post(API_URL, body, { headers }));
    this.loadEvents();
  }

  getById(id: string): CalendarEvent | undefined {
    return this.events().find(e => e.id === id);
  }

  async fetchById(id: string): Promise<CalendarEvent | undefined> {
    const headers = await this.getHeaders();
    const items = await firstValueFrom(this.http.get<any[]>(API_URL, { headers }));
    const i = items.find(i => i.id === id);
    if (!i) return undefined;
    return {
      id: i.id,
      title: i.title,
      date: new Date(i.date),
      startTime: i.startTime,
      endTime: i.endTime,
      color: i.color,
      location: i.location,
      allDay: i.allDay === true || i.allDay === 'true',
      description: i.description,
    };
  }

  async deleteEvent(id: string): Promise<void> {
    const headers = await this.getHeaders();
    const event = this.getById(id);
    const date = event!.date.toISOString().split('T')[0];
    await firstValueFrom(this.http.delete(`${API_URL}/${id}/${date}`, { headers }));
    this.events.update(events => events.filter(e => e.id !== id));
  }
}
