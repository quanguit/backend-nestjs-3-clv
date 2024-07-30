import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SessionEntity } from './session.entity';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @CreateDateColumn()
  created_date: Date;

  @CreateDateColumn()
  updated_date: Date;

  @OneToMany(() => SessionEntity, (session) => session.user)
  sessions: SessionEntity[];
}
