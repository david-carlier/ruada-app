export type SongGenre = 'muneira' | 'rumba' | 'jota' | 'pasodoble' | 'maneo' | 'polka' | 'valse';

export const SONG_GENRES: Record<SongGenre, string> = {
  muneira: 'Muñeira',
  rumba: 'Rumba',
  jota: 'Jota',
  pasodoble: 'Pasodoble',
  maneo: 'Maneo',
  polka: 'Polka',
  valse: 'Valse',
};

export interface Song {
  id: string;
  title: string;
  artist?: string;
  genre: SongGenre;
  spotify?: string;
  youtube?: string;
  lyrics?: string;
}
