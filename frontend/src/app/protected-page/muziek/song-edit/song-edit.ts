import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SongService } from '../song.service';
import { SONG_GENRES, SongGenre } from '../song.model';

@Component({
  selector: 'app-song-edit',
  imports: [FormsModule],
  templateUrl: './song-edit.html',
})
export class SongEditComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private songService = inject(SongService);

  saving = signal(false);
  readonly genreOptions = Object.entries(SONG_GENRES) as [SongGenre, string][];
  private id = '';

  form = {
    title: '',
    artist: '',
    genre: 'muneira' as SongGenre,
    spotify: '',
    youtube: '',
    lyrics: '',
  };

  async ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id')!;
    const song = this.songService.getById(this.id) ?? await this.songService.fetchById(this.id);
    if (!song) { this.router.navigate(['/muziek']); return; }
    this.form = {
      title: song.title,
      artist: song.artist ?? '',
      genre: song.genre,
      spotify: song.spotify ?? '',
      youtube: song.youtube ?? '',
      lyrics: song.lyrics ?? '',
    };
  }

  async save() {
    if (!this.form.title) return;
    this.saving.set(true);
    await this.songService.updateSong(this.id, {
      title: this.form.title,
      artist: this.form.artist || undefined,
      genre: this.form.genre,
      spotify: this.form.spotify || undefined,
      youtube: this.form.youtube || undefined,
      lyrics: this.form.lyrics || undefined,
    });
    this.saving.set(false);
    this.router.navigate(['/muziek', this.id]);
  }

  cancel() {
    this.router.navigate(['/muziek', this.id]);
  }
}
