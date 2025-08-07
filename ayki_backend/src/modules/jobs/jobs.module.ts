import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { JobOffer } from '../../entities/job-offer.entity';
import { JobOfferSkill } from '../../entities/job-offer-skill.entity';
import { Company } from '../../entities/company.entity';
import { User } from '../../entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([JobOffer, JobOfferSkill, Company, User])],
  controllers: [JobsController],
  providers: [JobsService],
  exports: [JobsService],
})
export class JobsModule {}
