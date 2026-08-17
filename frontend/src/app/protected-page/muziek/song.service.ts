import { Injectable, signal, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Song } from './song.model';
import { firstValueFrom } from 'rxjs';

const API_URL = 'https://bzwjgd1pn4.execute-api.eu-west-1.amazonaws.com/prod/songs';

@Injectable({ providedIn: 'root' })
export class SongService {
  private http = inject(HttpClient);
  private oidc = inject(OidcSecurityService);

  readonly songs = signal<Song[]>([]);

  private async getHeaders(): Promise<HttpHeaders> {
    const token = await firstValueFrom(this.oidc.getIdToken());
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  async loadSongs(): Promise<void> {
    const headers = await this.getHeaders();
    const items = await firstValueFrom(this.http.get<Song[]>(API_URL, { headers }));
    this.songs.set(items);
  }

  getById(id: string): Song | undefined {
    return this.songs().find(s => s.id === id);
  }

  async fetchById(id: string): Promise<Song | undefined> {
    const headers = await this.getHeaders();
    const items = await firstValueFrom(this.http.get<Song[]>(API_URL, { headers }));
    return items.find(s => s.id === id);
  }

  async createSong(song: Omit<Song, 'id'>): Promise<void> {
    const headers = await this.getHeaders();
    await firstValueFrom(this.http.post(API_URL, song, { headers }));
    await this.loadSongs();
  }

  async deleteSong(id: string): Promise<void> {
    const headers = await this.getHeaders();
    await firstValueFrom(this.http.delete(`${API_URL}/${id}`, { headers }));
    this.songs.update(songs => songs.filter(s => s.id !== id));
  }
}
