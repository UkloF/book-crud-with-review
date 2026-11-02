export class CreateBookDto {
  title!: string;
  author!: string;
  publishedAt?: Date | string;
  coverUrl?: string | null;
}
