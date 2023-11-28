import { Controller, UseGuards,Post,Body, Get, Query, ParseIntPipe, Param, HttpException, HttpStatus, Patch, Delete} from '@nestjs/common'
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
    @User() user: { userId: number },
    @Body() joinSpaceData: any,
  ) {
    return this.spaceService.joinSpace(user.userId, joinSpaceData.spaceId);
  }

  @Get()
  findAllSpace(@Query('keyword') keyword: string | null): Promise<object> {
    return this.spaceService.findAllSpace(keyword ? keyword : '');
  }

  //////

  
  @Get('/:spaceId')
  async getSpaceDetail(
    @User() user: { userId: number },
    @Param('spaceId', ParseIntPipe) spaceId: number,
  ): Promise<object> {
    const { members } = await this.spaceService.findMember(spaceId);

    if (!members.includes(user.userId))
      throw new HttpException(
        {
          success: false,
          message: '접근할 수 없습니다.(공간의 멤버가 아닙니다.)',
        },
        HttpStatus.FORBIDDEN,
      );
    return this.spaceService.readSpaceDetail(spaceId);
  }

  @Patch('/:spaceId')
  async patchSpace(
    @User() user: { userId: number },
    @Param('spaceId', ParseIntPipe) spaceId: number,
    @Body() updateSpaceData
  ) {
    const ownerId = await this.spaceService.findOwnerId(spaceId);
    if (user.userId != ownerId)
      throw new HttpException(
        {
          success: false,
          message: '접근할 수 없습니다.',
        },
        HttpStatus.FORBIDDEN,
      );
    return this.spaceService.updateSpace(spaceId, updateSpaceData);
  }


  @Patch('/:spaceId/restore')
  async restoreSpace(
    @User() user: { userId: number },
    @Param('spaceId', ParseIntPipe) spaceId: number,
  ) {
    const ownerId = await this.spaceService.findOwnerId(spaceId);
    if (user.userId != ownerId)
      throw new HttpException(
        {
          success: false,
          message: '접근할 수 없습니다.',
        },
        HttpStatus.FORBIDDEN,
      );
    return this.spaceService.restoreSpace(spaceId);
  }

  @Delete('/:spaceId')
  async deleteSpace(
    @User() user: { userId: number },
    @Param('spaceId', ParseIntPipe) spaceId: number,
  ) {
    const ownerId = await this.spaceService.findOwnerId(spaceId);
    if (user.userId != ownerId)
      throw new HttpException(
        {
          success: false,
          message: '접근할 수 없습니다.',
        },
        HttpStatus.FORBIDDEN,
      );
    return this.spaceService.deleteSpace(spaceId);
  }


  
}


