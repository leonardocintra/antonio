import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { compareSync } from 'bcrypt';
import { User } from '../entity/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(user) {
    const payload = {
      sub: user.id,
      email: user.email,
    };

    return { token: this.jwtService.sign(payload) };
  }

  async validateUser(username: string, password: string): Promise<any> {
    let user: User;
    try {
      user = await this.userService.findOneByUsernameOrFail(username);
    } catch {
      return null;
    }

    const passwordIsValid = compareSync(password, user.password);

    if (passwordIsValid) {
      return user;
    } else {
      return null;
    }
  }
}
