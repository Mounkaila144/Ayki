import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ApplicationsService } from './applications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('applications')
@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  create(@Request() req: any, @Body() createApplicationDto: any) {
    return this.applicationsService.create(req.user.id, createApplicationDto);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.applicationsService.findAll();
  }

  @Get('me')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  getMyApplications(@Request() req: any) {
    return this.applicationsService.findByCandidate(req.user.id);
  }

  @Get('recruiter/me')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  getReceivedApplications(@Request() req: any) {
    return this.applicationsService.findByRecruiter(req.user.id);
  }

  @Get('job/:jobId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  getJobApplications(@Param('jobId') jobId: string) {
    return this.applicationsService.findByJobOffer(jobId);
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.applicationsService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  update(@Param('id') id: string, @Body() updateApplicationDto: any) {
    return this.applicationsService.update(id, updateApplicationDto);
  }

  @Patch(':id/status')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  updateStatus(@Request() req: any, @Param('id') id: string, @Body() body: { status: string }) {
    return this.applicationsService.updateStatus(req.user.id, id, body.status as any);
  }

  @Patch(':id/withdraw')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  withdraw(@Request() req: any, @Param('id') id: string) {
    return this.applicationsService.withdraw(req.user.id, id);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.applicationsService.remove(id);
  }
}