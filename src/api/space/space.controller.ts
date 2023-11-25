import { Controller, UseGuards,Post,Body, Get, Query} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport';
import { User } from 'api/user/user.decorator';
import { SpaceService } from './space.service';

@Controller('spaces')
@UseGuards(AuthGuard('jwt'))
export class SpaceController {
  constructor(private readonly spaceService: SpaceService) {}

  @Post()
  createSpace(
    @User() user: { userId: number },
    @Body() createSpaceDate :any
  ): Promise<object> {
    return this.spaceService.createSpace(user.userId, createSpaceDate);
  }
  
  @Post('/join')
  joinSpace(
    @User() user: { userIdx: number },
    @Body() joinSpaceData: any,
  ) {
    return this.spaceService.joinSpace(user.userIdx, joinSpaceData.spaceIdx);
  }

  @Get()
  findAllSpace(@Query('keyword') keyword: string | null): Promise<object> {
    return this.spaceService.findAllSpace(keyword ? keyword : '');
  }
  
}


