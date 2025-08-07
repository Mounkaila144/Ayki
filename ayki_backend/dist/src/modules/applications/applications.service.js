"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const application_entity_1 = require("../../entities/application.entity");
const job_offer_entity_1 = require("../../entities/job-offer.entity");
const user_entity_1 = require("../../entities/user.entity");
let ApplicationsService = class ApplicationsService {
    applicationRepository;
    jobOfferRepository;
    userRepository;
    constructor(applicationRepository, jobOfferRepository, userRepository) {
        this.applicationRepository = applicationRepository;
        this.jobOfferRepository = jobOfferRepository;
        this.userRepository = userRepository;
    }
    async create(candidateId, createApplicationDto) {
        const { jobOfferId, coverLetter, message, source = application_entity_1.ApplicationSource.DIRECT } = createApplicationDto;
        const jobOffer = await this.jobOfferRepository.findOne({
            where: { id: jobOfferId },
            relations: ['recruiter']
        });
        if (!jobOffer) {
            throw new common_1.NotFoundException('Offre d\'emploi non trouvée');
        }
        if (!jobOffer.isActive) {
            throw new common_1.BadRequestException('Cette offre d\'emploi n\'est plus active');
        }
        if (jobOffer.isAdminPost) {
            throw new common_1.BadRequestException('Les candidatures ne sont pas autorisées sur les annonces administratives');
        }
        const candidate = await this.userRepository.findOne({
            where: { id: candidateId }
        });
        if (!candidate) {
            throw new common_1.NotFoundException('Candidat non trouvé');
        }
        const existingApplication = await this.applicationRepository.findOne({
            where: {
                candidateId,
                jobOfferId
            }
        });
        if (existingApplication) {
            throw new common_1.ConflictException('Vous avez déjà postulé à cette offre d\'emploi');
        }
        const application = this.applicationRepository.create({
            candidateId,
            recruiterId: jobOffer.recruiterId,
            jobOfferId,
            coverLetter,
            message,
            source,
            status: application_entity_1.ApplicationStatus.PENDING,
        });
        const savedApplication = await this.applicationRepository.save(application);
        await this.jobOfferRepository.update(jobOfferId, {
            applicationCount: () => 'applicationCount + 1'
        });
        return this.findOne(savedApplication.id);
    }
    findAll() {
        return this.applicationRepository.find({
            relations: ['candidate', 'candidate.profile', 'recruiter', 'jobOffer', 'jobOffer.company'],
            order: { createdAt: 'DESC' }
        });
    }
    findOne(id) {
        return this.applicationRepository.findOne({
            where: { id },
            relations: ['candidate', 'candidate.profile', 'recruiter', 'jobOffer', 'jobOffer.company']
        });
    }
    async findByCandidate(candidateId) {
        return this.applicationRepository.find({
            where: { candidateId },
            relations: ['jobOffer', 'jobOffer.company', 'recruiter'],
            order: { createdAt: 'DESC' }
        });
    }
    async findByRecruiter(recruiterId) {
        return this.applicationRepository.find({
            where: { recruiterId },
            relations: ['candidate', 'candidate.profile', 'jobOffer'],
            order: { createdAt: 'DESC' }
        });
    }
    async findByJobOffer(jobOfferId) {
        return this.applicationRepository.find({
            where: { jobOfferId },
            relations: ['candidate', 'candidate.profile'],
            order: { createdAt: 'DESC' }
        });
    }
    async update(id, updateApplicationDto) {
        const application = await this.findOne(id);
        if (!application) {
            throw new common_1.NotFoundException('Candidature non trouvée');
        }
        if (updateApplicationDto.status) {
            const validStatuses = Object.values(application_entity_1.ApplicationStatus);
            if (!validStatuses.includes(updateApplicationDto.status)) {
                throw new common_1.BadRequestException('Statut invalide');
            }
            if (application.status === application_entity_1.ApplicationStatus.WITHDRAWN) {
                throw new common_1.BadRequestException('Impossible de modifier une candidature retirée');
            }
            if (updateApplicationDto.status === application_entity_1.ApplicationStatus.OFFER_ACCEPTED || updateApplicationDto.status === application_entity_1.ApplicationStatus.HIRED) {
                updateApplicationDto.acceptedAt = new Date();
            }
            else if (updateApplicationDto.status === application_entity_1.ApplicationStatus.REJECTED) {
                updateApplicationDto.rejectedAt = new Date();
            }
            else if (updateApplicationDto.status === application_entity_1.ApplicationStatus.REVIEWED) {
                updateApplicationDto.reviewedAt = new Date();
            }
        }
        await this.applicationRepository.update(id, updateApplicationDto);
        return this.findOne(id);
    }
    async updateStatus(recruiterId, id, status) {
        const application = await this.applicationRepository.findOne({
            where: { id },
            relations: ['jobOffer']
        });
        if (!application) {
            throw new common_1.NotFoundException('Candidature non trouvée');
        }
        if (application.recruiterId !== recruiterId) {
            throw new common_1.BadRequestException('Vous n\'êtes pas autorisé à modifier cette candidature');
        }
        if (application.status === application_entity_1.ApplicationStatus.WITHDRAWN) {
            throw new common_1.BadRequestException('Impossible de modifier une candidature retirée');
        }
        const updateData = { status };
        if (status === application_entity_1.ApplicationStatus.OFFER_ACCEPTED || status === application_entity_1.ApplicationStatus.HIRED) {
            updateData.acceptedAt = new Date();
        }
        else if (status === application_entity_1.ApplicationStatus.REJECTED) {
            updateData.rejectedAt = new Date();
        }
        else if (status === application_entity_1.ApplicationStatus.REVIEWED) {
            updateData.reviewedAt = new Date();
        }
        await this.applicationRepository.update(id, updateData);
        return this.findOne(id);
    }
    async remove(id) {
        const application = await this.findOne(id);
        if (!application) {
            throw new common_1.NotFoundException('Candidature non trouvée');
        }
        await this.applicationRepository.delete(id);
        await this.jobOfferRepository.update(application.jobOfferId, {
            applicationCount: () => 'GREATEST(applicationCount - 1, 0)'
        });
        return { message: 'Candidature supprimée avec succès' };
    }
    async withdraw(candidateId, id) {
        const application = await this.applicationRepository.findOne({
            where: { id, candidateId }
        });
        if (!application) {
            throw new common_1.NotFoundException('Candidature non trouvée');
        }
        if (application.status === application_entity_1.ApplicationStatus.WITHDRAWN) {
            throw new common_1.BadRequestException('Cette candidature a déjà été retirée');
        }
        await this.applicationRepository.update(id, {
            status: application_entity_1.ApplicationStatus.WITHDRAWN,
            withdrawnAt: new Date()
        });
        return this.findOne(id);
    }
};
exports.ApplicationsService = ApplicationsService;
exports.ApplicationsService = ApplicationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(application_entity_1.Application)),
    __param(1, (0, typeorm_1.InjectRepository)(job_offer_entity_1.JobOffer)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ApplicationsService);
//# sourceMappingURL=applications.service.js.map