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
exports.InterviewsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const interview_entity_1 = require("../../entities/interview.entity");
let InterviewsService = class InterviewsService {
    interviewRepository;
    constructor(interviewRepository) {
        this.interviewRepository = interviewRepository;
    }
    create(createInterviewDto) {
        const interview = this.interviewRepository.create(createInterviewDto);
        return this.interviewRepository.save(interview);
    }
    findAll() {
        return this.interviewRepository.find({
            relations: ['candidate', 'recruiter', 'application']
        });
    }
    findOne(id) {
        return this.interviewRepository.findOne({
            where: { id },
            relations: ['candidate', 'recruiter', 'application']
        });
    }
    update(id, updateInterviewDto) {
        return this.interviewRepository.update(id, updateInterviewDto);
    }
    remove(id) {
        return this.interviewRepository.delete(id);
    }
};
exports.InterviewsService = InterviewsService;
exports.InterviewsService = InterviewsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(interview_entity_1.Interview)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], InterviewsService);
//# sourceMappingURL=interviews.service.js.map