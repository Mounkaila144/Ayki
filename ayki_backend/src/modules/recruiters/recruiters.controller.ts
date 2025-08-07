import { Controller, Get, Post, Delete, Param, Query, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { RecruitersService } from './recruiters.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('recruiters')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('recruiters')
export class RecruitersController {
  constructor(private readonly recruitersService: RecruitersService) {}

  @Get('me/stats')
  @ApiOperation({ summary: 'Get recruiter statistics' })
  async getMyStats(@Request() req: any) {
    return this.recruitersService.getRecruiterStats(req.user.id);
  }
}

@ApiTags('candidates')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('candidates')
export class CandidatesController {
  constructor(private readonly recruitersService: RecruitersService) {}

  @Get('search')
  @ApiOperation({ summary: 'Search candidates with filters' })
  @ApiQuery({ name: 'search', required: false, description: 'Search term' })
  @ApiQuery({ name: 'location', required: false, description: 'Location filter' })
  @ApiQuery({ name: 'skills', required: false, description: 'Skills filter (comma-separated)' })
  @ApiQuery({ name: 'experience', required: false, description: 'Experience level' })
  @ApiQuery({ name: 'sortBy', required: false, enum: ['match', 'name', 'experience', 'lastActive'] })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  @ApiQuery({ name: 'page', required: false, type: 'number' })
  @ApiQuery({ name: 'limit', required: false, type: 'number' })
  async searchCandidates(@Query() query: any, @Request() req: any) {
    return this.recruitersService.searchCandidates(req.user.id, query);
  }

  @Get('bookmarked')
  @ApiOperation({ summary: 'Get bookmarked candidates' })
  async getBookmarkedCandidates(@Request() req: any) {
    return this.recruitersService.getBookmarkedCandidates(req.user.id);
  }

  @Post(':candidateId/bookmark')
  @ApiOperation({ summary: 'Toggle candidate bookmark' })
  async toggleBookmark(@Param('candidateId') candidateId: string, @Request() req: any) {
    return this.recruitersService.toggleCandidateBookmark(req.user.id, candidateId);
  }

  @Get(':candidateId')
  @ApiOperation({ summary: 'Get candidate profile' })
  async getCandidateProfile(@Param('candidateId') candidateId: string, @Request() req: any) {
    return this.recruitersService.getCandidateProfile(req.user.id, candidateId);
  }
}