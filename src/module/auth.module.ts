//auth.module.ts


import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from './user.module';
import { UserService } from 'api/user/user.service';
import { UserController } from 'api/user/user.controller';
import { JwtAuthGuard } from 'api/user/auth/auth';

@Module({
  imports: [
    PassportModule,
    UserModule,
    JwtModule.register({
      secret: 'classuum',
      signOptions: { expiresIn: '1h' },
    }),],
    providers: [UserService, JwtAuthGuard],
    exports: [UserService, JwtAuthGuard],
    controllers: [UserController],
  })
export class AuthModule {}
