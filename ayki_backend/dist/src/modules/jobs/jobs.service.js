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
var JobsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const job_offer_entity_1 = require("../../entities/job-offer.entity");
const user_entity_1 = require("../../entities/user.entity");
const experience_entity_1 = require("../../entities/experience.entity");
let JobsService = JobsService_1 = class JobsService {
    jobOfferRepository;
    userRepository;
    logger = new common_1.Logger(JobsService_1.name);
    constructor(jobOfferRepository, userRepository) {
        this.jobOfferRepository = jobOfferRepository;
        this.userRepository = userRepository;
    }
    async create(recruiterId, createJobDto) {
        const recruiter = await this.userRepository.findOne({
            where: { id: recruiterId },
            relations: ['company']
        });
        if (!recruiter) {
            throw new common_1.NotFoundException('Recruteur non trouvé');
        }
        if (!recruiter.company) {
            throw new common_1.ForbiddenException('Aucune société associée à ce recruteur');
        }
        const jobOffer = this.jobOfferRepository.create({
            ...createJobDto,
            recruiterId,
            companyId: recruiter.company.id,
        });
        return this.jobOfferRepository.save(jobOffer);
    }
    findByRecruiter(recruiterId, query = {}) {
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
    findAll(query = {}) {
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
        return queryBuilder.orderBy('job.createdAt', 'DESC').getMany();
    }
    findOne(id) {
        return this.jobOfferRepository.findOne({
            where: { id },
            relations: ['recruiter', 'company', 'requiredSkills', 'applications']
        });
    }
    async update(recruiterId, id, updateJobDto) {
        this.logger.log(`Updating job offer ${id} for recruiter ${recruiterId}`);
        this.logger.debug(`Update data received:`, updateJobDto);
        try {
            const job = await this.jobOfferRepository.findOne({
                where: { id, recruiterId }
            });
            if (!job) {
                throw new common_1.NotFoundException('Offre d\'emploi non trouvée ou non autorisée');
            }
            const cleanUpdateDto = this.validateAndCleanUpdateData(updateJobDto);
            this.logger.debug(`Cleaned update data:`, cleanUpdateDto);
            const updatedJob = this.jobOfferRepository.merge(job, cleanUpdateDto);
            await this.jobOfferRepository.save(updatedJob);
            this.logger.log(`Job offer ${id} updated successfully`);
            return this.findOne(id);
        }
        catch (error) {
            this.logger.error(`Error updating job offer ${id}:`, error.message);
            if (error instanceof common_1.NotFoundException || error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Erreur lors de la mise à jour de l'offre d'emploi: ${error.message}`);
        }
    }
    validateAndCleanUpdateData(updateJobDto) {
        if (!updateJobDto || typeof updateJobDto !== 'object') {
            throw new common_1.BadRequestException('Données de mise à jour invalides');
        }
        const allowedFields = [
            'title', 'description', 'requirements', 'responsibilities', 'benefits',
            'location', 'employmentType', 'experienceLevel', 'remotePolicy',
            'salaryMin', 'salaryMax', 'currency', 'salaryPeriod', 'salaryNegotiable',
            'positions', 'applicationDeadline', 'startDate', 'status',
            'languages', 'benefits_list', 'tags', 'isActive', 'isFeatured', 'isUrgent',
            'companyId'
        ];
        const cleanData = {};
        for (const [key, value] of Object.entries(updateJobDto)) {
            if (allowedFields.includes(key) && value !== undefined) {
                cleanData[key] = this.validateFieldValue(key, value);
            }
        }
        return cleanData;
    }
    validateFieldValue(fieldName, value) {
        switch (fieldName) {
            case 'employmentType':
                if (value && !Object.values(experience_entity_1.EmploymentType).includes(value)) {
                    throw new common_1.BadRequestException(`Type d'emploi invalide: ${value}`);
                }
                return value;
            case 'experienceLevel':
                if (value && !Object.values(job_offer_entity_1.ExperienceLevel).includes(value)) {
                    throw new common_1.BadRequestException(`Niveau d'expérience invalide: ${value}`);
                }
                return value;
            case 'remotePolicy':
                if (value && !Object.values(job_offer_entity_1.RemotePolicy).includes(value)) {
                    throw new common_1.BadRequestException(`Politique de télétravail invalide: ${value}`);
                }
                return value;
            case 'status':
                if (value && !Object.values(job_offer_entity_1.JobStatus).includes(value)) {
                    throw new common_1.BadRequestException(`Statut invalide: ${value}`);
                }
                return value;
            case 'salaryMin':
            case 'salaryMax':
                return value !== null && value !== undefined ? String(value) : value;
            case 'positions':
                const positions = parseInt(value);
                if (isNaN(positions) || positions < 1) {
                    throw new common_1.BadRequestException('Le nombre de postes doit être un entier positif');
                }
                return positions;
            case 'salaryNegotiable':
            case 'isActive':
            case 'isFeatured':
            case 'isUrgent':
                return Boolean(value);
            case 'languages':
            case 'benefits_list':
            case 'tags':
                return Array.isArray(value) ? value : [];
            case 'applicationDeadline':
            case 'startDate':
                if (value && !(value instanceof Date) && typeof value === 'string') {
                    const date = new Date(value);
                    if (isNaN(date.getTime())) {
                        throw new common_1.BadRequestException(`Date invalide pour ${fieldName}: ${value}`);
                    }
                    return date;
                }
                return value;
            case 'companyId':
                if (value && typeof value === 'string' && value.length > 0) {
                    return value;
                }
                return value;
            default:
                return value;
        }
    }
    async remove(recruiterId, id) {
        const job = await this.jobOfferRepository.findOne({
            where: { id, recruiterId }
        });
        if (!job) {
            throw new common_1.NotFoundException('Offre d\'emploi non trouvée ou non autorisée');
        }
        return this.jobOfferRepository.delete(id);
    }
};
exports.JobsService = JobsService;
exports.JobsService = JobsService = JobsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(job_offer_entity_1.JobOffer)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], JobsService);
//# sourceMappingURL=jobs.service.js.map