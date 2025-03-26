export interface Book {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  rating: number;
  genre: string;
  publishYear?: number | null;
  description?: string;
}