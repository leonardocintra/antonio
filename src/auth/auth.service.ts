import { Injectable } from '@nestjs/common';
import { compareSync } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsuariosService } from '../usuarios/usuarios.service';
import { Usuario } from '../entities/usuario.entity';

@Injectable()
export class AuthService {
  constructor(
    private usuarioService: UsuariosService,
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
    let user: Usuario;
    try {
      user = await this.usuarioService.findOneByUsername(username);
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
