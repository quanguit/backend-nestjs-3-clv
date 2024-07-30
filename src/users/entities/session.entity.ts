import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity()
export class SessionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  hash: string;

  @Column({ type: 'boolean', default: false })
  is_logout: boolean;

  @ManyToOne(() => UserEntity, (user) => user.sessions)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
