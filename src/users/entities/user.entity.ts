import { Role } from 'src/auth/enums/role.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SessionEntity } from './session.entity';

@Entity('User')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  role: Role.Admin | Role.User;

  @CreateDateColumn()
  created_date: Date;

  @OneToMany(() => SessionEntity, (session) => session.user)
  sessions: SessionEntity[];
}
