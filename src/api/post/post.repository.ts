import { Post } from '../../entity/post.enity';
import { EntityRepository, Repository } from 'typeorm';


function parseColumn(column: Array<string>, prefix: string) {
  return column.map((col) => prefix + col);
}

@EntityRepository(Post)
export class PostRepository extends Repository<Post> {
  
    async selectAllPost(spaceId: number, keyword: string): Promise<object[]> {
        const result = await this.createQueryBuilder('post')
          .leftJoin('post.writer', 'writer')
          .leftJoin('post.space', 'space')
          .where('space.spaceId = :spaceId', { spaceId: spaceId })
          .select([
            'post.postId as postId',
            'post.title as title',
            'writer.firstName as firstName',
            'writer.lastName as lastName',
            'post.createdAt as createdAt',
            'post.updatedAt as updatedAt',
          ])
          .orderBy('post.createdAt', 'DESC')
          .getRawMany();
          return result;
        }
        
    async selectByWriterId(postId: number): Promise<number> {
        const result = await this.createQueryBuilder('post')
          .where('post.postId = :postId', { postId: `${postId}` })
          .leftJoinAndSelect('post.writer', 'writer')
          .withDeleted()
          .getOne();
        return result ? result.writer.userId : 0;
      }
    
      async selectBySpaceId(postId: number): Promise<any> {
        const result = await this.createQueryBuilder('post')
          .where('post.postId = :postId', { postId: `${postId}` })
          .select('post.spaceSpaceId as spaceId')
          .withDeleted()
          .getRawOne();
    
        return result;
      }
    
      async selectWriterAndOwnerId(postId: number): Promise<any> {
        const result = await this.createQueryBuilder('post')
          .where('post.postId = :postId', { postId: `${postId}` })
          .leftJoin('post.space', 'space')
          .select(['post.writer as writer', 'space.owner as owner'])
          .withDeleted()
          .getRawOne();
        return result;
      }
    
      async selectPostDetail(postId: number): Promise<Post> {
        const result = await this.createQueryBuilder('post')
          .leftJoin('post.writer', 'postWriter')
          .where('post.postId = :postId', { postId: `${postId}` })
          .select([
            ...parseColumn(
              ['postId', 'title', 'content', 'category', 'createdAt', 'updatedAt'],
              'post.',
            ),
            ...parseColumn(
              ['userId', 'email', 'firstName', 'lastName'],
              'postWriter.',
            ),
          ])
          .getOne();
        return result;
      }
    
}

