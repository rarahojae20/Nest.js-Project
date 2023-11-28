import {Controller, Post, Body, Get, UseGuards, Param, Patch, ParseIntPipe, HttpException, HttpStatus, Delete} from '@nestjs/common'
import { UserService } from './user.service';
import { JwtAuthGuard } from './auth/auth.jwt.guard';
import { User } from './user.decorator';



@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/signup')
  public async SignUp (@Body() userData): Promise<object> {
    return this.userService.Signup(userData);
  }

  @Post('/login')
  public async login(@Body() loginData): Promise<object> {
    return this.userService.login(loginData);
  }
    
  @UseGuards(JwtAuthGuard)
  @Get('/:userId')
  public async getUser(@Param('userId',ParseIntPipe) userId): Promise<object> {
    return this.userService.getUser(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/:userId')
  patchUser(
    @User() user: { userId: number },
    @Param('userId',ParseIntPipe) userId: number,
    @Body() updateUserData
  ) {
    if (user.userId != userId)
      throw new HttpException(
        {
          success: false,
          message: '접근할 수 없습니다.',
        },
        HttpStatus.FORBIDDEN,
      );
    return this.userService.updateUser(userId, updateUserData);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/:userId/restore')
  restoreUser(
    @User() user: { userId: number },
    @Param('userId',ParseIntPipe) userId: number,
  ) {
    if (user.userId != userId)
      throw new HttpException(
        {
          success: false,
          message: '접근할 수 없습니다.',
        },
        HttpStatus.FORBIDDEN,
      );
    return this.userService.restoreUser(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:userId')
  deleteUser(
    @User() user: { userId: number },
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    if (user.userId != userId)
      throw new HttpException(
        {
          success: false,
          message: '접근할 수 없습니다.',
        },
        HttpStatus.FORBIDDEN,
      );
    return this.userService.deleteUser(userId);
  }
}


/*
3. 유저는 자신의 프로필을 조회하고, 이메일을 제외한 나머지를 수정할 수 있습니다.
4. 유저는 자신이 작성한 글 목록 및 댓글 목록을 모아볼 수 있습니다.
*/