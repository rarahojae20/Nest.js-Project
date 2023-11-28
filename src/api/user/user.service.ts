// user/user.service.ts

import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async Signup(userData): Promise<object> {
    try {
      const result = await this.userRepository.save(userData);
      return result
        ? { success: true, message: '회원가입에 성공' }
        : { success: false, message: '회원가입에 실패' };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: '중복! 다른 이메일을 사용 해주세요.',
        },
        HttpStatus.FORBIDDEN
      );
    }
  }



  async login(loginData): Promise<object> {
    try {
      const { email, password } = loginData;
      const user = await this.userRepository.findOne({ where: { email } });

      if (!user) {
        throw new UnauthorizedException('해당 이메일을 가진 사용자를 찾을 수 없습니다.');
      }

      const isPasswordValid = await this.comparePassword(
        password,
        user.password,
      );
      if (!isPasswordValid) {
        throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
      }

      const token = this.generateToken(user);
      return {
        success: true,
        message: `로그인 성공. 토큰 : ${token}`,
      };
    } catch (error) {
      console.error('Error while logging in:', error);
      throw new UnauthorizedException('로그인 중 오류가 발생했습니다.');
    }
  }

  private async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  private generateToken(userData): string {
    const payload = { id: userData.id, email: userData.email };
    return this.jwtService.sign(payload);
  }

  async getUser(userId): Promise<object> {
    const user = await this.userRepository.getUser(userId);
    return user;
  }
}
