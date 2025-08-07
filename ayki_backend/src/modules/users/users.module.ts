import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from '../../entities/user.entity';
import { UserProfile } from '../../entities/user-profile.entity';
import { Company } from '../../entities/company.entity';
import { Experience } from '../../entities/experience.entity';
import { Education } from '../../entities/education.entity';
import { UserSkill } from '../../entities/user-skill.entity';
import { Skill } from '../../entities/skill.entity';
import { Document } from '../../entities/document.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      UserProfile,
      Company,
      Experience,
      Education,
      UserSkill,
      Skill,
      Document,
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
