import { User } from '../../entity/user.entity'
import { EntityRepository, Repository } from 'typeorm';


@EntityRepository(User)
export class UserRepository extends Repository<User> {
  
    async Signup(userData): Promise<any> {
    const user = this.create(userData);
    const result = await this.save(user);
    return result;
  }

  async checkEmail(email) {
    const user = await this.findOne({
        where: { email: email },
        withDeleted: true,
        select: ['email', 'password',],
      });
      return user;
    }
  
  }