import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Request, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JobsService } from './jobs.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';

@ApiTags('jobs')
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  create(@Request() req: any, @Body() createJobDto: CreateJobDto) {
    return this.jobsService.create(req.user.id, createJobDto);
  }

  @Get('my-jobs')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  getMyJobs(@Request() req: any, @Query() query: any) {
    return this.jobsService.findByRecruiter(req.user.id, query);
  }

  @Get()
  findAll(@Query() query: any) {
    return this.jobsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobsService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  update(@Request() req: any, @Param('id') id: string, @Body() updateJobDto: UpdateJobDto) {
    return this.jobsService.update(req.user.id, id, updateJobDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  remove(@Request() req: any, @Param('id') id: string) {
    return this.jobsService.remove(req.user.id, id);
  }
}