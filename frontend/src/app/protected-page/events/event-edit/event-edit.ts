import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgStyle } from '@angular/common';
import { EventService } from '../event.service';
import { EVENT_COLORS, EventColor } from '../event.model';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-event-edit',
  imports: [FormsModule, NgStyle],
  templateUrl: './event-edit.html',
})
export class EventEditComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private eventService = inject(EventService);

  saving = signal(false);
  loaded = signal(false);
  readonly colorOptions = Object.entries(EVENT_COLORS) as [EventColor, { bg: string; text: string; label: string }][];

  id = '';
  form = {
    title: '',
    date: '',
    allDay: false,
    startTime: '',
    endTime: '',
    color: 'oefenen' as EventColor,
    location: '',
    description: '',
  };

  async ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id')!;
    const event = this.eventService.getById(this.id) ?? await this.eventService.fetchById(this.id);
    if (!event) { this.router.navigate(['/events']); return; }
    this.form = {
      title: event.title,
      date: event.date.toISOString().split('T')[0],
      allDay: event.allDay ?? false,
      startTime: event.startTime ?? '',
      endTime: event.endTime ?? '',
      color: event.color ?? 'oefenen',
      location: event.location ?? '',
      description: event.description ?? '',
    };
    this.loaded.set(true);
  }

  onStartTimeChange() {
    if (!this.form.startTime) return;
    const [h, m] = this.form.startTime.split(':').map(Number);
    const end = new Date();
    end.setHours(h + 1, m, 0, 0);
    this.form.endTime = end.toTimeString().slice(0, 5);
  }

  async save() {
    if (!this.form.title || !this.form.date) return;
    this.saving.set(true);
    await this.eventService.updateEvent(this.id, {
      title: this.form.title,
      date: new Date(this.form.date),
      startTime: this.form.allDay ? undefined : this.form.startTime || undefined,
      endTime: this.form.allDay ? undefined : this.form.endTime || undefined,
      color: this.form.color,
      location: this.form.location || undefined,
      allDay: this.form.allDay || undefined,
      description: this.form.description || undefined,
    });
    this.saving.set(false);
    this.router.navigate(['/events', this.id]);
  }

  cancel() {
    this.router.navigate(['/events', this.id]);
  }
}
