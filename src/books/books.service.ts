import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createBookDto: CreateBookDto) {
    return this.prisma.book.create({
      data: {
        title: createBookDto.title,
        author: createBookDto.author,
        ...(createBookDto.publishedAt && {
          publishedAt: new Date(createBookDto.publishedAt),
        }),
        coverUrl: createBookDto.coverUrl ?? null,
      },
      include: {
        reviews: true,
      },
    });
  }

  async findAll() {
    return this.prisma.book.findMany({
      include: {
        reviews: true,
      },
    });
  }

  async findOne(id: number) {
    const book = await this.prisma.book.findUnique({
      where: { id },
      include: {
        reviews: true,
      },
    });

    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    return book;
  }

  async update(id: number, updateBookDto: UpdateBookDto) {
    await this.findOne(id);

    return this.prisma.book.update({
      where: { id },
      data: {
        ...(updateBookDto.title !== undefined && {
          title: updateBookDto.title,
        }),
        ...(updateBookDto.author !== undefined && {
          author: updateBookDto.author,
        }),
        ...(updateBookDto.publishedAt !== undefined && {
          publishedAt: new Date(updateBookDto.publishedAt),
        }),
        ...(updateBookDto.coverUrl !== undefined && {
          coverUrl: updateBookDto.coverUrl,
        }),
      },
      include: {
        reviews: true,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.book.delete({
      where: { id },
      include: {
        reviews: true,
      },
    });
  }

  async addReview(bookId: number, createReviewDto: CreateReviewDto) {
    await this.findOne(bookId);

    const rating = Number(createReviewDto.rating);
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      throw new BadRequestException('Rating must be an integer between 1 and 5');
    }

    return this.prisma.review.create({
      data: {
        rating,
        content: createReviewDto.content,
        bookId,
      },
    });
  }
}
