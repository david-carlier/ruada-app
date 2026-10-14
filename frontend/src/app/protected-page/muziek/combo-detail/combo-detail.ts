import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { ComboService } from '../combo.service';
import { SongService } from '../song.service';
import { AuthService } from '../../../auth/auth.service';
import { Song } from '../song.model';

@Component({
  selector: 'app-combo-detail',
  imports: [AsyncPipe],
  templateUrl: './combo-detail.html',
})
export class ComboDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private comboService = inject(ComboService);
  private songService = inject(SongService);
  readonly isAdmin$ = inject(AuthService).isAdmin$;

  combo = signal<{ id: string; title: string; songIds: string[] } | undefined>(undefined);
  deleting = signal(false);

  songs = computed<Song[]>(() => {
    const c = this.combo();
    if (!c) return [];
    return c.songIds
      .map(id => this.songService.getById(id))
      .filter((s): s is Song => !!s);
  });

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    if (this.songService.songs().length === 0) await this.songService.loadSongs();
    const fromSignal = this.comboService.getById(id);
    this.combo.set(fromSignal ?? await this.comboService.fetchById(id));
  }

  edit() {
    this.router.navigate(['/muziek/combo', this.combo()!.id, 'edit']);
  }

  async delete() {
    this.deleting.set(true);
    await this.comboService.deleteCombo(this.combo()!.id);
    this.router.navigate(['/muziek']);
  }

  back() {
    this.router.navigate(['/muziek']);
  }

  print() {
    window.print();
  }
}
