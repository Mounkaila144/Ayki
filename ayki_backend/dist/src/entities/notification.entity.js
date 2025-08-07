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
exports.Notification = exports.NotificationChannel = exports.NotificationPriority = exports.NotificationType = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
var NotificationType;
(function (NotificationType) {
    NotificationType["APPLICATION_RECEIVED"] = "application_received";
    NotificationType["APPLICATION_STATUS_CHANGED"] = "application_status_changed";
    NotificationType["INTERVIEW_SCHEDULED"] = "interview_scheduled";
    NotificationType["INTERVIEW_REMINDER"] = "interview_reminder";
    NotificationType["INTERVIEW_CANCELLED"] = "interview_cancelled";
    NotificationType["PROFILE_VIEWED"] = "profile_viewed";
    NotificationType["NEW_JOB_MATCH"] = "new_job_match";
    NotificationType["JOB_OFFER_EXPIRED"] = "job_offer_expired";
    NotificationType["BOOKMARK_ADDED"] = "bookmark_added";
    NotificationType["MESSAGE_RECEIVED"] = "message_received";
    NotificationType["SYSTEM_UPDATE"] = "system_update";
    NotificationType["ACCOUNT_SECURITY"] = "account_security";
    NotificationType["PAYMENT_REMINDER"] = "payment_reminder";
    NotificationType["SUBSCRIPTION_EXPIRED"] = "subscription_expired";
    NotificationType["OTHER"] = "other";
})(NotificationType || (exports.NotificationType = NotificationType = {}));
var NotificationPriority;
(function (NotificationPriority) {
    NotificationPriority["LOW"] = "low";
    NotificationPriority["NORMAL"] = "normal";
    NotificationPriority["HIGH"] = "high";
    NotificationPriority["URGENT"] = "urgent";
})(NotificationPriority || (exports.NotificationPriority = NotificationPriority = {}));
var NotificationChannel;
(function (NotificationChannel) {
    NotificationChannel["IN_APP"] = "in_app";
    NotificationChannel["EMAIL"] = "email";
    NotificationChannel["SMS"] = "sms";
    NotificationChannel["PUSH"] = "push";
})(NotificationChannel || (exports.NotificationChannel = NotificationChannel = {}));
let Notification = class Notification {
    id;
    type;
    title;
    message;
    priority;
    channel;
    data;
    actionUrl;
    actionText;
    icon;
    imageUrl;
    isRead;
    isArchived;
    readAt;
    archivedAt;
    scheduledAt;
    sentAt;
    expiresAt;
    isActive;
    createdAt;
    updatedAt;
    user;
    userId;
    sender;
    senderId;
};
exports.Notification = Notification;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Notification.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: NotificationType,
    }),
    __metadata("design:type", String)
], Notification.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], Notification.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Notification.prototype, "message", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: NotificationPriority,
        default: NotificationPriority.NORMAL,
    }),
    __metadata("design:type", String)
], Notification.prototype, "priority", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: NotificationChannel,
        default: NotificationChannel.IN_APP,
    }),
    __metadata("design:type", String)
], Notification.prototype, "channel", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], Notification.prototype, "data", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 500, nullable: true }),
    __metadata("design:type", String)
], Notification.prototype, "actionUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], Notification.prototype, "actionText", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], Notification.prototype, "icon", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 500, nullable: true }),
    __metadata("design:type", String)
], Notification.prototype, "imageUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Notification.prototype, "isRead", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Notification.prototype, "isArchived", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Notification.prototype, "readAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Notification.prototype, "archivedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Notification.prototype, "scheduledAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Notification.prototype, "sentAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Notification.prototype, "expiresAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], Notification.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Notification.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Notification.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.notifications, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", user_entity_1.User)
], Notification.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Notification.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", user_entity_1.User)
], Notification.prototype, "sender", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Notification.prototype, "senderId", void 0);
exports.Notification = Notification = __decorate([
    (0, typeorm_1.Entity)('notifications')
], Notification);
//# sourceMappingURL=notification.entity.js.map