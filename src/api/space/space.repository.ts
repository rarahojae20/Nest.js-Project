import { Space } from '../../entity/space.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Space)
export class SpaceRepository extends Repository<Space> {

    async findAllSpace(keyword: string): Promise<object[]> {
        const result = await this.createQueryBuilder('space')
          .where('space.name like :keyword', { keyword: `%${keyword}%` })
          .select([
            'space.spaceId',
            'space.name',
            'space.createdAt',
            'space.updatedAt',
          ])
          .leftJoin('space.users', 'users')
          .addGroupBy('space.spaceId')
          .getRawMany();
    
        return result;
      }
      async findMember(spaceIdx: number): Promise<any[]> {
        const result = await this.createQueryBuilder('space')
          .where('space.spaceIdx = :spaceIdx', { spaceIdx: `${spaceIdx}` })
          .leftJoin('space.users', 'users')
          .leftJoin('space.owner', 'owner')
          .select(['users.userIdx as userIdx', 'owner.userIdx as ownerIdx'])
          .getRawMany();
        return result;
      }
    
    
}