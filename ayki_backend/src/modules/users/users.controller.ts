import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les utilisateurs' })
  async findAll(@Query() query: any) {
    return this.usersService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un utilisateur par ID' })
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  // Experience endpoints
  @Get('me/experiences')
  @ApiOperation({ summary: 'Récupérer les expériences de l\'utilisateur connecté' })
  async getUserExperiences(@Request() req) {
    return this.usersService.getUserExperiences(req.user.id);
  }

  @Post('me/experiences')
  @ApiOperation({ summary: 'Ajouter une expérience' })
  async addUserExperience(@Request() req, @Body() experienceData: any) {
    return this.usersService.addUserExperience(req.user.id, experienceData);
  }

  @Put('me/experiences/:id')
  @ApiOperation({ summary: 'Mettre à jour une expérience' })
  async updateUserExperience(
    @Request() req,
    @Param('id') experienceId: string,
    @Body() experienceData: any
  ) {
    return this.usersService.updateUserExperience(req.user.id, experienceId, experienceData);
  }

  @Delete('me/experiences/:id')
  @ApiOperation({ summary: 'Supprimer une expérience' })
  async deleteUserExperience(@Request() req, @Param('id') experienceId: string) {
    return this.usersService.deleteUserExperience(req.user.id, experienceId);
  }

  // Education endpoints
  @Get('me/education')
  @ApiOperation({ summary: 'Récupérer les formations de l\'utilisateur connecté' })
  async getUserEducation(@Request() req) {
    return this.usersService.getUserEducation(req.user.id);
  }

  @Post('me/education')
  @ApiOperation({ summary: 'Ajouter une formation' })
  async addUserEducation(@Request() req, @Body() educationData: any) {
    return this.usersService.addUserEducation(req.user.id, educationData);
  }

  @Put('me/education/:id')
  @ApiOperation({ summary: 'Mettre à jour une formation' })
  async updateUserEducation(
    @Request() req,
    @Param('id') educationId: string,
    @Body() educationData: any
  ) {
    return this.usersService.updateUserEducation(req.user.id, educationId, educationData);
  }

  @Delete('me/education/:id')
  @ApiOperation({ summary: 'Supprimer une formation' })
  async deleteUserEducation(@Request() req, @Param('id') educationId: string) {
    return this.usersService.deleteUserEducation(req.user.id, educationId);
  }

  // Skills endpoints
  @Get('me/skills')
  @ApiOperation({ summary: 'Récupérer les compétences de l\'utilisateur connecté' })
  async getUserSkills(@Request() req) {
    return this.usersService.getUserSkills(req.user.id);
  }

  @Get('skills')
  @ApiOperation({ summary: 'Récupérer toutes les compétences disponibles' })
  async getAllSkills() {
    return this.usersService.getAllSkills();
  }

  @Post('me/skills')
  @ApiOperation({ summary: 'Ajouter une compétence' })
  async addUserSkill(@Request() req, @Body() skillData: any) {
    return this.usersService.addUserSkill(req.user.id, skillData);
  }

  @Put('me/skills/:id')
  @ApiOperation({ summary: 'Mettre à jour une compétence' })
  async updateUserSkill(
    @Request() req,
    @Param('id') userSkillId: string,
    @Body() skillData: any
  ) {
    return this.usersService.updateUserSkill(req.user.id, userSkillId, skillData);
  }

  @Delete('me/skills/:id')
  @ApiOperation({ summary: 'Supprimer une compétence' })
  async deleteUserSkill(@Request() req, @Param('id') userSkillId: string) {
    return this.usersService.deleteUserSkill(req.user.id, userSkillId);
  }
}
