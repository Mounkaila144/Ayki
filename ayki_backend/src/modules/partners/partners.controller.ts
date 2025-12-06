import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { PartnersService } from './partners.service';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../admin/guards/admin.guard';

@ApiTags('partners')
@Controller('partners')
export class PartnersController {
  constructor(private readonly partnersService: PartnersService) {}

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('logo'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Créer un partenaire (Admin seulement)' })
  async create(
    @UploadedFile() logo: Express.Multer.File,
    @Body() body: any,
  ) {
    if (!logo) {
      throw new BadRequestException('Le logo est requis');
    }

    // Transformer les données du FormData
    const createPartnerDto: CreatePartnerDto = {
      name: body.name,
      order: body.order ? parseInt(body.order, 10) : 0,
      isActive: body.isActive === 'true' || body.isActive === true,
    };

    const logoPath = `/uploads/${logo.filename}`;
    return this.partnersService.create(createPartnerDto, logoPath);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les partenaires' })
  findAll() {
    return this.partnersService.findAll();
  }

  @Get('active')
  @ApiOperation({ summary: 'Récupérer tous les partenaires actifs' })
  findAllActive() {
    return this.partnersService.findAllActive();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un partenaire par ID' })
  findOne(@Param('id') id: string) {
    return this.partnersService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('logo'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Mettre à jour un partenaire (Admin seulement)' })
  async update(
    @Param('id') id: string,
    @UploadedFile() logo: Express.Multer.File,
    @Body() body: any,
  ) {
    // Transformer les données du FormData
    const updatePartnerDto: UpdatePartnerDto = {
      ...(body.name && { name: body.name }),
      ...(body.order !== undefined && { order: parseInt(body.order, 10) }),
      ...(body.isActive !== undefined && { isActive: body.isActive === 'true' || body.isActive === true }),
    };

    const logoPath = logo ? `/uploads/${logo.filename}` : undefined;
    return this.partnersService.update(id, updatePartnerDto, logoPath);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Supprimer un partenaire (Admin seulement)' })
  remove(@Param('id') id: string) {
    return this.partnersService.remove(id);
  }
}
