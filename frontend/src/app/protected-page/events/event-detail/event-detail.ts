import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgStyle, AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventService, Registration } from '../event.service';
import { AuthService } from '../../../auth/auth.service';
import { EVENT_COLORS, CalendarEvent } from '../event.model';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-event-detail',
  imports: [NgStyle, AsyncPipe, FormsModule],
  templateUrl: './event-detail.html',
})
export class EventDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private eventService = inject(EventService);
  private authService = inject(AuthService);
  readonly isAdmin$ = this.authService.isAdmin$;
  readonly EVENT_COLORS = EVENT_COLORS;

  event = signal<CalendarEvent | undefined>(undefined);
  registrations = signal<Registration[]>([]);
  currentUserId = signal<string | undefined>(undefined);
  children = signal<string[]>([]);
  selectedPerson = signal<string>('__self__');
  registering = signal(false);
  deleting = signal(false);

  get isRegistered(): boolean {
    const selected = this.selectedPerson();
    if (selected === '__self__') {
      return this.registrations().some(r => r.userId === this.currentUserId());
    }
    return this.registrations().some(r => r.userId === `child#${this.currentUserId()}#${selected}`);
  }

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    const fromSignal = this.eventService.getById(id);
    this.event.set(fromSignal ?? await this.eventService.fetchById(id));

    const [regs, userId, children] = await Promise.all([
      this.eventService.getRegistrations(id),
      firstValueFrom(this.authService.userId$),
      firstValueFrom(this.authService.children$),
    ]);
    this.registrations.set(regs);
    this.currentUserId.set(userId);
    this.children.set(children);
  }

  formatDate(date: Date): string {
    return format(date, 'EEEE d MMMM yyyy', { locale: nl });
  }

  async toggleRegistration() {
    const id = this.event()!.id;
    const selected = this.selectedPerson();
    const childName = selected === '__self__' ? undefined : selected;
    this.registering.set(true);
    if (this.isRegistered) {
      await this.eventService.unregister(id, childName);
      const userId = childName ? `child#${this.currentUserId()}#${childName}` : this.currentUserId();
      this.registrations.update(r => r.filter(x => x.userId !== userId));
    } else {
      await this.eventService.register(id, childName);
      const regs = await this.eventService.getRegistrations(id);
      this.registrations.set(regs);
    }
    this.registering.set(false);
  }

  async delete() {
    const ev = this.event()!;
    this.deleting.set(true);
    await this.eventService.deleteEvent(ev.id, ev.date.toISOString().split('T')[0]);
    this.router.navigate(['/events']);
  }

  edit() {
    this.router.navigate(['/events', this.event()!.id, 'edit']);
  }

  back() {
    this.router.navigate(['/events']);
  }
}
