import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SpaceRepository } from '../../api/space/space.repository';
import { UserRepository } from '../../api/user/user.repository';
import { PostRepository } from './post.repository';
import { Post } from 'entity/post.enity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostRepository) private postRepository: PostRepository,
    private spaceRepository: SpaceRepository,
    private userRepository: UserRepository
  ) {}

  async createPost(
    userId: number,
    createPostData
  ): Promise<object> {
    const { spaceId, title, content, category } = createPostData;
    const space = await this.spaceRepository.findOne(
        {where : { spaceId : spaceId }, relations: ['posts'] }
    );

    const user = await this.userRepository.findOne(
        {where : { userId : userId}, relations: ['posts'] }
    );

    const post = await this.postRepository.save({ title, content, category });
    space.posts.push(post);
    user.posts.push(post);
    await this.spaceRepository.save(space);
    await this.userRepository.save(user);

    return { success: true, message: '게시글 생성에 성공.' };
  }

  async selectAllPost(spaceId: number, keyword: string): Promise<object> {
    const posts = await this.postRepository.selectAllPost(spaceId, keyword);

    if (posts.length == 0)
      throw new HttpException(
        {
          success: false,
          message: '게시물을 찾을 수 없습니다.',
        },
        HttpStatus.NOT_FOUND,
      );
    return {
      success: true,
      message: '게시물 조회에 성공했습니다.',
      result: posts,
    };
  }

  async selectByWriterId(postId: number): Promise<number> {
    return await this.postRepository.selectByWriterId(postId);
  }

  async selectBySpaceId(postId: number): Promise<number> {
    const result = await this.postRepository.selectBySpaceId(postId);
    if (!result || result.deletedAt)
      throw new HttpException(
        {
          success: false,
          message: '게시물 혹은 공간을 찾을 수 없습니다.',
        },
        HttpStatus.NOT_FOUND,
      );
    return result.spaceId;
  }

  async readPostDetail(postId: number): Promise<object> {
    const post = await this.postRepository.selectPostDetail(postId);

    if (!post)
      throw new HttpException(
        {
          success: false,
          message: '게시물을 찾을 수 없습니다.',
        },
        HttpStatus.NOT_FOUND,
      );
    return {
      success: true,
      message: '게시물 상세조회에 성공했습니다.',
      result: post,
    };
  }

  async updatePost(postId: number, post): Promise<object> {
    const updateResult = await this.postRepository.update(postId, post);
    if (updateResult.affected == 0)
      throw new HttpException(
        {
          success: false,
          message: '게시물을 찾을 수 없습니다.',
        },
        HttpStatus.NOT_FOUND,
      );
    return {
      success: true,
      message: '게시물이 수정되었습니다.',
    };
  }

  async restorePost(postId: number): Promise<object> {
    const restoreResult = await this.postRepository.restore({
      postId: postId,
    });
    if (restoreResult.affected == 0)
      throw new HttpException(
        {
          success: false,
          message: '게시물을 찾을 수 없습니다.',
        },
        HttpStatus.NOT_FOUND,
      );
    else return { success: true, message: '게시물이 복구되었습니다.' };
  }

  async deletePost(postId: number): Promise<object> {
    const deleteResult = await this.postRepository.softDelete({ postId });
    if (deleteResult.affected == 0)
      throw new HttpException(
        {
          success: false,
          message: '게시물을 찾을 수 없습니다.',
        },
        HttpStatus.NOT_FOUND,
      );
    else return { success: true, message: '게시물이 삭제되었습니다.' };
  }
  async findWriterAndOwnerId(
    postId: number,
  ): Promise<{ writerId: number; ownerId: number }> {
    const result = await this.postRepository.selectWriterAndOwnerId(postId);
    if (!result || result.deletedAt)
      throw new HttpException(
        {
          success: false,
          message: '게시물 혹은 공간을 찾을 수 없습니다.',
        },
        HttpStatus.NOT_FOUND,
      );
    return result;
  }



}
