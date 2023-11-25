import {Controller, Post, Body} from '@nestjs/common'
import { UserService } from './user.service';

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


}
