import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgStyle } from '@angular/common';
import { EventService } from '../event.service';
import { EVENT_COLORS, EventColor } from '../event.model';

@Component({
  selector: 'app-event-new',
  imports: [FormsModule, NgStyle],
  templateUrl: './event-new.html',
})
export class EventNewComponent {
  private router = inject(Router);
  private eventService = inject(EventService);

  saving = signal(false);
  readonly colorOptions = Object.entries(EVENT_COLORS) as [EventColor, { bg: string; text: string; label: string }][];

  form = {
    title: '',
    date: '',
    allDay: false,
    startTime: this.nextHour(),
    endTime: this.nextHour(1),
    color: 'oefenen' as EventColor,
    location: '',
    description: '',
  };

  private nextHour(offset = 0): string {
    const d = new Date();
    d.setHours(d.getHours() + 1 + offset, 0, 0, 0);
    return d.toTimeString().slice(0, 5);
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
    await this.eventService.createEvent({
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
    this.router.navigate(['/events']);
  }

  cancel() {
    this.router.navigate(['/events']);
  }
}
