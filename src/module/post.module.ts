import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostRepository } from 'api/post/post.repository';
import { SpaceRepository } from 'api/space/space.repository';
import { SpaceModule } from './\bspace.module';
import { AuthModule } from './auth.module';
import { UserRepository } from 'api/user/user.repository';
import { PostController } from 'api/post/post.controller';
import { PostService } from 'api/post/post.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostRepository, SpaceRepository, UserRepository]),
    SpaceModule,
  ],
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService],
})
export class PostModule {}
