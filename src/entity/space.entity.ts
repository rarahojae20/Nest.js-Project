import { Post } from '@nestjs/common';
import { User } from './user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  JoinTable,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
// import { Post } from './post.entity';

@Entity()
export class Space {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  spaceId: number;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date | null;

  @ManyToOne(() => User, (user) => user.ownSpaces, { onDelete: 'SET NULL' })
  owner: User;

  @ManyToMany(() => User, (user) => user.spaces)
  users: User[];
  
}

