import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from './jwt-payload.interface';
import { UserRepository } from './user.repository';
import { User } from './user.entity';
import * as config from 'config' ;

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private userRepository: UserRepository
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || config.get('jwt.secret'),
    });
  }

  async validate({username}: JwtPayload): Promise<User> {
    const user = await this.userRepository.findOne({ where : { username } });

    if (!user) throw new UnauthorizedException('Auth failed');

    return user;
  }
}