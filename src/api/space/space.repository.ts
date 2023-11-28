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
      async findMember(spaceId: number): Promise<any[]> {
        const result = await this.createQueryBuilder('space')
          .where('space.spaceId = :spaceId', { spaceId: `${spaceId}` })
          .leftJoin('space.users', 'users')
          .leftJoin('space.owner', 'owner')
          .select(['users.userId as userId', 'owner.userId as ownerId'])
          .getRawMany();
        return result;
      }
    
      async selectOwnerId(spaceId: number): Promise<number> {
        const result = await this.createQueryBuilder('space')
          .where('space.spaceId = :spaceId', { spaceId: `${spaceId}` })
          .leftJoinAndSelect('space.owner', 'owner')
          .withDeleted()
          .getOne();
        return result ? result.owner.userId : 0;
      }
    
      async selectMember(spaceId: number): Promise<any[]> {
        const result = await this.createQueryBuilder('space')
          .where('space.spaceId = :spaceId', { spaceId: `${spaceId}` })
          .leftJoin('space.users', 'users')
          .leftJoin('space.owner', 'owner')
          .select(['users.userId as userId', 'owner.userId as ownerId'])
          .getRawMany();
        return result;
      }
    
}