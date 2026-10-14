import { Injectable, signal, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Combo } from './combo.model';
import { firstValueFrom } from 'rxjs';

const API_URL = 'https://api.ruada.nl/combos';

@Injectable({ providedIn: 'root' })
export class ComboService {
  private http = inject(HttpClient);
  private oidc = inject(OidcSecurityService);

  readonly combos = signal<Combo[]>([]);

  private async getHeaders(): Promise<HttpHeaders> {
    const token = await firstValueFrom(this.oidc.getIdToken());
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  async loadCombos(): Promise<void> {
    const headers = await this.getHeaders();
    const items = await firstValueFrom(this.http.get<Combo[]>(API_URL, { headers }));
    this.combos.set(items);
  }

  getById(id: string): Combo | undefined {
    return this.combos().find(c => c.id === id);
  }

  async fetchById(id: string): Promise<Combo | undefined> {
    const headers = await this.getHeaders();
    const items = await firstValueFrom(this.http.get<Combo[]>(API_URL, { headers }));
    this.combos.set(items);
    return items.find(c => c.id === id);
  }

  async createCombo(combo: Omit<Combo, 'id'>): Promise<void> {
    const headers = await this.getHeaders();
    await firstValueFrom(this.http.post(API_URL, combo, { headers }));
    await this.loadCombos();
  }

  async updateCombo(id: string, combo: Omit<Combo, 'id'>): Promise<void> {
    const headers = await this.getHeaders();
    await firstValueFrom(this.http.put(`${API_URL}/${id}`, combo, { headers }));
    await this.loadCombos();
  }

  async deleteCombo(id: string): Promise<void> {
    const headers = await this.getHeaders();
    await firstValueFrom(this.http.delete(`${API_URL}/${id}`, { headers }));
    this.combos.update(combos => combos.filter(c => c.id !== id));
  }
}
