import {
    Body,
    Controller,
    Delete,
    Get,
    HttpException,
    HttpStatus,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    UseGuards,
    
  } from '@nestjs/common';
  import { AuthGuard } from '@nestjs/passport';
import { SpaceService } from 'api/space/space.service';
import { User } from 'api/user/user.decorator';
import { PostService } from './post.service';
  
  @Controller('posts')
  @UseGuards(AuthGuard('jwt'))
  export class PostController {
    constructor(
      private readonly postService: PostService ,
      private readonly spaceService: SpaceService,
    ) {}
  
    @Post()
    async createPost(
      @User() user: { userId: number },
      @Body() createPostData
    ): Promise<object> {
      const { spaceId } = createPostData;
      const { ownerId, members } = await this.spaceService.findMember(spaceId);
  
      if (!members.includes(user.userId))
        throw new HttpException(
          {
            success: false,
            message: '접근할 수 없습니다.',
          },
          HttpStatus.FORBIDDEN,
        );
      if (ownerId == user.userId) createPostData['category'] = 'Notice';
      else createPostData['category'] = 'Question';
  
      return this.postService.createPost(user.userId, createPostData);
    }
  
}