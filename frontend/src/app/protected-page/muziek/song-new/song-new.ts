import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SongService } from '../song.service';
import { SONG_GENRES, SongGenre } from '../song.model';

@Component({
  selector: 'app-song-new',
  imports: [FormsModule],
  templateUrl: './song-new.html',
})
export class SongNewComponent {
  private router = inject(Router);
  private songService = inject(SongService);

  saving = signal(false);
  readonly genreOptions = Object.entries(SONG_GENRES) as [SongGenre, string][];

  form = {
    title: '',
    artist: '',
    genre: 'muneira' as SongGenre,
    spotify: '',
    youtube: '',
    lyrics: '',
  };

  async save() {
    if (!this.form.title) return;
    this.saving.set(true);
    await this.songService.createSong({
      title: this.form.title,
      artist: this.form.artist || undefined,
      genre: this.form.genre,
      spotify: this.form.spotify || undefined,
      youtube: this.form.youtube || undefined,
      lyrics: this.form.lyrics || undefined,
    });
    this.saving.set(false);
    this.router.navigate(['/muziek']);
  }

  cancel() {
    this.router.navigate(['/muziek']);
  }
}
