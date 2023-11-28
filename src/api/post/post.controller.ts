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
    
  } 
from '@nestjs/common';
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

    @Get()
    async getAllPost(
      @User() user: { userId: number },
      @Query('spaceId') spaceId: number,
      @Query('keyword') keyword: string | null,
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
      return this.postService.selectAllPost(spaceId, keyword ? keyword : '');
    }

    @Get('/:postId')
    async getPostDetail(
      @User() user: { userId: number },
      @Param('postId', ParseIntPipe) postId: number,
    ): Promise<object> {
      const spaceId = await this.postService.selectBySpaceId(postId);
      const { members } = await this.spaceService.findMember(spaceId);
  
      if (!members.includes(user.userId))
        throw new HttpException(
          {
            success: false,
            message: '접근할 수 없습니다.(공간의 멤버가 아닙니다.)',
          },
          HttpStatus.FORBIDDEN,
        );
      return this.postService.readPostDetail(postId);
    }
  
    @Patch('/:postId')
    async patchPost(
      @User() user: { userId: number },
      @Param('postId', ParseIntPipe) postId: number,
      @Body() updatePostData,
    ) {
      const writerId = await this.postService.selectByWriterId(postId);
      if (user.userId != writerId)
        throw new HttpException(
          {
            success: false,
            message: '접근할 수 없습니다.',
          },
          HttpStatus.FORBIDDEN,
        );
  
      delete updatePostData.category;
      return this.postService.updatePost(postId, updatePostData);
    }

    
    @Patch('/:postId/restore')
    async restorePost(
      @User() user: { userId: number },
      @Param('postId', ParseIntPipe) postId: number,
    ) {
      const writerId = await this.postService.selectByWriterId(postId);
      if (user.userId != writerId)
        throw new HttpException(
          {
            success: false,
            message: '접근할 수 없습니다.',
          },
          HttpStatus.FORBIDDEN,
        );
      return this.postService.restorePost(postId);
    }
  
    @Delete('/:postId')
    async deletePost(
      @User() user: { userId: number },
      @Param('postId', ParseIntPipe) postId: number,
    ) {
      const { writerId, ownerId } =
        await this.postService.findWriterAndOwnerId(postId);
  
      if (user.userId != writerId && user.userId != ownerId)
        throw new HttpException(
          {
            success: false,
            message: '접근할 수 없습니다.',
          },
          HttpStatus.FORBIDDEN,
        );
      return this.postService.deletePost(postId);
    }
  
  
  
}