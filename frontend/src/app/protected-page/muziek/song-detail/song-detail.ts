import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AsyncPipe } from '@angular/common';
import { SongService } from '../song.service';
import { AuthService } from '../../../auth/auth.service';
import { Song, SONG_GENRES } from '../song.model';

@Component({
  selector: 'app-song-detail',
  imports: [AsyncPipe],
  templateUrl: './song-detail.html',
})
export class SongDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private sanitizer = inject(DomSanitizer);
  private songService = inject(SongService);
  readonly isAdmin$ = inject(AuthService).isAdmin$;
  readonly SONG_GENRES = SONG_GENRES;

  song = signal<Song | undefined>(undefined);
  deleting = signal(false);

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    const fromSignal = this.songService.getById(id);
    this.song.set(fromSignal ?? await this.songService.fetchById(id));
  }

  youtubeEmbedUrl(url: string): SafeResourceUrl {
    const id = url.match(/(?:v=|youtu\.be\/)([^&?/]+)/)?.[1];
    return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${id}`);
  }

  edit() {
    this.router.navigate(['/muziek', this.song()!.id, 'edit']);
  }

  async delete() {
    this.deleting.set(true);
    await this.songService.deleteSong(this.song()!.id);
    this.router.navigate(['/muziek']);
  }

  back() {
    this.router.navigate(['/muziek']);
  }

  print() {
    window.print();
  }
}
