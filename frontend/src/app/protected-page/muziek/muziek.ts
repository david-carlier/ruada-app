import { Component, inject, OnInit, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { SongService } from './song.service';
import { ComboService } from './combo.service';
import { AuthService } from '../../auth/auth.service';
import { SONG_GENRES, SongGenre, Song } from './song.model';

@Component({
  selector: 'app-muziek',
  imports: [RouterLink, AsyncPipe],
  templateUrl: './muziek.html',
})
export class MuziekComponent implements OnInit {
  readonly songService = inject(SongService);
  readonly comboService = inject(ComboService);
  readonly isAdmin$ = inject(AuthService).isAdmin$;
  readonly SONG_GENRES = SONG_GENRES;
  readonly genreOrder = Object.keys(SONG_GENRES) as SongGenre[];
  private router = inject(Router);

  readonly songsByGenre = computed(() => {
    const map = new Map<SongGenre | 'overig', Song[]>();
    for (const song of this.songService.songs()) {
      const key = song.genre ?? 'overig';
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(song);
    }
    return map;
  });

  genreLabel(key: SongGenre | 'overig'): string {
    return key === 'overig' ? 'Overig' : SONG_GENRES[key];
  }

  async ngOnInit() {
    await Promise.all([this.songService.loadSongs(), this.comboService.loadCombos()]);
  }

  open(id: string) {
    this.router.navigate(['/muziek', id]);
  }

  openCombo(id: string) {
    this.router.navigate(['/muziek/combo', id]);
  }
}
