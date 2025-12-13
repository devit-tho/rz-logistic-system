import { DriverService } from '@/driver/driver.service';
import { UserWithoutPassword } from '@monorepo/entities';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'user-jwt') {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(req: Request): Promise<UserWithoutPassword> {
    const token = req.headers['authorization'].split('Bearer ')[1];

    const user = await this.authService.validate(token);
    req.user = user;
    req.token = token;
    return user;
  }
}

Injectable();
export class DriverJwtStrategy extends PassportStrategy(
  Strategy,
  'driver-jwt', // important name for guard binding
) {
  constructor(private readonly driverService: DriverService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    const driver = await this.driverService.findById(payload.sub);

    req.driver = driver;

    return driver;
  }
}
