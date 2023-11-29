import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostRepository } from 'api/post/post.repository';
import { UserRepository } from 'api/user/user.repository';
import { ChatRepository } from './chat.repository';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatRepository) private chatRepository: ChatRepository,
    private postRepository: PostRepository,
    private userRepository: UserRepository,
  ) {}

  async createChat(
    userId: number,
    createChatDto
  ): Promise<object> {
    const { postId, parentId, content } = createChatDto;
    const post = await this.postRepository.findOne({
      where: { postId },
      relations: ['chats'],
    });
  
    const user = await this.userRepository.findOne({
      where: { userId },
      relations: ['chats'],
    });
  
    const chat = await this.chatRepository.save({ content, parentId });
    if (parentId) {
      const parentChat = await this.chatRepository.findOne({
        where: { chatId: parentId},
        relations: ['chats'],
      })
      
      if (!parentChat)
        throw new HttpException(
          {
            success: false,
            message: '댓글을 찾을 수 없습니다.',
          },
          HttpStatus.NOT_FOUND,
        );
      parentChat.rechat.push(chat);
      await this.chatRepository.save(parentChat);
    }
    post.chats.push(chat);
    user.chats.push(chat);
    await this.postRepository.save(post);
    await this.userRepository.save(user);

    return { success: true, message: '댓글이 생성되었습니다.' };
  }

  async updateChat(chatId: number, chat): Promise<object> {
    const updateResult = await this.chatRepository.update(chatId, chat);
    if (updateResult.affected == 0)
      throw new HttpException(
        {
          success: false,
          message: '댓글을 찾을 수 없습니다.',
        },
        HttpStatus.NOT_FOUND,
      );
    return {
      success: true,
      message: '댓글이 수정되었습니다.',
    };
  }

  async restoreChat(chatId: number): Promise<object> {
    const restoreResult = await this.chatRepository.restore({
      chatId: chatId,
    });
    if (restoreResult.affected == 0)
      throw new HttpException(
        {
          success: false,
          message: '댓글을 찾을 수 없습니다.',
        },
        HttpStatus.NOT_FOUND,
      );
    else return { success: true, message: '댓글이 복구되었습니다.' };
  }

  async deleteChat(chatId: number): Promise<object> {
    const deleteResult = await this.chatRepository.softDelete({ chatId });
    if (deleteResult.affected == 0)
      throw new HttpException(
        {
          success: false,
          message: '댓글을 찾을 수 없습니다.',
        },
        HttpStatus.NOT_FOUND,
      );
    else return { success: true, message: '댓글이 삭제되었습니다.' };
  }

  async findWriterId(chatId: number): Promise<number> {
    return await this.chatRepository.selectWriterId(chatId);
  }

  async findWriterAndOwnerId(
    chatId: number,
  ): Promise<{ writerId: number; ownerId: number }> {
    const result = await this.chatRepository.selectWriterAndOwnerId(chatId);
    if (!result)
      throw new HttpException(
        {
          success: false,
          message: '댓글을 찾을 수 없습니다.',
        },
        HttpStatus.NOT_FOUND,
      );
    return result;
  }
}
