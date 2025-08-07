import { Injectable, NotFoundException, ForbiddenException, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobOffer, JobStatus, ExperienceLevel, RemotePolicy } from '../../entities/job-offer.entity';
import { User } from '../../entities/user.entity';
import { EmploymentType } from '../../entities/experience.entity';

@Injectable()
export class JobsService {
  private readonly logger = new Logger(JobsService.name);

  constructor(
    @InjectRepository(JobOffer)
    private jobOfferRepository: Repository<JobOffer>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(recruiterId: string, createJobDto: any) {
    // Récupérer les informations du recruteur avec sa société
    const recruiter = await this.userRepository.findOne({
      where: { id: recruiterId },
      relations: ['company']
    });

    if (!recruiter) {
      throw new NotFoundException('Recruteur non trouvé');
    }

    if (!recruiter.company) {
      throw new ForbiddenException('Aucune société associée à ce recruteur');
    }

    const jobOffer = this.jobOfferRepository.create({
      ...createJobDto,
      recruiterId,
      companyId: recruiter.company.id,
    });
    
    return this.jobOfferRepository.save(jobOffer);
  }

  findByRecruiter(recruiterId: string, query: any = {}) {
    const { status, page = 1, limit = 10 } = query;
    
    const queryBuilder = this.jobOfferRepository
      .createQueryBuilder('job')
      .leftJoinAndSelect('job.company', 'company')
      .leftJoinAndSelect('job.applications', 'applications')
      .where('job.recruiterId = :recruiterId', { recruiterId });

    if (status) {
      queryBuilder.andWhere('job.status = :status', { status });
    }

    queryBuilder
      .orderBy('job.updatedAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    return queryBuilder.getManyAndCount().then(([jobs, total]) => ({
      data: jobs,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
    }));
  }

  findAll(query: any = {}) {
    const { location, experienceLevel, employmentType } = query;
    const queryBuilder = this.jobOfferRepository.createQueryBuilder('job')
      .leftJoinAndSelect('job.recruiter', 'recruiter')
      .leftJoinAndSelect('job.company', 'company')
      .leftJoinAndSelect('job.requiredSkills', 'requiredSkills')
      .where('job.status = :status', { status: 'published' });

    if (location) {
      queryBuilder.andWhere('job.location LIKE :location', { location: `%${location}%` });
    }
    if (experienceLevel) {
      queryBuilder.andWhere('job.experienceLevel = :experienceLevel', { experienceLevel });
    }
    if (employmentType) {
      queryBuilder.andWhere('job.employmentType = :employmentType', { employmentType });
    }

    // Les candidats voient toutes les annonces (y compris admin) mais ne peuvent pas postuler aux admin
    return queryBuilder.orderBy('job.createdAt', 'DESC').getMany();
  }

  findOne(id: string) {
    return this.jobOfferRepository.findOne({
      where: { id },
      relations: ['recruiter', 'company', 'requiredSkills', 'applications']
    });
  }

  async update(recruiterId: string, id: string, updateJobDto: any) {
    this.logger.log(`Updating job offer ${id} for recruiter ${recruiterId}`);
    this.logger.debug(`Update data received:`, updateJobDto);

    try {
      // Vérifier que l'offre appartient au recruteur
      const job = await this.jobOfferRepository.findOne({
        where: { id, recruiterId }
      });

      if (!job) {
        throw new NotFoundException('Offre d\'emploi non trouvée ou non autorisée');
      }

      // Valider et nettoyer les données de mise à jour
      const cleanUpdateDto = this.validateAndCleanUpdateData(updateJobDto);
      this.logger.debug(`Cleaned update data:`, cleanUpdateDto);

      // Utiliser merge et save pour une mise à jour plus robuste
      const updatedJob = this.jobOfferRepository.merge(job, cleanUpdateDto);
      await this.jobOfferRepository.save(updatedJob);

      this.logger.log(`Job offer ${id} updated successfully`);
      return this.findOne(id);
    } catch (error) {
      this.logger.error(`Error updating job offer ${id}:`, error.message);
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Erreur lors de la mise à jour de l'offre d'emploi: ${error.message}`);
    }
  }

  private validateAndCleanUpdateData(updateJobDto: any): Partial<JobOffer> {
    if (!updateJobDto || typeof updateJobDto !== 'object') {
      throw new BadRequestException('Données de mise à jour invalides');
    }

    // Liste des champs autorisés à être mis à jour
    const allowedFields = [
      'title', 'description', 'requirements', 'responsibilities', 'benefits',
      'location', 'employmentType', 'experienceLevel', 'remotePolicy',
      'salaryMin', 'salaryMax', 'currency', 'salaryPeriod', 'salaryNegotiable',
      'positions', 'applicationDeadline', 'startDate', 'status',
      'languages', 'benefits_list', 'tags', 'isActive', 'isFeatured', 'isUrgent',
      'companyId'
    ];

    const cleanData: any = {};

    // Filtrer et valider chaque champ
    for (const [key, value] of Object.entries(updateJobDto)) {
      if (allowedFields.includes(key) && value !== undefined) {
        cleanData[key] = this.validateFieldValue(key, value);
      }
    }

    return cleanData;
  }

  private validateFieldValue(fieldName: string, value: any): any {
    switch (fieldName) {
      case 'employmentType':
        if (value && !Object.values(EmploymentType).includes(value)) {
          throw new BadRequestException(`Type d'emploi invalide: ${value}`);
        }
        return value;

      case 'experienceLevel':
        if (value && !Object.values(ExperienceLevel).includes(value)) {
          throw new BadRequestException(`Niveau d'expérience invalide: ${value}`);
        }
        return value;

      case 'remotePolicy':
        if (value && !Object.values(RemotePolicy).includes(value)) {
          throw new BadRequestException(`Politique de télétravail invalide: ${value}`);
        }
        return value;

      case 'status':
        if (value && !Object.values(JobStatus).includes(value)) {
          throw new BadRequestException(`Statut invalide: ${value}`);
        }
        return value;

      case 'salaryMin':
      case 'salaryMax':
        // Convertir en string si c'est un nombre
        return value !== null && value !== undefined ? String(value) : value;

      case 'positions':
        // S'assurer que c'est un nombre entier positif
        const positions = parseInt(value);
        if (isNaN(positions) || positions < 1) {
          throw new BadRequestException('Le nombre de postes doit être un entier positif');
        }
        return positions;

      case 'salaryNegotiable':
      case 'isActive':
      case 'isFeatured':
      case 'isUrgent':
        // S'assurer que c'est un booléen
        return Boolean(value);

      case 'languages':
      case 'benefits_list':
      case 'tags':
        // S'assurer que c'est un tableau
        return Array.isArray(value) ? value : [];

      case 'applicationDeadline':
      case 'startDate':
        // Valider les dates
        if (value && !(value instanceof Date) && typeof value === 'string') {
          const date = new Date(value);
          if (isNaN(date.getTime())) {
            throw new BadRequestException(`Date invalide pour ${fieldName}: ${value}`);
          }
          return date;
        }
        return value;

      case 'companyId':
        // Valider que c'est un UUID valide (optionnel)
        if (value && typeof value === 'string' && value.length > 0) {
          return value;
        }
        return value;

      default:
        // Pour les autres champs (strings), retourner tel quel
        return value;
    }
  }

  async remove(recruiterId: string, id: string) {
    // Vérifier que l'offre appartient au recruteur
    const job = await this.jobOfferRepository.findOne({ 
      where: { id, recruiterId } 
    });
    
    if (!job) {
      throw new NotFoundException('Offre d\'emploi non trouvée ou non autorisée');
    }

    return this.jobOfferRepository.delete(id);
  }
}