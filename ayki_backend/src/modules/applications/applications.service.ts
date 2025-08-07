import { Injectable, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application, ApplicationStatus, ApplicationSource } from '../../entities/application.entity';
import { JobOffer } from '../../entities/job-offer.entity';
import { User } from '../../entities/user.entity';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application)
    private applicationRepository: Repository<Application>,
    @InjectRepository(JobOffer)
    private jobOfferRepository: Repository<JobOffer>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(candidateId: string, createApplicationDto: any) {
    const { jobOfferId, coverLetter, message, source = ApplicationSource.DIRECT } = createApplicationDto;

    // Vérifier que l'offre d'emploi existe et est active
    const jobOffer = await this.jobOfferRepository.findOne({
      where: { id: jobOfferId },
      relations: ['recruiter']
    });

    if (!jobOffer) {
      throw new NotFoundException('Offre d\'emploi non trouvée');
    }

    if (!jobOffer.isActive) {
      throw new BadRequestException('Cette offre d\'emploi n\'est plus active');
    }

    // Empêcher les candidatures sur les annonces administratives
    if (jobOffer.isAdminPost) {
      throw new BadRequestException('Les candidatures ne sont pas autorisées sur les annonces administratives');
    }

    // Vérifier que le candidat existe
    const candidate = await this.userRepository.findOne({
      where: { id: candidateId }
    });

    if (!candidate) {
      throw new NotFoundException('Candidat non trouvé');
    }

    // Vérifier qu'il n'y a pas déjà une candidature pour cette offre
    const existingApplication = await this.applicationRepository.findOne({
      where: {
        candidateId,
        jobOfferId
      }
    });

    if (existingApplication) {
      throw new ConflictException('Vous avez déjà postulé à cette offre d\'emploi');
    }

    // Créer la candidature
    const application = this.applicationRepository.create({
      candidateId,
      recruiterId: jobOffer.recruiterId,
      jobOfferId,
      coverLetter,
      message,
      source,
      status: ApplicationStatus.PENDING,
    });

    const savedApplication = await this.applicationRepository.save(application);

    // Incrémenter le compteur de candidatures de l'offre
    await this.jobOfferRepository.update(jobOfferId, {
      applicationCount: () => 'applicationCount + 1'
    });

    // Retourner la candidature avec les relations
    return this.findOne(savedApplication.id);
  }

  findAll() {
    return this.applicationRepository.find({
      relations: ['candidate', 'candidate.profile', 'recruiter', 'jobOffer', 'jobOffer.company'],
      order: { createdAt: 'DESC' }
    });
  }

  findOne(id: string) {
    return this.applicationRepository.findOne({
      where: { id },
      relations: ['candidate', 'candidate.profile', 'recruiter', 'jobOffer', 'jobOffer.company']
    });
  }

  async findByCandidate(candidateId: string) {
    return this.applicationRepository.find({
      where: { candidateId },
      relations: ['jobOffer', 'jobOffer.company', 'recruiter'],
      order: { createdAt: 'DESC' }
    });
  }

  async findByRecruiter(recruiterId: string) {
    return this.applicationRepository.find({
      where: { recruiterId },
      relations: ['candidate', 'candidate.profile', 'jobOffer'],
      order: { createdAt: 'DESC' }
    });
  }

  async findByJobOffer(jobOfferId: string) {
    return this.applicationRepository.find({
      where: { jobOfferId },
      relations: ['candidate', 'candidate.profile'],
      order: { createdAt: 'DESC' }
    });
  }

  async update(id: string, updateApplicationDto: any) {
    const application = await this.findOne(id);
    if (!application) {
      throw new NotFoundException('Candidature non trouvée');
    }

    // Validation des changements de statut
    if (updateApplicationDto.status) {
      const validStatuses = Object.values(ApplicationStatus);
      if (!validStatuses.includes(updateApplicationDto.status)) {
        throw new BadRequestException('Statut invalide');
      }

      // Empêcher la modification d'une candidature retirée
      if (application.status === ApplicationStatus.WITHDRAWN) {
        throw new BadRequestException('Impossible de modifier une candidature retirée');
      }

      // Ajouter des timestamps pour certains statuts
      if (updateApplicationDto.status === ApplicationStatus.OFFER_ACCEPTED || updateApplicationDto.status === ApplicationStatus.HIRED) {
        updateApplicationDto.acceptedAt = new Date();
      } else if (updateApplicationDto.status === ApplicationStatus.REJECTED) {
        updateApplicationDto.rejectedAt = new Date();
      } else if (updateApplicationDto.status === ApplicationStatus.REVIEWED) {
        updateApplicationDto.reviewedAt = new Date();
      }
    }

    await this.applicationRepository.update(id, updateApplicationDto);
    return this.findOne(id);
  }

  async updateStatus(recruiterId: string, id: string, status: ApplicationStatus) {
    const application = await this.applicationRepository.findOne({
      where: { id },
      relations: ['jobOffer']
    });

    if (!application) {
      throw new NotFoundException('Candidature non trouvée');
    }

    // Vérifier que le recruteur est bien le propriétaire de l'offre
    if (application.recruiterId !== recruiterId) {
      throw new BadRequestException('Vous n\'êtes pas autorisé à modifier cette candidature');
    }

    // Empêcher la modification d'une candidature retirée
    if (application.status === ApplicationStatus.WITHDRAWN) {
      throw new BadRequestException('Impossible de modifier une candidature retirée');
    }

    const updateData: any = { status };

    // Ajouter des timestamps
    if (status === ApplicationStatus.OFFER_ACCEPTED || status === ApplicationStatus.HIRED) {
      updateData.acceptedAt = new Date();
    } else if (status === ApplicationStatus.REJECTED) {
      updateData.rejectedAt = new Date();
    } else if (status === ApplicationStatus.REVIEWED) {
      updateData.reviewedAt = new Date();
    }

    await this.applicationRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: string) {
    const application = await this.findOne(id);
    if (!application) {
      throw new NotFoundException('Candidature non trouvée');
    }

    await this.applicationRepository.delete(id);

    // Décrémenter le compteur de candidatures de l'offre
    await this.jobOfferRepository.update(application.jobOfferId, {
      applicationCount: () => 'GREATEST(applicationCount - 1, 0)'
    });

    return { message: 'Candidature supprimée avec succès' };
  }

  async withdraw(candidateId: string, id: string) {
    const application = await this.applicationRepository.findOne({
      where: { id, candidateId }
    });

    if (!application) {
      throw new NotFoundException('Candidature non trouvée');
    }

    if (application.status === ApplicationStatus.WITHDRAWN) {
      throw new BadRequestException('Cette candidature a déjà été retirée');
    }

    await this.applicationRepository.update(id, {
      status: ApplicationStatus.WITHDRAWN,
      withdrawnAt: new Date()
    });

    return this.findOne(id);
  }
}