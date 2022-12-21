import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { compareSync } from 'bcrypt';
import { User } from '../entity/user.entity';

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) { }

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
