import { Inject, Injectable } from '@nestjs/common';
import { Role } from './entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RolesService {
  @InjectRepository(Role)
  private readonly roleRepository: Repository<Role>;
  async getRoleList(body: any) {
    return await this.roleRepository.find();
  }
}
