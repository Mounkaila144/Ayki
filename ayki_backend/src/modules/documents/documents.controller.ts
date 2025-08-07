import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFile, Request } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { DocumentsService } from './documents.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('documents')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  uploadFile(@UploadedFile() file: Express.Multer.File, @Body() body: any, @Request() req: any) {
    try {
      console.log('=== UPLOAD CONTROLLER START ===');
      console.log('File received:', file ? {
        filename: file.filename,
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size
      } : 'NO FILE');
      console.log('Body received:', body);
      console.log('User from request:', req.user ? req.user.id : 'NO USER');
      
      if (!file) {
        console.error('ERROR: No file uploaded');
        throw new Error('Aucun fichier uploadé');
      }
      
      if (!req.user || !req.user.id) {
        console.error('ERROR: No user found in request');
        throw new Error('Utilisateur non authentifié');
      }
      
      console.log('Calling documentsService.uploadDocument...');
      return this.documentsService.uploadDocument(file, body, req.user.id);
    } catch (error) {
      console.error('=== UPLOAD CONTROLLER ERROR ===');
      console.error('Error in controller:', error);
      throw error;
    }
  }

  @Post()
  create(@Body() createDocumentDto: any) {
    return this.documentsService.create(createDocumentDto);
  }

  @Get()
  findAll() {
    return this.documentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.documentsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDocumentDto: any) {
    return this.documentsService.update(id, updateDocumentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.documentsService.remove(id);
  }
}