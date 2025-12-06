import { Repository } from 'typeorm';
import { Partner } from '../../entities/partner.entity';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
export declare class PartnersService {
    private partnerRepository;
    constructor(partnerRepository: Repository<Partner>);
    create(createPartnerDto: CreatePartnerDto, logo: string): Promise<Partner>;
    findAll(): Promise<Partner[]>;
    findAllActive(): Promise<Partner[]>;
    findOne(id: string): Promise<Partner>;
    update(id: string, updatePartnerDto: UpdatePartnerDto, logo?: string): Promise<Partner>;
    remove(id: string): Promise<void>;
}
