export interface Wallpaper {
  id: string;
  title: string;
  category: '1970-an' | 'Trippy' | 'Psychedelic';
  url: string;
  author: string;
}

export type Page = 'home' | 'gallery' | 'settings' | 'about';
