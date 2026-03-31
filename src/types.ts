export interface Wallpaper {
  id: string;
  title: string;
  category: '1970s' | 'Trippy' | 'Psychedelic';
  url: string;
  author: string;
}

export type Page = 'home' | 'gallery' | 'settings' | 'about';
