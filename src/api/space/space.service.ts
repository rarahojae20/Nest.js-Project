
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SpaceRepository } from './space.repository';
import { UserRepository } from '../user/user.repository';


@Injectable()
export class SpaceService {
  constructor(
    @InjectRepository(SpaceRepository) private spaceRepository: SpaceRepository,
    private userRepository: UserRepository,
  ) {}

  async createSpace(userId: number, createSpaceData): Promise<object> {
    const { name } = createSpaceData;
    const user = await this.userRepository.findOne(
      { where: { userId }, relations: ['spaces'] }
    );    
        if (!user)
        throw new HttpException(
        {
          success: false,
          message: '접근권한 없음',
        },
        HttpStatus.NOT_FOUND,
      );
    const space = await this.spaceRepository.save({ name: name, owner: user });
    user.spaces.push(space);
    await this.userRepository.save(user);

    return { success: true, message: '공간 생성 성공.' };
  }

  async joinSpace(userId: number, spaceId: number): Promise<object> {
    const user = await this.userRepository.findOne(
        { where: { userId }, relations: ['spaces'] }
        );
    const space = await this.spaceRepository.findOne(
      { where: {spaceId}
    });

    user.spaces.push(space);
    await this.userRepository.save(user);

    return { success: true, message: '공간 참여 성공.' };
  }

  async findAllSpace(keyword: string): Promise<object> {
    const spaces = await this.spaceRepository.findAllSpace(keyword);

    if (spaces.length == 0)
      throw new HttpException(
        {
          success: false,
          message: '공간을 찾을 수 없음.',
        },
        HttpStatus.NOT_FOUND,
      );
    return {
      success: true,
      message: '공간 조회 성공.',
      result: spaces.map((space) => {
        space['memberCount'] = +space['memberCount'];
        return space;
      }),
    };
  }

  async findMember(
    spaceIdx: number,
  ): Promise<{ ownerId: number; members: number[] }> {
    const result = await this.spaceRepository.findMember(spaceIdx);
    if (result.length == 0)
      throw new HttpException(
        {
          success: false,
          message: '공간을 찾을 수 없습니다.',
        },
        HttpStatus.NOT_FOUND,
      );
    const rt: number[] = [];
    result.map((user) => rt.push(user.userIdx));
    return { ownerId: result[0].ownerIdx, members: rt };
  }


}