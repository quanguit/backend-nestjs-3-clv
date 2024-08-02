import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async findAll() {
    return this.userRepository.find();
  }

  async findOne(id: string) {
    try {
      const user = await this.userRepository.findOneBy({ id });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return user;
    } catch (error) {
      if (error?.code === '22P02') {
        throw new NotFoundException('User not found');
      }
      throw error;
    }
  }

  async create(body: CreateUserDto) {
    try {
      const user = await this.userRepository.findOneBy({
        username: body.username,
      });

      if (user) {
        throw new ConflictException('User already exists');
      }

      const hashPassword = await bcrypt.hash(body.password, 10);
      return this.userRepository.save({
        ...body,
        password: hashPassword,
      });
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, body: UpdateUserDto) {
    try {
      let hashPassword = '';
      const user = await this.userRepository.findOneBy({ id });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (body.password) {
        hashPassword = await bcrypt.hash(body.password, 10);
      }

      Object.assign(user, {
        ...body,
        password: body.password ? hashPassword : user.password,
      });

      return this.userRepository.save(user);
    } catch (error) {
      throw error;
    }
  }

  async delete(id: string) {
    try {
      const user = await this.userRepository.findOneBy({ id });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return this.userRepository.remove(user);
    } catch (error) {
      throw error;
    }
  }
}
