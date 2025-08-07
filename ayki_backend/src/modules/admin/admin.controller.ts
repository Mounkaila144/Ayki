import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { SimpleAdminService, SimpleAdminUserFilter, SimpleAdminPagination } from './admin.service.simple';
import { AdminGuard } from '../../guards/admin.guard';

@ApiTags('Admin')
@Controller('admin')
@UseGuards(AdminGuard)
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: SimpleAdminService) {}

  @Get('dashboard/stats')
  @ApiOperation({ summary: 'Récupérer les statistiques du dashboard admin' })
  @ApiResponse({
    status: 200,
    description: 'Statistiques récupérées avec succès',
  })
  @ApiResponse({ status: 403, description: 'Accès refusé - privilèges admin requis' })
  async getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  @Get('candidates')
  @ApiOperation({ summary: 'Récupérer la liste des candidats avec filtres et pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Numéro de page' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Nombre d\'éléments par page' })
  @ApiQuery({ name: 'sortBy', required: false, type: String, description: 'Champ de tri' })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['ASC', 'DESC'], description: 'Ordre de tri' })
  @ApiQuery({ name: 'status', required: false, enum: ['active', 'inactive', 'suspended', 'pending'], description: 'Statut' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Recherche' })
  @ApiQuery({ name: 'location', required: false, type: String, description: 'Localisation' })
  @ApiQuery({ name: 'startDate', required: false, type: String, description: 'Date de début' })
  @ApiQuery({ name: 'endDate', required: false, type: String, description: 'Date de fin' })
  @ApiQuery({ name: 'emailVerified', required: false, type: Boolean, description: 'Email vérifié' })
  @ApiQuery({ name: 'phoneVerified', required: false, type: Boolean, description: 'Téléphone vérifié' })
  @ApiResponse({
    status: 200,
    description: 'Liste des candidats récupérée avec succès',
  })
  @ApiResponse({ status: 403, description: 'Accès refusé - privilèges admin requis' })
  async getCandidates(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'ASC' | 'DESC',
    @Query('status') status?: string,
    @Query('search') search?: string,
    @Query('location') location?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('emailVerified') emailVerified?: boolean,
    @Query('phoneVerified') phoneVerified?: boolean,
  ) {
    const filters: SimpleAdminUserFilter = {
      status,
      search,
      location,
      startDate,
      endDate,
      emailVerified,
      phoneVerified,
    };

    const pagination: SimpleAdminPagination = {
      page: page ? parseInt(page.toString(), 10) : 1,
      limit: limit ? parseInt(limit.toString(), 10) : 10,
      sortBy: sortBy || 'createdAt',
      sortOrder: sortOrder || 'DESC',
    };

    return this.adminService.getCandidates(filters, pagination);
  }

  @Get('recruiters')
  @ApiOperation({ summary: 'Récupérer la liste des recruteurs avec filtres et pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Numéro de page' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Nombre d\'éléments par page' })
  @ApiQuery({ name: 'sortBy', required: false, type: String, description: 'Champ de tri' })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['ASC', 'DESC'], description: 'Ordre de tri' })
  @ApiQuery({ name: 'status', required: false, enum: ['active', 'inactive', 'suspended', 'pending'], description: 'Statut' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Recherche' })
  @ApiQuery({ name: 'location', required: false, type: String, description: 'Localisation' })
  @ApiQuery({ name: 'company', required: false, type: String, description: 'Entreprise' })
  @ApiQuery({ name: 'startDate', required: false, type: String, description: 'Date de début' })
  @ApiQuery({ name: 'endDate', required: false, type: String, description: 'Date de fin' })
  @ApiQuery({ name: 'emailVerified', required: false, type: Boolean, description: 'Email vérifié' })
  @ApiQuery({ name: 'phoneVerified', required: false, type: Boolean, description: 'Téléphone vérifié' })
  @ApiResponse({
    status: 200,
    description: 'Liste des recruteurs récupérée avec succès',
  })
  @ApiResponse({ status: 403, description: 'Accès refusé - privilèges admin requis' })
  async getRecruiters(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'ASC' | 'DESC',
    @Query('status') status?: string,
    @Query('search') search?: string,
    @Query('location') location?: string,
    @Query('company') company?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('emailVerified') emailVerified?: boolean,
    @Query('phoneVerified') phoneVerified?: boolean,
  ) {
    const filters: SimpleAdminUserFilter = {
      status,
      search,
      location,
      company,
      startDate,
      endDate,
      emailVerified,
      phoneVerified,
    };

    const pagination: SimpleAdminPagination = {
      page: page ? parseInt(page.toString(), 10) : 1,
      limit: limit ? parseInt(limit.toString(), 10) : 10,
      sortBy: sortBy || 'createdAt',
      sortOrder: sortOrder || 'DESC',
    };

    return this.adminService.getRecruiters(filters, pagination);
  }

  @Get('users/:id')
  @ApiOperation({ summary: 'Récupérer les détails d\'un utilisateur par ID' })
  @ApiResponse({
    status: 200,
    description: 'Détails de l\'utilisateur récupérés avec succès',
  })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
  @ApiResponse({ status: 403, description: 'Accès refusé - privilèges admin requis' })
  async getUserById(@Param('id') id: string) {
    return this.adminService.getUserById(id);
  }

  @Put('users/:id/status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mettre à jour le statut d\'un utilisateur' })
  @ApiResponse({
    status: 200,
    description: 'Statut de l\'utilisateur mis à jour avec succès',
  })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
  @ApiResponse({ status: 403, description: 'Accès refusé - privilèges admin requis' })
  async updateUserStatus(
    @Param('id') id: string,
    @Body() updateDto: { status: string },
  ) {
    return this.adminService.updateUserStatus(id, updateDto);
  }

  @Delete('users/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Supprimer un utilisateur (soft delete)' })
  @ApiResponse({
    status: 200,
    description: 'Utilisateur supprimé avec succès',
  })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
  @ApiResponse({ status: 403, description: 'Accès refusé - privilèges admin requis' })
  async deleteUser(@Param('id') id: string) {
    return this.adminService.deleteUser(id);
  }

  // Gestion des annonces administratives
  @Get('jobs')
  @ApiOperation({ summary: 'Récupérer toutes les annonces (y compris admin)' })
  @ApiResponse({ status: 200, description: 'Liste des annonces récupérée avec succès' })
  async getAllJobs(@Query() query: any) {
    return this.adminService.getAllJobs(query);
  }

  @Post('jobs')
  @ApiOperation({ summary: 'Créer une annonce administrative (lecture seule)' })
  @ApiResponse({ status: 201, description: 'Annonce administrative créée avec succès' })
  async createAdminJob(@Request() req: any, @Body() createJobDto: any) {
    return this.adminService.createAdminJob(req.user.id, createJobDto);
  }

  @Put('jobs/:id')
  @ApiOperation({ summary: 'Mettre à jour une annonce administrative' })
  @ApiResponse({ status: 200, description: 'Annonce mise à jour avec succès' })
  async updateAdminJob(@Param('id') id: string, @Body() updateJobDto: any) {
    return this.adminService.updateAdminJob(id, updateJobDto);
  }

  @Delete('jobs/:id')
  @ApiOperation({ summary: 'Supprimer une annonce administrative' })
  @ApiResponse({ status: 200, description: 'Annonce supprimée avec succès' })
  async deleteAdminJob(@Param('id') id: string) {
    return this.adminService.deleteAdminJob(id);
  }

  @Put('recruiter-jobs/:id')
  @ApiOperation({ summary: 'Mettre à jour une annonce de recruteur' })
  @ApiResponse({ status: 200, description: 'Annonce de recruteur mise à jour avec succès' })
  async updateRecruiterJob(@Param('id') id: string, @Body() updateJobDto: any) {
    return this.adminService.updateRecruiterJob(id, updateJobDto);
  }
}
