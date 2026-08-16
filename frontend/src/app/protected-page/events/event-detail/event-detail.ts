import { Component, inject, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgStyle } from '@angular/common';
import { EventService } from '../event.service';
import { EVENT_COLORS } from '../event.model';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';

@Component({
  selector: 'app-event-detail',
  imports: [NgStyle],
  templateUrl: './event-detail.html',
})
export class EventDetailComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private eventService = inject(EventService);
  readonly EVENT_COLORS = EVENT_COLORS;

  event = computed(() => {
    const id = this.route.snapshot.paramMap.get('id')!;
    return this.eventService.getById(id);
  });

  formatDate(date: Date): string {
    return format(date, 'EEEE d MMMM yyyy', { locale: nl });
  }

  back() {
    this.router.navigate(['/events']);
  }
}
