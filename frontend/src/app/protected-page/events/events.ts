import { Component, computed, inject, signal, OnInit } from '@angular/core';
import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  eachDayOfInterval, addMonths, subMonths, addWeeks, subWeeks,
  isSameMonth, isSameDay, isToday, format,
} from 'date-fns';
import { nl } from 'date-fns/locale';
import { CalendarEvent, EVENT_COLORS, EventColor } from './event.model';

import { NgClass, NgStyle, AsyncPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { EventService } from './event.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-events',
  imports: [NgClass, NgStyle, AsyncPipe, RouterLink],
  templateUrl: './events.html',
  styleUrl: './events.css',
})
export class EventsComponent implements OnInit {
  private router = inject(Router);
  private eventService = inject(EventService);
  private authService = inject(AuthService);
  readonly isAdmin$ = this.authService.isAdmin$;
  readonly colorOptions = Object.entries(EVENT_COLORS) as [EventColor, { bg: string; text: string; label: string }][];

  view = signal<'month' | 'week'>('month');
  currentDate = signal(new Date());

  ngOnInit() {
    this.eventService.loadEvents();
  }

  readonly events = this.eventService.events;

  weekDays = ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo'];

  monthDays = computed(() => {
    const start = startOfWeek(startOfMonth(this.currentDate()), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(this.currentDate()), { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  });

  weekDates = computed(() => {
    const start = startOfWeek(this.currentDate(), { weekStartsOn: 1 });
    const end = endOfWeek(this.currentDate(), { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  });

  title = computed(() => {
    if (this.view() === 'month') {
      return format(this.currentDate(), 'MMMM yyyy', { locale: nl });
    }
    const days = this.weekDates();
    return `${format(days[0], 'd MMM', { locale: nl })} – ${format(days[6], 'd MMM yyyy', { locale: nl })}`;
  });

  eventsForDay(day: Date): CalendarEvent[] {
    return this.events()
      .filter(e => isSameDay(e.date, day))
      .sort((a, b) => {
        if (a.allDay && !b.allDay) return -1;
        if (!a.allDay && b.allDay) return 1;
        return (a.startTime ?? '').localeCompare(b.startTime ?? '');
      });
  }

  isCurrentMonth(day: Date): boolean {
    return isSameMonth(day, this.currentDate());
  }

  isToday(day: Date): boolean {
    return isToday(day);
  }

  prev() {
    this.currentDate.update(d => this.view() === 'month' ? subMonths(d, 1) : subWeeks(d, 1));
  }

  next() {
    this.currentDate.update(d => this.view() === 'month' ? addMonths(d, 1) : addWeeks(d, 1));
  }

  today() {
    this.currentDate.set(new Date());
  }

  openEvent(event: CalendarEvent) {
    this.router.navigate(['/events', event.id]);
  }

  formatDay(day: Date): string {
    return format(day, 'd');
  }

  formatWeekDay(day: Date): string {
    return format(day, 'EEE d MMM', { locale: nl });
  }

  colorStyle(color?: EventColor): Record<string, string> {
    const c = EVENT_COLORS[color ?? 'oefenen'] ?? EVENT_COLORS['oefenen'];
    return { 'background-color': c.bg, 'color': c.text };
  }
}
