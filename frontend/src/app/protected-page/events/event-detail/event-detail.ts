import { Component, inject, computed, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgStyle, AsyncPipe } from '@angular/common';
import { EventService } from '../event.service';
import { AuthService } from '../../../auth/auth.service';
import { EVENT_COLORS, CalendarEvent } from '../event.model';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';

@Component({
  selector: 'app-event-detail',
  imports: [NgStyle, AsyncPipe],
  templateUrl: './event-detail.html',
})
export class EventDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private eventService = inject(EventService);
  readonly isAdmin$ = inject(AuthService).isAdmin$;
  readonly EVENT_COLORS = EVENT_COLORS;

  event = signal<CalendarEvent | undefined>(undefined);

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    const fromSignal = this.eventService.getById(id);
    if (fromSignal) {
      this.event.set(fromSignal);
    } else {
      this.event.set(await this.eventService.fetchById(id));
    }
  }

  formatDate(date: Date): string {
    return format(date, 'EEEE d MMMM yyyy', { locale: nl });
  }

  deleting = signal(false);

  async delete() {
    const id = this.event()!.id;
    this.deleting.set(true);
    await this.eventService.deleteEvent(id);
    this.router.navigate(['/events']);
  }

  back() {
    this.router.navigate(['/events']);
  }
}
