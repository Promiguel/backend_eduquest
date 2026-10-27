import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { correo, password } = loginDto;

    // 1. Buscar usuario por correo (incluyendo la contraseña cifrada)
    const user = await this.userService.findByEmailWithPassword(correo);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas (correo o contraseña incorrectos)');
    }

    // 2. Comprobar que el usuario esté activo
    if (user.estado !== 'activo') {
      throw new UnauthorizedException('El usuario se encuentra inactivo');
    }

    // 3. Comparar la contraseña enviada con el hash guardado en BD
    const isPasswordValid = await bcrypt.compare(password, user.contrasena_hash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas (correo o contraseña incorrectos)');
    }

    // 4. Crear el payload del token JWT
    const payload = {
      sub: user.id_usuario,
      correo: user.correo,
      rol: user.rol,
    };

    // 5. Retornar el token JWT generado junto con los datos del usuario
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id_usuario: user.id_usuario,
        nombre: user.nombre,
        apellido: user.apellido,
        correo: user.correo,
        rol: user.rol,
      },
    };
  }
}