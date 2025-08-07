import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { getDatabaseConfig } from './config/database.config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProfilesModule } from './modules/profiles/profiles.module';
import { CompaniesModule } from './modules/companies/companies.module';
import { SkillsModule } from './modules/skills/skills.module';
import { JobsModule } from './modules/jobs/jobs.module';
import { ApplicationsModule } from './modules/applications/applications.module';
import { BookmarksModule } from './modules/bookmarks/bookmarks.module';
import { InterviewsModule } from './modules/interviews/interviews.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { AdminModule } from './modules/admin/admin.module';
import { RecruitersModule } from './modules/recruiters/recruiters.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getDatabaseConfig,
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    ProfilesModule,
    CompaniesModule,
    SkillsModule,
    JobsModule,
    ApplicationsModule,
    BookmarksModule,
    InterviewsModule,
    DocumentsModule,
    NotificationsModule,
    AnalyticsModule,
    AdminModule,
    RecruitersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
