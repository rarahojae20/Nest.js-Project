import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import * as jwt from 'jsonwebtoken';
import { func } from 'joi';
import * as bcrypt from 'bcrypt';


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
            HttpStatus.FORBIDDEN
          );
        return { success: true, message: '이메일 사용 가능' };
      }   

      async login(loginData): Promise<object> {
        try {
            const { email, password } = loginData;
            const user = await this.userRepository.findOne({ where: { email } });

            if (!user) {
                return { success: false, message: '해당 이메일을 가진 사용자를 찾을 수 없습니다.' };
            }

            const isPasswordValid = await this.comparePassword(password, user.password);

            if (!isPasswordValid) {
                return { success: false, message: '비밀번호가 일치하지 않습니다.' };
            }

            const token = this.generateToken(user);
            return {
              success: true,
              message: `로그인 성공. 토큰 : ${token}`,
                   }
        } catch (error) {
            console.error('Error while logging in:', error);
            return { success: false, message: '로그인 중 오류가 발생했습니다.' };
        }
    }

    private async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(password, hashedPassword);
    }

    private generateToken(userData): string {
        const jwtSecretKey = 'classum';
        return jwt.sign({ id: userData.id, email: userData.email }, jwtSecretKey, { expiresIn: '1h' });
    }
}
