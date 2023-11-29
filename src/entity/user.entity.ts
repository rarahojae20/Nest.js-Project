import { BeforeInsert,BeforeUpdate,Column,CreateDateColumn,DeleteDateColumn,Entity,JoinTable,ManyToMany,OneToMany,PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';
  import * as bcrypt from 'bcrypt';
  import { InternalServerErrorException } from '@nestjs/common';
  import { Space } from './space.entity';
import { Post } from './post.enity';
import { Chat } from './chat.enity';

  @Entity()
  export class User {  //이메일, 성, 이름, 프로필
    
    @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
    userId: number;

    @Column({ type: 'varchar', length: 50, unique: true })
    email: string; //이메일 
  
    @Column({ type: 'text', select: false })
    password: string; //비밀번호

    @Column({ type: 'varchar', length: 10 })
    firstName: string; //성
  
    @Column({ type: 'varchar', length: 10 })
    lastName: string; //이름

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;
  
    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
  
    @DeleteDateColumn({ type: 'timestamp' })
    deletedAt: Date | null;  
    
    @OneToMany(() => Space, (space) => space.owner, { nullable: true })
    ownSpaces: Space[];

    @OneToMany(() => Post, (post) => post.writer, { nullable: true })
    posts: Post[];

    @OneToMany(() => Chat, (chat) => chat.writer, { nullable: true })
    chats: Chat[];  
    
    @ManyToMany(() => Space, (space) => space.users)
    @JoinTable({
      name: 'user_space',
      joinColumn: {
        name: 'userId',
        referencedColumnName: 'userId',
      },
      inverseJoinColumn: {
        name: 'spaceId',
        referencedColumnName: 'spaceId',
      },
    })
    spaces: Space[];

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword(): Promise<void> {
      try {
        if (this.password) {
          const hashedPassword = await bcrypt.hash(this.password, 10);
          this.password = hashedPassword;
        }
      } catch (error) {
        console.error('Error hashing password:', error);
        throw error;
      }
    }
  
    async checkPassword(password: string): Promise<boolean> {
      try {
        return await bcrypt.compare(password, this.password);
      } catch (error) {
        console.error('Error comparing passwords:', error);
        throw error;
      }
    }
  }
  