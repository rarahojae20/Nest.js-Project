import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpaceRepository } from '../api/space/space.repository';
import { UserRepository } from '../api/user/user.repository';
import { SpaceController } from '../api/space/space.controller';
import { SpaceService } from '../api/space/space.service';

@Module({
  imports: [TypeOrmModule.forFeature([SpaceRepository, UserRepository])],
  controllers: [SpaceController],
  providers: [SpaceService],
  exports: [SpaceService],
})
export class SpaceModule {}
