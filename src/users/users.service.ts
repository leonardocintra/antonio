import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { CreateUserDto } from './dto/createUserDto';

@Injectable()
export class UsersService {
    private readonly logger = new Logger(UsersService.name);

    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
    ) { }

    async create(user: CreateUserDto): Promise<User> {
        return await this.userRepository.save(this.userRepository.create(user));
    }

    async findByUsername(username: string): Promise<User> {
        return this.userRepository.findOneBy({ username });
    }
}
