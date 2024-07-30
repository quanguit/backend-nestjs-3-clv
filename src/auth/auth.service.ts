import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { SessionEntity } from 'src/users/entities/session.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { LoginDto } from './dtos/login.dto';
import { RefreshTokenDto } from './dtos/refresh-token.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(SessionEntity)
    private sessionReposity: Repository<SessionEntity>,
    private jwtService: JwtService,
  ) {}

  private async generateToken(payload: {
    id: number;
    username: string;
    session: SessionEntity;
  }) {
    const access_token_payload = {
      id: payload.id,
      username: payload.username,
      session_id: payload.session.id,
    };
    const refresh_token_payload = {
      session_id: payload.session.id,
      hash: payload.session.hash,
      user_id: payload.id,
    };

    const access_token = this.jwtService.sign(access_token_payload);
    const refresh_token = this.jwtService.sign(refresh_token_payload, {
      expiresIn: '7d',
    });

    const currentTime = Math.floor(Date.now() / 1000);
    const expiredIn =
      currentTime +
      this.jwtService.decode(access_token).exp -
      this.jwtService.decode(access_token).iat;

    return {
      access_token,
      refresh_token: refresh_token,
      expiredIn,
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { username: loginDto.username },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const checkPassword = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!checkPassword) {
      throw new UnauthorizedException('Password is wrong');
    }

    const hash = bcrypt.hashSync(`${user.id}-${Date.now()}`, 10);
    const session = await this.sessionReposity.create({
      user,
      hash,
    });
    await this.sessionReposity.save(session);

    return this.generateToken({
      id: user.id,
      username: user.username,
      session,
    });
  }

  async refreshToken(body: RefreshTokenDto) {
    const payload = this.jwtService.decode(body.refresh_token);

    // find session by sessionID
    const session = await this.sessionReposity.findOneBy({
      id: payload.session_id,
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    // compare hash
    const checkHash = session.hash === payload.hash;

    if (!checkHash) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.userRepository.findOneBy({
      id: payload.user_id,
    });

    const hash = bcrypt.hashSync(`${user.id}-${Date.now()}`, 10);

    Object.assign(session, {
      user,
      hash,
    });

    await this.sessionReposity.save(session);

    // generate new access token
    return this.generateToken({
      id: user.id,
      username: user.username,
      session,
    });
  }
}
