import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/createUserDto';
import { UsersService } from './users.service';

@Controller('api/v1/users')
export class UsersController {
  // Sugestao video para criar DELETE, UPDATE, etc: https://youtu.be/jMprSQlDLGo

  constructor(private readonly userService: UsersService) {}

  @Post()
  async createUser(@Body() body: CreateUserDto) {
    return await this.userService.create(body);
  }

  @Get(':username')
  async getUser(@Param('username') username: string) {
    return await this.userService.findOneByUsernameOrFail(username);
  }
}
