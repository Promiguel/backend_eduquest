import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'secreto_eduquest_2026',
    });
  }

  async validate(payload: { sub: number; correo: string; rol: string }) {
    const user = await this.userService.findOne(payload.sub);
    if (!user || user.estado !== 'activo') {
      throw new UnauthorizedException('Usuario no autorizado o inactivo');
    }
    return user;
  }
}
