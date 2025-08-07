import { Repository } from 'typeorm';
import { Bookmark } from '../../entities/bookmark.entity';
export declare class BookmarksService {
    private bookmarkRepository;
    constructor(bookmarkRepository: Repository<Bookmark>);
    create(createBookmarkDto: any): Promise<Bookmark[]>;
    findAll(): Promise<Bookmark[]>;
    findOne(id: string): Promise<Bookmark | null>;
    update(id: string, updateBookmarkDto: any): Promise<import("typeorm").UpdateResult>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}
