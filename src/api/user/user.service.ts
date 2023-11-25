import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService { 
    constructor(@InjectRepository(UserRepository) private userRepository: UserRepository,
    ){}
    
        async Signup(userData): Promise<object> {
            await this.checkEmail(userData.email);
            const result = await this.userRepository.Signup(userData);
            return result
            ? {success: true, message: '회원가입에 성공' }
            : { success: false, message: '회원가입에 실패' };
    }    

    async checkEmail(email: string): Promise<object> {
        const checkResult = await this.userRepository.checkEmail(email);
        if (checkResult)
          throw new HttpException(
            {
              success: false,
              message: '중복! 다른 이메일을 사용 해주세요.',
            },
            HttpStatus.FORBIDDEN,
          );
        return { success: true, message: '이메일 사용 가능' };
      }   
}