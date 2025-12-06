import { Controller, Get, Put, Body, UseGuards, Request, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProfilesService } from './profiles.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Profiles')
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get('public/:slug')
  @ApiOperation({ summary: 'Récupérer un profil public par son slug' })
  async getPublicProfile(@Param('slug') slug: string) {
    return this.profilesService.findBySlug(slug);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Récupérer le profil de l\'utilisateur connecté' })
  async getMyProfile(@Request() req) {
    return this.profilesService.findByUserId(req.user.id);
  }

  @Put('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mettre à jour le profil de l\'utilisateur connecté' })
  async updateMyProfile(@Request() req, @Body() updateData: any) {
    return this.profilesService.updateByUserId(req.user.id, updateData);
  }
}
