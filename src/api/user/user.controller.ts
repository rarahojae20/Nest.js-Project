import {Controller, Post, Body, Get, UseGuards, Param} from '@nestjs/common'
import { UserService } from './user.service';
import { JwtAuthGuard } from './auth/auth.jwt.guard';



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
  public async getUser(@Param() userId): Promise<object> {
    return this.userService.getUser(userId);
  }


}


/*
3. 유저는 자신의 프로필을 조회하고, 이메일을 제외한 나머지를 수정할 수 있습니다.
4. 유저는 자신이 작성한 글 목록 및 댓글 목록을 모아볼 수 있습니다.
*/