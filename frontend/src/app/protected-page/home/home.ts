import { Component, inject, computed, OnInit } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { RouterLink } from '@angular/router';
import { NgStyle } from '@angular/common';
import { EventService } from '../events/event.service';
import { EVENT_COLORS } from '../events/event.model';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';

@Component({
  selector: 'app-home',
  imports: [RouterLink, NgStyle],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeComponent implements OnInit {
  private oidc = inject(OidcSecurityService);
  private eventService = inject(EventService);
  readonly EVENT_COLORS = EVENT_COLORS;

  name = toSignal(this.oidc.getUserData().pipe(map(u => u?.given_name ?? u?.name ?? 'daar')));

  ngOnInit() {
    this.eventService.loadEvents();
  }

  upcomingEvents = computed(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return this.eventService.events()
      .filter(e => e.date >= today)
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 3);
  });

  nextEvent = computed(() => this.upcomingEvents()[0]);

  formatDate(date: Date): string {
    return format(date, 'EEEE d MMMM yyyy', { locale: nl });
  }
}
