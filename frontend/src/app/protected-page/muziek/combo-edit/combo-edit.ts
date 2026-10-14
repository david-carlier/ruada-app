import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ComboService } from '../combo.service';
import { SongService } from '../song.service';
import { Song } from '../song.model';

@Component({
  selector: 'app-combo-edit',
  imports: [FormsModule],
  templateUrl: './combo-edit.html',
})
export class ComboEditComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private comboService = inject(ComboService);
  private songService = inject(SongService);

  saving = signal(false);
  private id = '';
  title = '';
  selectedIds = signal<string[]>([]);

  get songs(): Song[] {
    return this.songService.songs();
  }

  async ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id')!;
    if (this.songService.songs().length === 0) await this.songService.loadSongs();
    const combo = this.comboService.getById(this.id) ?? await this.comboService.fetchById(this.id);
    if (!combo) { this.router.navigate(['/muziek']); return; }
    this.title = combo.title;
    this.selectedIds.set([...combo.songIds]);
  }

  isSelected(id: string): boolean {
    return this.selectedIds().includes(id);
  }

  toggleSong(id: string) {
    this.selectedIds.update(ids =>
      ids.includes(id) ? ids.filter(i => i !== id) : [...ids, id]
    );
  }

  moveUp(index: number) {
    const ids = [...this.selectedIds()];
    if (index === 0) return;
    [ids[index - 1], ids[index]] = [ids[index], ids[index - 1]];
    this.selectedIds.set(ids);
  }

  moveDown(index: number) {
    const ids = [...this.selectedIds()];
    if (index === ids.length - 1) return;
    [ids[index], ids[index + 1]] = [ids[index + 1], ids[index]];
    this.selectedIds.set(ids);
  }

  songTitle(id: string): string {
    return this.songService.getById(id)?.title ?? id;
  }

  async save() {
    if (!this.title || this.selectedIds().length === 0) return;
    this.saving.set(true);
    await this.comboService.updateCombo(this.id, { title: this.title, songIds: this.selectedIds() });
    this.saving.set(false);
    this.router.navigate(['/muziek/combo', this.id]);
  }

  cancel() {
    this.router.navigate(['/muziek/combo', this.id]);
  }
}
