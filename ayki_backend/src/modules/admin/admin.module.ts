import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { SimpleAdminService } from './admin.service.simple';
import { AdminGuard } from '../../guards/admin.guard';
import { User } from '../../entities/user.entity';
import { UserProfile } from '../../entities/user-profile.entity';
import { Company } from '../../entities/company.entity';
import { JobOffer } from '../../entities/job-offer.entity';
import { Application } from '../../entities/application.entity';
import { Interview } from '../../entities/interview.entity';
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      UserProfile,
      Company,
      JobOffer,
      Application,
      Interview,
    ]),
    AuthModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [AdminController],
  providers: [SimpleAdminService, AdminGuard],
  exports: [SimpleAdminService],
})
export class AdminModule {}
