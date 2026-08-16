export type EventColor = 'oefenen' | 'optreden' | 'vergadering' | 'feestje' | 'verjaardag';

export const EVENT_COLORS: Record<EventColor, { bg: string; text: string; label: string }> = {
  oefenen:    { bg: '#a3c4f3', text: '#1e3a5f', label: 'Oefenen' },
  optreden:   { bg: '#ffcfd2', text: '#7f1d1d', label: 'Optreden' },
  vergadering:{ bg: '#98f5e1', text: '#064e3b', label: 'Vergadering' },
  feestje:    { bg: '#f1c0e8', text: '#6b21a8', label: 'Feestje' },
  verjaardag: { bg: '#b9fbc0', text: '#14532d', label: 'Verjaardag' },
};

export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  startTime?: string;
  endTime?: string;
  color?: EventColor;
  location?: string;
  allDay?: boolean;
}
