import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Analytics } from '../../entities/analytics.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Analytics)
    private analyticsRepository: Repository<Analytics>,
  ) {}

  create(createAnalyticsDto: any) {
    const analytics = this.analyticsRepository.create(createAnalyticsDto);
    return this.analyticsRepository.save(analytics);
  }

  findAll() {
    return this.analyticsRepository.find();
  }

  findOne(id: string) {
    return this.analyticsRepository.findOne({ where: { id } });
  }

  update(id: string, updateAnalyticsDto: any) {
    return this.analyticsRepository.update(id, updateAnalyticsDto);
  }

  remove(id: string) {
    return this.analyticsRepository.delete(id);
  }
}