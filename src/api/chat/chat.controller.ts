import {
    Body,
    Controller,
    Delete,
    HttpException,
    HttpStatus,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    UseGuards,
  } from '@nestjs/common';
  import { AuthGuard } from '@nestjs/passport';
import { PostService } from 'api/post/post.service';
import { SpaceService } from 'api/space/space.service';
import { User } from 'decorator/user.decorator';
import { ChatService } from './chat.service';
  
  @Controller('chats')
  @UseGuards(AuthGuard('jwt'))
  export class ChatController {
    constructor(
      private readonly chatService: ChatService,
      private readonly spaceService: SpaceService,
      private readonly postService: PostService,
    ) {}
  
    @Post()
    async createChat(
      @User() user: { userId: number },
      @Body() createChatData,
    ): Promise<object> {
      const { postId } = createChatData;
      const spaceId = await this.postService.selectBySpaceId(postId);
      const { members } = await this.spaceService.findMember(spaceId);
  
      if (!members.includes(user.userId))
        throw new HttpException(
          {
            success: false,
            message: '접근할 수 없습니다.',
          },
          HttpStatus.FORBIDDEN,
        );
      return this.chatService.createChat(user.userId, createChatData);
    }
  
    @Patch('/:chatId')
    async patchChat(
      @User() user: { userId: number },
      @Param('chatId', ParseIntPipe) chatId: number,
      @Body() updateChatData
    ) {
      const writerId = await this.chatService.findWriterId(chatId);
      if (user.userId != writerId)
        throw new HttpException(
          {
            success: false,
            message: '접근할 수 없습니다.',
          },
          HttpStatus.FORBIDDEN,
        );
      return this.chatService.updateChat(chatId, updateChatData);
    }
  
    @Patch('/:chatId/restore')
    async restoreChat(
      @User() user: { userId: number },
      @Param('chatId', ParseIntPipe) chatId: number,
    ) {
      const writerId = await this.chatService.findWriterId(chatId);
      if (user.userId != writerId)
        throw new HttpException(
          {
            success: false,
            message: '접근할 수 없습니다.',
          },
          HttpStatus.FORBIDDEN,
        );
      return this.chatService.restoreChat(chatId);
    }
  
    @Delete('/:chatId')
    async deleteChat(
      @User() user: { userId: number },
      @Param('chatId', ParseIntPipe) chatId: number,
    ) {
      const { writerId, ownerId } =
        await this.chatService.findWriterAndOwnerId(chatId);
      if (user.userId != writerId && user.userId != ownerId)
        throw new HttpException(
          {
            success: false,
            message: '접근할 수 없습니다.',
          },
          HttpStatus.FORBIDDEN,
        );
      return this.chatService.deleteChat(chatId);
    }
  }
  