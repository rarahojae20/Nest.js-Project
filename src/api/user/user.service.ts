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

  async Signup(createUserData): Promise<object> {
    await this.checkEmail(createUserData.email);
    const result = await this.userRepository.createUser(createUserData);
    return result
      ? { success: true, message: '회원가입에 성공했습니다.' }
      : { success: false, message: '회원가입에 실패했습니다.' };
  }

  async checkEmail(email: string): Promise<object> {
    const checkResult = await this.userRepository.selectUserByEmail(email);
    if (checkResult)
      throw new HttpException(
        {
          success: false,
          message: '이미 존재하는 이메일입니다.',
        },
        HttpStatus.FORBIDDEN,
      );
    else return { success: true, message: '사용가능한 이메일입니다.' };
  }

  async readUserProfile(userId: number): Promise<object> {
    const userInfo = await this.userRepository.selectUserInfo(userId);
    if (!userInfo)
      throw new HttpException(
        {
          success: false,
          message: '회원정보를 찾을 수 없습니다.',
        },
        HttpStatus.NOT_FOUND,
      );
    return {
      success: true,
      message: '회원정보가 조회되었습니다.',
      result: userInfo,
    };
  }

  async updateUser(userId: number, user ): Promise<object> {
    const updateResult = await this.userRepository.updateUser(userId, user);
    return {
      success: true,
      message: '회원정보가 수정되었습니다.',
      result: updateResult,
    };
  }

  async restoreUser(userId: number): Promise<object> {
    const restoreResult = await this.userRepository.restore({
      userId: userId,
    });
    if (restoreResult.affected == 0)
      throw new HttpException(
        {
          success: false,
          message: '회원정보를 찾을 수 없습니다.',
        },
        HttpStatus.NOT_FOUND,
      );
    else return { success: true, message: '계정이 복구되었습니다.' };
  }

  async deleteUser(userId: number): Promise<object> {
    const deleteResult = await this.userRepository.deleteUser(userId);
    
    return { success: true, message: '회원 탈퇴되었습니다.', result: deleteResult };
  }




  async login(loginData): Promise<object> {
    try {
      const { email, password } = loginData;
      const user = await this.userRepository.selectUserByEmail( email);

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
