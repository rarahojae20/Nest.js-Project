import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from '../api/user/user.controller';
import { UserService } from '../api/user/user.service';
import { UserRepository } from '../api/user/user.repository'
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository])],
  controllers: [UserController],
  providers: [UserService, JwtService], // JwtService를 UserService의 provider로 제공합니다.
  exports: [UserService],
})
export class UserModule {}
