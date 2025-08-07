import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../../entities/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  create(createNotificationDto: any) {
    const notification = this.notificationRepository.create(createNotificationDto);
    return this.notificationRepository.save(notification);
  }

  findAll() {
    return this.notificationRepository.find({
      relations: ['user', 'sender'],
      order: { createdAt: 'DESC' }
    });
  }

  findOne(id: string) {
    return this.notificationRepository.findOne({
      where: { id },
      relations: ['user', 'sender']
    });
  }

  async markAsRead(id: string) {
    await this.notificationRepository.update(id, { isRead: true, readAt: new Date() });
    return this.findOne(id);
  }

  update(id: string, updateNotificationDto: any) {
    return this.notificationRepository.update(id, updateNotificationDto);
  }

  remove(id: string) {
    return this.notificationRepository.delete(id);
  }
}