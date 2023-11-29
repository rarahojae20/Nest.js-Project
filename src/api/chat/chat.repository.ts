
import { Chat } from 'entity/chat.enity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Chat)
export class ChatRepository extends Repository<Chat> {
  async selectChatAll(postId: number): Promise<object[]> {
    const result = await this.createQueryBuilder('chat')
      .leftJoin('chat.writer', 'writer')
      .leftJoin('chat.post', 'post')
      .where('post.postId = :postId', { postId: postId })
      .select([
        'chat.chatId as chatId',
        'chat.title as title',
        'writer.firstName as firstName',
        'writer.lastName as lastName',
        'chat.createdAt as createdAt',
        'chat.updatedAt as updatedAt',
      ])
      .getRawMany();
    return result;
  }

  async selectChatDetail(chatId: number): Promise<Chat> {
    const result = await this.createQueryBuilder('chat')
      .leftJoin('chat.writer', 'writer')
      .where('chat.chatId = :chatId', { chatId: `${chatId}` })
      .select([
        'chat.title as title',
        'chat.content as content',
        'chat.createdAt as createdAt',
        'chat.updatedAt as updatedAt',
        'writer.email as email',
        'writer.firstName as firstName',
        'writer.lastName as lastName',
      ])
      .getRawOne();
    return result;
  }

  async selectWriterId(chatId: number): Promise<number> {
    const result = await this.createQueryBuilder('chat')
      .where('chat.chatId = :chatId', { chatId: `${chatId}` })
      .select('chat.writer')
      .withDeleted()
      .getRawOne();
    return result ? result.writerUserId : 0;
  }

  async selectWriterAndOwnerId(chatId: number): Promise<any> {
    const result = await this.createQueryBuilder('chat')
      .where('chat.chatId = :chatId', { chatId: `${chatId}` })
      .leftJoin('chat.post', 'post')
      .leftJoin('post.space', 'space')
      .select(['chat.writer as writerId', 'space.owner as ownerId'])
      .withDeleted()
      .getRawOne();
    return result;
  }
}
