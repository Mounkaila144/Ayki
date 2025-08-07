import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bookmark } from '../../entities/bookmark.entity';

@Injectable()
export class BookmarksService {
  constructor(
    @InjectRepository(Bookmark)
    private bookmarkRepository: Repository<Bookmark>,
  ) {}

  create(createBookmarkDto: any) {
    const bookmark = this.bookmarkRepository.create(createBookmarkDto);
    return this.bookmarkRepository.save(bookmark);
  }

  findAll() {
    return this.bookmarkRepository.find({
      relations: ['recruiter', 'candidate']
    });
  }

  findOne(id: string) {
    return this.bookmarkRepository.findOne({
      where: { id },
      relations: ['recruiter', 'candidate']
    });
  }

  update(id: string, updateBookmarkDto: any) {
    return this.bookmarkRepository.update(id, updateBookmarkDto);
  }

  remove(id: string) {
    return this.bookmarkRepository.delete(id);
  }
}