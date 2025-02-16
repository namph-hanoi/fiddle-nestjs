import { ConflictException, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import { User } from "./user.entity";
import * as bcrypt from 'bcryptjs';
import { stringify } from "querystring";
@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;

    const salt = await bcrypt.genSalt();

    const user = await new User();
    user.username = username;
    user.password = await this.hashPassword(password, salt);
    user.salt = salt;

    try {
      await user.save();
    } catch (error) {
      if(error.code === '23505') { // Code of duplicate username which is defined by @Unique() in entity
        throw new ConflictException('Username already exists')
      } else {
        throw new InternalServerErrorException();
      }
    }
  };
  
  async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt)
  };

  async validateInputPassword(authCredentialsDto: AuthCredentialsDto): Promise<string> {
    const { username, password } = authCredentialsDto;

    const foundUser = await this.findOne({ where: { username } });

    if (!foundUser) return null;

    const isInputPasswordValid = await foundUser.validateInputPassword(password);

    if (isInputPasswordValid) return foundUser.username;

    throw new UnauthorizedException('Sai password roi', 'Nhap lai di')
  }

}