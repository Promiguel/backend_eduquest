import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../../user/user.service';
import { getJwtSecret } from '../jwt-secret';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: getJwtSecret(configService),
    });
  }

  async validate(payload: {
    sub: number;
    correo?: string;
    rol?: string;
    roles?: string[];
  }) {
    const user = await this.userService.findOne(payload.sub);
    if (!user || user.estado !== 'activo') {
      throw new UnauthorizedException('Usuario no autorizado o inactivo');
    }
    const roles = user.roles.map((role) => role.nombre);
    return {
      ...user,
      rol: roles[0] ?? null,
      roles,
    };
  }
}
