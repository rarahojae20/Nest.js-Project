import { BeforeInsert,BeforeUpdate,Column,Entity,JoinTable,ManyToMany,OneToMany,PrimaryGeneratedColumn} from 'typeorm';
  import * as bcrypt from 'bcrypt';
  import { InternalServerErrorException } from '@nestjs/common';
  import { Space } from './space.entity';

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
    
    @OneToMany(() => Space, (space) => space.owner, { nullable: true })
    ownSpaces: Space[];
    
    @ManyToMany(() => Space, (space) => space.users)
    @JoinTable({
      name: 'user_space',
      joinColumn: {
        name: 'userIdx',
        referencedColumnName: 'userIdx',
      },
      inverseJoinColumn: {
        name: 'spaceIdx',
        referencedColumnName: 'spaceIdx',
      },
    })
    spaces: Space[];

    public hashPassword = async(password: string)=> {
          const hashedPassword = await bcrypt.hash(this.password, 10);
          this.password = hashedPassword;
        }

    public checkPassword = async (password: string): Promise<boolean> => {
        return bcrypt.compare(password, this.password);
      };
  }