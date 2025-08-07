"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bookmark = exports.BookmarkType = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
var BookmarkType;
(function (BookmarkType) {
    BookmarkType["CANDIDATE"] = "candidate";
    BookmarkType["JOB_OFFER"] = "job_offer";
    BookmarkType["COMPANY"] = "company";
})(BookmarkType || (exports.BookmarkType = BookmarkType = {}));
let Bookmark = class Bookmark {
    id;
    type;
    notes;
    tags;
    priority;
    isPrivate;
    metadata;
    createdAt;
    updatedAt;
    recruiter;
    recruiterId;
    candidate;
    candidateId;
};
exports.Bookmark = Bookmark;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Bookmark.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: BookmarkType,
        default: BookmarkType.CANDIDATE,
    }),
    __metadata("design:type", String)
], Bookmark.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Bookmark.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'simple-array', nullable: true }),
    __metadata("design:type", Array)
], Bookmark.prototype, "tags", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Bookmark.prototype, "priority", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Bookmark.prototype, "isPrivate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], Bookmark.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Bookmark.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Bookmark.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.bookmarks, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", user_entity_1.User)
], Bookmark.prototype, "recruiter", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Bookmark.prototype, "recruiterId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.bookmarkedBy, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", user_entity_1.User)
], Bookmark.prototype, "candidate", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Bookmark.prototype, "candidateId", void 0);
exports.Bookmark = Bookmark = __decorate([
    (0, typeorm_1.Entity)('bookmarks'),
    (0, typeorm_1.Unique)(['recruiterId', 'candidateId'])
], Bookmark);
//# sourceMappingURL=bookmark.entity.js.map