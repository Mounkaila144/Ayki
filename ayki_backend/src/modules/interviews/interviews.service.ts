import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Interview } from '../../entities/interview.entity';

@Injectable()
export class InterviewsService {
  constructor(
    @InjectRepository(Interview)
    private interviewRepository: Repository<Interview>,
  ) {}

  create(createInterviewDto: any) {
    const interview = this.interviewRepository.create(createInterviewDto);
    return this.interviewRepository.save(interview);
  }

  findAll() {
    return this.interviewRepository.find({
      relations: ['candidate', 'recruiter', 'application']
    });
  }

  findOne(id: string) {
    return this.interviewRepository.findOne({
      where: { id },
      relations: ['candidate', 'recruiter', 'application']
    });
  }

  update(id: string, updateInterviewDto: any) {
    return this.interviewRepository.update(id, updateInterviewDto);
  }

  remove(id: string) {
    return this.interviewRepository.delete(id);
  }
}