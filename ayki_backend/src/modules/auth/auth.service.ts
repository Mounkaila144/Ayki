import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User, UserType, UserStatus } from '../../entities/user.entity';
import { UserProfile } from '../../entities/user-profile.entity';
import { Company } from '../../entities/company.entity';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserProfile)
    private profileRepository: Repository<UserProfile>,
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const { phone, password, userType, firstName, lastName, company } = signUpDto;

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({ where: { phone } });
    if (existingUser) {
      throw new ConflictException('Un utilisateur avec ce numéro de téléphone existe déjà');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = this.userRepository.create({
      phone,
      password: hashedPassword,
      userType,
      status: UserStatus.ACTIVE,
    });

    const savedUser = await this.userRepository.save(user);

    // Create profile
    const profile = this.profileRepository.create({
      firstName,
      lastName,
      userId: savedUser.id,
      profileCompletion: this.calculateInitialCompletion(firstName, lastName),
    });

    await this.profileRepository.save(profile);

    // Create company if recruiter
    if (userType === UserType.RECRUITER && company) {
      const companyEntity = this.companyRepository.create({
        name: company,
        userId: savedUser.id,
      });
      await this.companyRepository.save(companyEntity);
    }

    // Generate JWT token
    const payload = { sub: savedUser.id, phone: savedUser.phone, userType: savedUser.userType };
    const token = this.jwtService.sign(payload);

    return {
      user: {
        id: savedUser.id,
        phone: savedUser.phone,
        userType: savedUser.userType,
        status: savedUser.status,
        profile: {
          firstName,
          lastName,
        },
      },
      token,
    };
  }

  async signIn(signInDto: SignInDto) {
    const { phone, password } = signInDto;

    // Find user with profile (without userType filter)
    const user = await this.userRepository.findOne({
      where: { phone },
      relations: ['profile', 'company'],
    });

    if (!user) {
      throw new UnauthorizedException('Numéro de téléphone ou mot de passe incorrect');
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Numéro de téléphone ou mot de passe incorrect');
    }

    // Check if user is active
    if (user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('Votre compte est désactivé');
    }

    // Update last login
    await this.userRepository.update(user.id, { lastLoginAt: new Date() });

    // Generate JWT token
    const payload = {
      sub: user.id,
      phone: user.phone,
      userType: user.userType,
      adminRole: user.adminRole
    };
    const token = this.jwtService.sign(payload);

    return {
      user: {
        id: user.id,
        phone: user.phone,
        userType: user.userType,
        status: user.status,
        adminRole: user.adminRole,
        profile: user.profile,
        company: user.company,
      },
      token,
    };
  }

  async validateUser(phone: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { phone },
      relations: ['profile'],
    });

    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async findUserById(id: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
      relations: ['profile', 'company'],
    });
  }

  private calculateInitialCompletion(firstName: string, lastName: string): number {
    let completion = 0;
    if (firstName) completion += 10;
    if (lastName) completion += 10;
    return completion;
  }

  async refreshToken(userId: string) {
    const user = await this.findUserById(userId);
    if (!user) {
      throw new UnauthorizedException('Utilisateur non trouvé');
    }

    const payload = {
      sub: user.id,
      phone: user.phone,
      userType: user.userType,
      adminRole: user.adminRole
    };
    const token = this.jwtService.sign(payload);

    return { token };
  }
}
