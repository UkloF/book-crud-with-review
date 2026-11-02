export interface Review {
  id: number;
  rating: number;
  content: string;
  bookId: number;
}

export interface Book {
  id: number;
  title: string;
  author: string;
  publishedAt: Date;
  coverUrl: string | null;
  reviews?: Review[];
}
