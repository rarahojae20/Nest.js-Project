import { HttpException, HttpStatus } from '@nestjs/common';
import { User } from '../../entity/user.entity'
import { EntityRepository, Repository } from 'typeorm';


@EntityRepository(User)
export class UserRepository extends Repository<User> {

    async createUser(userData): Promise<any> {
    const user = this.create(userData);
    const result = await this.save(user);
    return result;
  }

  async selectUserByEmail(email: string): Promise<User> {
    const user = await this.findOne({
      where: { email: email },
      withDeleted: true,
      select: ['userId', 'email', 'password', 'deletedAt'],
    });
    return user;
  }
  
    async login(email: string, password: string): Promise<User | undefined> {
      const user = await this.findOne({
        where: { email: email, password: password},
        select: ['email', 'password', 'lastName' ,'firstName'],
      })
      return user;
    }


    async selectUserInfo(userId: number): Promise<User> {
      const user = await this.findOne({
        where: { userId },
        select: ['email', 'firstName', 'lastName'],
      });
      return user;
    }
      
  
      async getUser(userId: number, requestUserId?: number): Promise<User | undefined> { // 후에 토큰 헤더로부터 id 정보 가져옴
        const selectColumns: (keyof User)[] = ['firstName', 'lastName'];
        
        if (requestUserId && requestUserId !== userId) {
          selectColumns.push('email');
        }
      
        const user = await this.findOne({
          where: { userId: userId },
          select: selectColumns,
        });
  
        return user;
      }

      async updateUser(userId: number,updateUser,): Promise<object> {
        const user = await this.findOne({
          where: { userId: userId },
        });
        Object.keys(updateUser).forEach((key) => {
          user[key] = updateUser[key];
        });
        await this.save(user);
        const { email, firstName, lastName } = user;
        return { email, firstName, lastName };
      }

      async deleteUser(userId: number): Promise<object> {
        const user = await this.findOne({
          where: { userId: userId },
        });
        if (!user) {
          throw new HttpException(
            {
              success: false,
              message: '회원정보를 찾을 수 없습니다.',
            },
            HttpStatus.NOT_FOUND,
          );
        }
      
        await this.remove(user);
        return {user};
      }
    }
  


    
  