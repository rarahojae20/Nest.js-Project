import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatRepository } from 'api/chat/chat.repository';
import { PostRepository } from 'api/post/post.repository';
import { UserRepository } from 'api/user/user.repository';
import { PostModule } from './post.module';
import { SpaceModule } from './space.module';
import { ChatController } from 'api/chat/chat.controller';
import { ChatService } from 'api/chat/chat.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatRepository, PostRepository, UserRepository]),
    SpaceModule,
    PostModule,
  ],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
