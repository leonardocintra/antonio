import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { compare as bcryptCompare } from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private userService: UsersService) { }

    async validateUser(username: string, password: string): Promise<any> {
        const user = await this.userService.findByUsername(username);
        const passwordMatch = await bcryptCompare(password, user.password);
        if (user && passwordMatch) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }
}
