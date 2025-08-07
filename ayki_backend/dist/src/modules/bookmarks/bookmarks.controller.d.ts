import { BookmarksService } from './bookmarks.service';
export declare class BookmarksController {
    private readonly bookmarksService;
    constructor(bookmarksService: BookmarksService);
    create(createBookmarkDto: any): Promise<import("../../entities").Bookmark[]>;
    findAll(): Promise<import("../../entities").Bookmark[]>;
    findOne(id: string): Promise<import("../../entities").Bookmark | null>;
    update(id: string, updateBookmarkDto: any): Promise<import("typeorm").UpdateResult>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}
