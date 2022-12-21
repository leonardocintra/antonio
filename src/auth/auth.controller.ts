import { Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/auth')
export class AuthController {

    @UseGuards(AuthGuard('local'))
    @Post('login')
    async login() {

    }
}
