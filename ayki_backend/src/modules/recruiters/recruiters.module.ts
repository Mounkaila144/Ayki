import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecruitersController, CandidatesController } from './recruiters.controller';
import { RecruitersService } from './recruiters.service';
import { User } from '../../entities/user.entity';
import { UserProfile } from '../../entities/user-profile.entity';
import { UserSkill } from '../../entities/user-skill.entity';
import { Skill } from '../../entities/skill.entity';
import { Experience } from '../../entities/experience.entity';
import { Education } from '../../entities/education.entity';
import { Application } from '../../entities/application.entity';
import { Bookmark } from '../../entities/bookmark.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      UserProfile,
      UserSkill,
      Skill,
      Experience,
      Education,
      Application,
      Bookmark,
    ]),
  ],
  controllers: [RecruitersController, CandidatesController],
  providers: [RecruitersService],
  exports: [RecruitersService],
})
export class RecruitersModule {}