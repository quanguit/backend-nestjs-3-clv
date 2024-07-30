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

  async findOne(id: number) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async create(body: CreateUserDto) {
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
  }

  async update(id: number, body: UpdateUserDto) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const hashPassword = await bcrypt.hash(body.password, 10);

    Object.assign(user, {
      ...body,
      password: hashPassword,
    });

    return this.userRepository.save(user);
  }

  async delete(id: number) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.userRepository.remove(user);
  }
}
