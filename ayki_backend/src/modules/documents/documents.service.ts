import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from '../../entities/document.entity';
import { UserProfile } from '../../entities/user-profile.entity';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
    @InjectRepository(UserProfile)
    private profileRepository: Repository<UserProfile>,
  ) {}

  async uploadDocument(file: Express.Multer.File, body: any, userId?: string) {
    try {
      console.log('=== UPLOAD SERVICE START ===');
      console.log('Upload request received:', {
        filename: file?.filename,
        originalname: file?.originalname,
        path: file?.path,
        mimetype: file?.mimetype,
        size: file?.size,
        type: body?.type,
        userId
      });

      if (!file) {
        throw new Error('No file provided to service');
      }

      console.log('Creating document entity...');
      const document = this.documentRepository.create({
        name: file.originalname,
        originalName: file.originalname,
        type: body.type || 'cv',
        mimeType: file.mimetype,
        size: file.size,
        path: file.path,
        userId,
        ...body
      });
      
      console.log('Saving document to database...');
      const savedDocument = await this.documentRepository.save(document);
      console.log('Document saved successfully:', typeof savedDocument);
      
      // Si c'est un avatar et qu'on a un userId, mettre à jour le profil
      if (body.type === 'avatar' && userId) {
        try {
          const avatarPath = `/uploads/${file.filename}`;
          console.log('Updating profile with avatar:', avatarPath);
          
          let profile = await this.profileRepository.findOne({ where: { userId } });
          if (!profile) {
            // Créer un profil de base s'il n'existe pas
            console.log('Creating new profile for user:', userId);
            profile = this.profileRepository.create({
              userId,
              firstName: '',
              lastName: '',
              avatar: avatarPath,
            });
          } else {
            console.log('Updating existing profile');
            profile.avatar = avatarPath;
          }
          
          const savedProfile = await this.profileRepository.save(profile);
          console.log('Profile updated with avatar:', savedProfile.avatar);
        } catch (profileError) {
          console.error('Error updating profile:', profileError);
          // Don't fail the entire upload if profile update fails
        }
      }
      
      console.log('Preparing response...');
      const response = {
        ...savedDocument,
        url: `/uploads/${file.filename}`
      };
      console.log('=== UPLOAD SERVICE SUCCESS ===');
      return response;
      
    } catch (error) {
      console.error('=== UPLOAD SERVICE ERROR ===');
      console.error('Service error:', error);
      console.error('Stack trace:', error.stack);
      throw error;
    }
  }

  create(createDocumentDto: any) {
    const document = this.documentRepository.create(createDocumentDto);
    return this.documentRepository.save(document);
  }

  findAll() {
    return this.documentRepository.find({
      relations: ['user']
    });
  }

  findOne(id: string) {
    return this.documentRepository.findOne({
      where: { id },
      relations: ['user']
    });
  }

  update(id: string, updateDocumentDto: any) {
    return this.documentRepository.update(id, updateDocumentDto);
  }

  remove(id: string) {
    return this.documentRepository.delete(id);
  }
}