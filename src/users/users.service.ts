import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { CreateUserDto } from './dto/createUserDto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(user: CreateUserDto): Promise<User> {
    return await this.userRepository.save(this.userRepository.create(user));
  }

  async findOneByUsernameOrFail(username: string): Promise<User> {
    try {
      return this.userRepository.findOneByOrFail({ username });
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async update(username: string, data: User) {
    const user = await this.findOneByUsernameOrFail(username);
    this.userRepository.merge(user, data);
    return await this.userRepository.save(user);
  }
}
