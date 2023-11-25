import {Controller, Post, Body} from '@nestjs/common'
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  public async SignUp (@Body() userData): Promise<object> {
    return this.userService.Signup(userData);
  }

}