import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class AuthService {

  constructor(
    private  readonly userRepository: UserRepository,
    private jwtService: JwtService
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.userRepository.signUp(authCredentialsDto)
  }

  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string}> {
    const username =  await this.userRepository.validateInputPassword(authCredentialsDto);

    if (!username) throw new UnauthorizedException('Auth failed');

    const payload  = { username };

    const accessToken = await this.jwtService.sign(payload);

    return { accessToken }
  }
}
